const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
const { readFile } = require("fs").promises;
import * as pty from "node-pty";

// Analytics
import { initialize, trackEvent } from "@aptabase/electron/main";

// Helpers
import { createWindow } from "./helpers";
import {
  executeDfxCommand,
  executeBundledDfxCommand,
} from "./helpers/dfx-helper";
import { handleIdentities } from "./helpers/manage-identities";
import { handleProjects } from "./helpers/manage-projects";
import {
  updateProfileWithEnvVars,
  readEnvVarsFromProfiles,
} from "./helpers/env-variables";
import { checkEditors } from "./helpers/check-editors";
import { openProjectInEditor } from "./helpers/open-project-in-editor";
import runCommand from "./helpers/run-command";

const path = require("node:path");
const fs = require("fs");
const { shell } = require("electron");
const { spawn } = require("child_process");
const log = require("electron-log/main");
const { autoUpdater } = require("electron-updater");

const isProd: boolean = process.env.NODE_ENV === "production";

const Store = require("electron-store");

// Set up logging
const commandLog = log.create("command");
commandLog.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}]  {text}";
commandLog.transports.file.fileName = "dfx-commands.log";
commandLog.transports.file.file = path.join(
  app.getPath("userData"),
  "dfx-commands.log"
);

const schema = {
  projects: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        path: { type: "string" },
        active: { type: "boolean" },
      },
      required: ["name", "path"],
    },
  },
  identities: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        isInternetIdentity: { type: "boolean" },
        internetIdentity: {
          type: "string",
        },
        isActive: { type: "boolean" },
      },
    },
  },
  settings: {
    type: "object",
    patternProperties: {
      ".*": {
        type: ["string", "number", "boolean", "object", "array"],
      },
    },
    additionalProperties: true,
  },
  useBundledDfx: {
    type: "boolean",
    default: true,
  },
  trackingAllowed: {
    type: "boolean",
    default: true,
  },
  networkPreference: {
    type: "string",
    default: "local",
  },
  networks: {
    type: "object",
    default: {
      local: { type: "local" },
      ic: { type: "ic" },
    },
  },
};

const store = new Store({ schema });

autoUpdater.setFeedURL({
  provider: "github",
  owner: "tolgayayci",
  repo: "dfx-dashboard",
  releaseType: "release",
});

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
let bundledDfxPath: string;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("dfx", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("dfx");
}

const gotTheLock = app.requestSingleInstanceLock();

function getBundledDfxPath(): string {
  const isProduction = app.isPackaged;
  let basePath: string;
  let resourcePath: string;

  if (isProduction) {
    basePath = path.dirname(app.getPath("exe"));
    resourcePath = path.join(basePath, "..", "Resources");
  } else {
    basePath = app.getAppPath();
    resourcePath = path.join(basePath, "resources");
  }

  const platformFolder = process.platform === "darwin" ? "mac" : "linux";
  const dfxPath = path.join(
    resourcePath,
    platformFolder,
    "dfx-extracted",
    "dfx"
  );

  console.log("Bundled DFX Path:", dfxPath);

  return dfxPath;
}

async function isSystemDfxAvailable() {
  try {
    await executeDfxCommand("--version");
    return true;
  } catch (error) {
    console.log("System DFX not available:", error);
    return false;
  }
}

if (!gotTheLock) {
  app.quit();
} else {
  app.on("open-url", function (event, url) {
    event.preventDefault();
    console.log("open-url event: " + url);
  });

  app.whenReady().then(async () => {
    let useBundledDfx = store.get("useBundledDfx");

    // Handle tracking preference
    let trackingAllowed = store.get("trackingAllowed");

    if (typeof trackingAllowed === "undefined") {
      trackingAllowed = true; // Default to true if not set
      store.set("trackingAllowed", trackingAllowed);
    }

    // Initialize Aptabase Analytics if tracking is allowed
    if (trackingAllowed) {
      initialize("A-EU-1521640385");
      console.log("Analytics initialized");
    } else {
      console.log("Analytics disabled");
    }

    // If it's not set, determine the default value
    if (typeof useBundledDfx === "undefined") {
      const systemDfxAvailable = await isSystemDfxAvailable();
      useBundledDfx = !systemDfxAvailable; // Use bundled only if system is not available
      store.set("useBundledDfx", useBundledDfx);
    }

    console.log("Use Bundled Dfx:", useBundledDfx);

    mainWindow = createWindow("main", {
      width: 1500,
      height: 700,
      minWidth: 1250,
      minHeight: 650,
      webPreferences: {
        preload: path.join(__dirname, "../main/preload.js"),
      },
    });

    autoUpdater.checkForUpdatesAndNotify();

    // Track app_started event if tracking is allowed
    if (trackingAllowed) {
      trackEvent("app_started");
    }

    bundledDfxPath = getBundledDfxPath();
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();

    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);

    if (searchParams.has("delegation")) {
      const delegationParam = searchParams.get("delegation");

      mainWindow.webContents.send("delegation-received", delegationParam);
    }
  });
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    return filePaths[0];
  }
}

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  ipcMain.handle("app:reload", () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  ipcMain.handle("open-external-link", async (event, url) => {
    if (url) {
      await shell.openExternal(url);
    }
  });

  let ptyProcess: pty.IPty | null = null;

  ipcMain.handle(
    "run-assisted-command",
    async (event, command, canisterName, customPath, methodName) => {
      const shell = process.platform === "win32" ? "powershell.exe" : "bash";
      ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: customPath,
        env: process.env,
      });

      return new Promise<string>((resolve) => {
        let output = "";
        ptyProcess.onData((data) => {
          output += data;
          event.sender.send("assisted-command-output", {
            type: "stdout",
            content: data,
          });

          if (
            data.includes("?") ||
            data.toLowerCase().includes("enter") ||
            data.includes("Do you want to send this message?")
          ) {
            event.sender.send("assisted-command-input-required", {
              prompt: data,
            });
          }
        });

        ptyProcess.onExit(() => {
          ptyProcess = null;
          resolve(output);
        });

        const dfxCommand = ["dfx", "canister", command];
        if (command === "call" || command === "sign") {
          dfxCommand.push(canisterName, methodName);
        } else {
          dfxCommand.push(canisterName);
        }
        dfxCommand.push("--always-assist");

        ptyProcess.write(`${dfxCommand.join(" ")}\r`);
      });
    }
  );

  ipcMain.handle("assisted-command-input", (event, input: string) => {
    if (ptyProcess) {
      ptyProcess.write(`${input}\r`);
      return { success: true };
    } else {
      return { success: false, error: "No active assisted command process" };
    }
  });

  ipcMain.handle("terminate-assisted-command", () => {
    if (ptyProcess) {
      ptyProcess.kill();
      ptyProcess = null;
      return { success: true };
    } else {
      return { success: false, error: "No active assisted command process" };
    }
  });

  // Store operations
  ipcMain.handle("store:get", async (event, key: string) => {
    try {
      const value = store.get(key);
      return { success: true, value };
    } catch (error) {
      console.error("Failed to get store value:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("store:set", async (event, key: string, value: any) => {
    try {
      store.set(key, value);
      return { success: true };
    } catch (error) {
      console.error("Failed to set store value:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("store:delete", (event, key) => {
    try {
      store.delete(key);
      return { success: true, message: `Successfully deleted ${key}` };
    } catch (error) {
      console.error("Error deleting value:", error);
      return { success: false, message: error.toString() };
    }
  });

  ipcMain.handle("store:get-tracking", async (event, key) => {
    return store.get(key);
  });

  ipcMain.handle("store:set-tracking", async (event, key, value) => {
    store.set(key, value);
    return { success: true };
  });

  ipcMain.handle("check-editors", async () => {
    return await checkEditors();
  });

  ipcMain.handle("open-editor", async (event, projectPath, editor) => {
    return await openProjectInEditor(projectPath, editor);
  });

  ipcMain.handle("get-app-version", async () => {
    const packagePath = path.join(app.getAppPath(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageJson.version;
  });

  ipcMain.handle("runCommand", async (event, command: string) => {
    return await runCommand(command);
  });

  ipcMain.handle("get-dfx-version", async (event) => {
    console.log("Getting DFX and DFXVM versions");

    const extractVersionNumber = (versionString: string): string => {
      const match = versionString.match(/\d+\.\d+\.\d+/);
      return match ? match[0] : "Unknown";
    };

    const getDfxVersion = async () => {
      const useBundledDfx = store.get("useBundledDfx");
      console.log(`Fetching DFX version. Using bundled DFX: ${useBundledDfx}`);

      async function executeDfxVersionCommand(
        useBundled: boolean
      ): Promise<string> {
        try {
          if (useBundled) {
            console.log("Attempting to use bundled DFX for version check");
            return await executeBundledDfxCommand(bundledDfxPath, "--version");
          } else {
            console.log("Attempting to use system DFX for version check");
            return await executeDfxCommand("--version");
          }
        } catch (error) {
          console.error(
            `Error executing ${
              useBundled ? "bundled" : "system"
            } DFX for version check:`,
            error
          );
          throw error;
        }
      }

      try {
        const versionOutput = await executeDfxVersionCommand(useBundledDfx);
        const version = extractVersionNumber(versionOutput);
        console.log(`DFX version retrieved: ${version}`);
        return {
          version,
          type: useBundledDfx ? "bundled" : "system",
          error: null,
        };
      } catch (error) {
        console.error("Error fetching DFX version:", error);

        if (useBundledDfx) {
          console.log("Attempting fallback to system DFX for version check...");
          try {
            const systemDfxAvailable = await isSystemDfxAvailable();
            if (systemDfxAvailable) {
              const versionOutput = await executeDfxVersionCommand(false);
              const version = extractVersionNumber(versionOutput);
              console.log(`DFX version retrieved (fallback): ${version}`);
              store.set("useBundledDfx", false);
              return { version, type: "system", error: null };
            } else {
              console.error("System DFX not available for fallback");
              return {
                version: null,
                type: "unknown",
                error:
                  "Failed to fetch DFX version and system DFX is not available for fallback",
              };
            }
          } catch (fallbackError) {
            console.error("Error with fallback to system DFX:", fallbackError);
            return {
              version: null,
              type: "unknown",
              error:
                "Failed to fetch DFX version with both bundled and system DFX",
            };
          }
        } else {
          return {
            version: null,
            type: "unknown",
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch DFX version",
          };
        }
      }
    };

    const getDfxvmVersion = async () => {
      console.log("Fetching DFXVM version");
      try {
        const versionOutput = await runCommand("dfxvm --version");
        const version = extractVersionNumber(versionOutput);
        console.log(`DFXVM version retrieved: ${version}`);
        return { version, error: null };
      } catch (error) {
        console.error("Error fetching DFXVM version:", error);
        return {
          version: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch DFXVM version",
        };
      }
    };

    try {
      const [dfxResult, dfxvmResult] = await Promise.all([
        getDfxVersion(),
        getDfxvmVersion(),
      ]);

      const result = {
        dfx: dfxResult.version || "Not installed",
        dfxType: dfxResult.type,
        dfxError: dfxResult.error,
        dfxvm: dfxvmResult.version || "Not installed",
        dfxvmError: dfxvmResult.error,
      };

      console.log("DFX and DFXVM version check complete:", result);
      trackEvent("version-check-complete", {
        dfxVersion: result.dfx,
        dfxType: result.dfxType,
        dfxvmVersion: result.dfxvm,
      });

      return result;
    } catch (error) {
      console.error("Unexpected error in get-dfx-version handler:", error);
      trackEvent("version-check-failed", { error: error.message });
      return {
        dfx: "Error",
        dfxType: "unknown",
        dfxError: "Unexpected error occurred",
        dfxvm: "Error",
        dfxvmError: "Unexpected error occurred",
      };
    }
  });

  ipcMain.handle("fetch-command-logs", async () => {
    try {
      const commandLogFilePath = commandLog.transports.file.getFile().path;
      const data = await readFile(commandLogFilePath, "utf-8");
      return data;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle("check-file-exists", async (event, filePath) => {
    return fs.existsSync(filePath);
  });

  ipcMain.handle("dialog:openDirectory", handleFileOpen);

  // Store: Projects Handler
  ipcMain.handle("store:manageProjects", async (event, action, project) => {
    try {
      trackEvent("project_action", { action, project });
      log.info(
        "Project Interaction. Action:",
        action,
        project ? "Project: " + project : ""
      );
      const result = await handleProjects(store, action, project);
      return result;
    } catch (error) {
      console.error("Error on projects:", error);
      throw error;
    }
  });

  ipcMain.handle(
    "store:manageIdentities",
    async (event, action, identity, newIdentity?) => {
      try {
        trackEvent("identity_action", { action, identity, newIdentity });
        log.info(
          "Identity Interaction.",
          action ? "Action: " + action : "",
          identity ? "Identity: " + identity : "",
          newIdentity ? "New Identity: " + newIdentity : ""
        );
        const result = await handleIdentities(
          store,
          action,
          identity,
          newIdentity
        );
        return result;
      } catch (error) {
        console.error("Error on identities:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("is-dfx-project", async (event, directoryPath) => {
    try {
      const dfxConfigPath = path.join(directoryPath, "dfx.json");
      return fs.existsSync(dfxConfigPath);
    } catch (error) {
      console.error(`Error while checking for Dfinity project: ${error}`);
      return false;
    }
  });

  ipcMain.handle("is-dfx-installed", async (event) => {
    try {
      if (mainWindow) {
        const result = await executeDfxCommand("--version");
        if (typeof result === "string") {
          const isDfxInstalled = result.trim().startsWith("dfx");
          return isDfxInstalled;
        } else {
          console.error("Unexpected result type from executeDfxCommand");
          return false;
        }
      } else {
        console.error("Main window not found");
        return false;
      }
    } catch (error) {
      console.error(`Error while checking for Dfinity installation: ${error}`);
      return false;
    }
  });

  ipcMain.handle("canister:list", async (event, directoryPath) => {
    try {
      return new Promise((resolve, reject) => {
        fs.readFile(`${directoryPath}/dfx.json`, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading file:", err);
            reject(err);
            return;
          }

          try {
            resolve(JSON.parse(data));
          } catch (err) {
            console.error("Error parsing JSON:", err);
            reject(err);
          }
        });
      });
    } catch (error) {
      console.error(`Error while listing canisters: ${error}`);
      return false;
    }
  });

  // IPC handler for listing NNS canisters
  ipcMain.handle("canister:list-nns", async (event, network: string) => {
    try {
      // Validate input
      if (!['local', 'ic'].includes(network)) {
        throw new Error('Invalid network. Must be "local" or "ic"');
      }

      // Well-known NNS canister IDs for different networks
      const nnsCanisterIds = {
        local: {
          'nns-registry': 'rwlgt-iiaaa-aaaaa-aaaaa-cai',
          'nns-governance': 'rrkah-fqaaa-aaaaa-aaaaq-cai',
          'nns-ledger': 'ryjl3-tyaaa-aaaaa-aaaba-cai',
          'nns-root': 'r7inp-6aaaa-aaaaa-aaabq-cai',
          'nns-cycles-minting': 'rkp4c-7iaaa-aaaaa-aaaca-cai',
          'nns-lifeline': 'rno2w-sqaaa-aaaaa-aaacq-cai',
          'nns-genesis-token': 'renrk-eyaaa-aaaaa-aaada-cai',
          'nns-sns-wasm': 'qaa6y-5yaaa-aaaaa-aaafa-cai'
        },
        ic: {
          'nns-registry': 'rwlgt-iiaaa-aaaaa-aaaaa-cai',
          'nns-governance': 'rrkah-fqaaa-aaaaa-aaaaq-cai',
          'nns-ledger': 'ryjl3-tyaaa-aaaaa-aaaba-cai',
          'nns-root': 'r7inp-6aaaa-aaaaa-aaabq-cai',
          'nns-cycles-minting': 'rkp4c-7iaaa-aaaaa-aaaca-cai',
          'nns-lifeline': 'rno2w-sqaaa-aaaaa-aaacq-cai',
          'nns-genesis-token': 'renrk-eyaaa-aaaaa-aaada-cai',
          'nns-sns-wasm': 'qaa6y-5yaaa-aaaaa-aaafa-cai'
        }
      };

      const canisters = nnsCanisterIds[network];
      const nnsCanisters = Object.entries(canisters).map(([name, canister_id]) => ({
        name,
        canister_id,
        type: 'nns' as const,
        network,
        status: 'Running', // NNS canisters are always running
        projectName: 'Network Nervous System',
        path: null // NNS canisters don't belong to a project
      }));

      console.log(`Listed ${nnsCanisters.length} NNS canisters for network: ${network}`);
      return { success: true, data: nnsCanisters };
    } catch (error) {
      console.error('Failed to list NNS canisters:', error);
      return { success: false, error: error.message };
    }
  });

  // IPC handler for reading the JSON file
  ipcMain.handle("json:read", async (event, filePath, directoryPath) => {
    try {
      const data = fs.readFileSync(path.join(filePath, directoryPath), "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read file", error);
      return null; // or handle error as needed
    }
  });

  // IPC handler for updating the JSON file
  ipcMain.handle(
    "json:update",
    async (event, filePath, directoryPath, jsonContent) => {
      try {
        fs.writeFileSync(
          path.join(filePath, directoryPath),
          JSON.stringify(jsonContent, null, 2),
          "utf8"
        );
        return true; // success
      } catch (error) {
        console.error("Failed to write file", error);
        return false; // or handle error as needed
      }
    }
  );

  // IPC handler for getting canister metadata
  ipcMain.handle("canister:get-metadata", async (event, canisterName: string, network: string, projectPath?: string) => {
    try {
      console.log(`Getting metadata for canister: ${canisterName} on network: ${network}`);
      
      // Validate inputs
      if (!canisterName) {
        throw new Error('Canister name is required');
      }
      if (!network) {
        throw new Error('Network is required');
      }

      const useBundledDfx = store.get("useBundledDfx");
      
      // Common metadata types to retrieve
      const metadataTypes = [
        'candid:service',
        'candid:args', 
        'dfx:wasm_url',
        'dfx:deps',
        'dfx:init',
        'cdk:name',
        'cdk:version'
      ];

      const metadata: Record<string, any> = {};
      
      // Function to execute metadata command with fallback
      const executeMetadataCommand = async (useBundled: boolean, metadataType: string): Promise<string> => {
        try {
          if (useBundled) {
            return await executeBundledDfxCommand(
              bundledDfxPath,
              "canister",
              "metadata",
              [canisterName, metadataType],
              ["--network", network],
              projectPath
            );
          } else {
            return await executeDfxCommand(
              "canister",
              "metadata",
              [canisterName, metadataType],
              ["--network", network],
              projectPath
            );
          }
        } catch (error) {
          console.error(`Error executing ${useBundled ? "bundled" : "system"} DFX for metadata ${metadataType}:`, error);
          throw error;
        }
      };

      // Retrieve each metadata type
      for (const metadataType of metadataTypes) {
        try {
          let result = await executeMetadataCommand(useBundledDfx, metadataType);
          
          // Clean up the result - remove extra whitespace and quotes if present
          result = result.trim();
          if (result.startsWith('"') && result.endsWith('"')) {
            result = result.slice(1, -1);
          }
          
          metadata[metadataType] = result;
          console.log(`Retrieved metadata ${metadataType}: ${result.substring(0, 100)}...`);
        } catch (error) {
          // If bundled dfx fails, try system dfx as fallback
          if (useBundledDfx) {
            try {
              const systemDfxAvailable = await isSystemDfxAvailable();
              if (systemDfxAvailable) {
                const result = await executeMetadataCommand(false, metadataType);
                metadata[metadataType] = result.trim();
                console.log(`Retrieved metadata ${metadataType} with system dfx fallback`);
              } else {
                console.warn(`Metadata ${metadataType} not available and no system dfx fallback`);
                metadata[metadataType] = null;
              }
            } catch (fallbackError) {
              console.warn(`Failed to get metadata ${metadataType} with both bundled and system dfx:`, fallbackError);
              metadata[metadataType] = null;
            }
          } else {
            console.warn(`Failed to get metadata ${metadataType}:`, error);
            metadata[metadataType] = null;
          }
        }
      }

      console.log(`Successfully retrieved metadata for canister: ${canisterName}`);
      return { success: true, data: metadata };
    } catch (error) {
      console.error('Failed to get canister metadata:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(
    "dfx-command",
    async (event, command, subcommand, args?, flags?, path?) => {
      const useBundledDfx = store.get("useBundledDfx");
      console.log(`Executing DFX command. Using bundled DFX: ${useBundledDfx}`);
      console.log(
        `Command: ${command}, Subcommand: ${subcommand}, Args: ${args}, Flags: ${flags}, Path: ${path}`
      );

      async function executeDfxCommandWithFallback(
        useBundled: boolean
      ): Promise<string> {
        try {
          if (useBundled) {
            console.log("Attempting to use bundled DFX");
            return await executeBundledDfxCommand(
              bundledDfxPath,
              command,
              subcommand,
              args,
              flags,
              path
            );
          } else {
            console.log("Attempting to use system DFX");
            return await executeDfxCommand(
              command,
              subcommand,
              args,
              flags,
              path
            );
          }
        } catch (error) {
          console.error(
            `Error executing ${useBundled ? "bundled" : "system"} DFX:`,
            error
          );
          throw error;
        }
      }

      try {
        let result = await executeDfxCommandWithFallback(useBundledDfx);

        trackEvent("dfx-command-executed", {
          command,
          subcommand,
          usedBundledDfx: useBundledDfx,
        });

        if (command === "canister") {
          const formattedResult = result
            ? `Result: ${JSON.stringify(result)}`
            : "";
          commandLog.info(
            "dfx",
            command,
            subcommand || "",
            args ? args.join(" ") : "",
            flags ? flags.join(" ") : "",
            path || "",
            formattedResult
          );
        }

        console.log("DFX command executed successfully");
        return result;
      } catch (error) {
        console.error(`Error while executing DFX command:`, error);

        if (useBundledDfx) {
          console.log("Attempting fallback to system DFX...");
          try {
            const systemDfxAvailable = await isSystemDfxAvailable();
            if (systemDfxAvailable) {
              const result = await executeDfxCommandWithFallback(false);
              console.log(
                "Fallback to system DFX successful. Updating preference."
              );
              store.set("useBundledDfx", false);
              return result;
            } else {
              console.error("System DFX not available for fallback");

              throw new Error(
                "Failed to execute DFX command and system DFX is not available for fallback"
              );
            }
          } catch (fallbackError) {
            console.error("Error with fallback to system DFX:", fallbackError);

            throw new Error(
              "Failed to execute DFX command with both bundled and system DFX"
            );
          }
        } else {
          console.error("Error with system DFX and no fallback available");
          throw error;
        }
      }
    }
  );

  ipcMain.handle("env:update-script", async (event, path, key, value) => {
    try {
      updateProfileWithEnvVars(path, key, value);
      return {
        message: "Environment script updated successfully.",
      };
    } catch (error) {
      console.error("Failed to update environment script:", error);
      return { message: error };
    }
  });

  ipcMain.handle("env:read-script", async (event) => {
    try {
      const envVars = readEnvVarsFromProfiles();
      return envVars;
    } catch (error) {
      console.error("Failed to read environment script:", error);
      return { error };
    }
  });

  ipcMain.handle("get-networks", () => {
    try { 
      return store.get("networks");
    } catch (error) {
      console.error("Error getting networks:", error);
      return [];
    }
  });

  ipcMain.handle("get-network-preference", () => {
    try {
      const preference = store.get("networkPreference", "local");
      console.log("Getting network preference:", preference);
      return preference;
    } catch (error) {
      console.error("Error getting network preference:", error);
      return "local";
    }
  });

  ipcMain.handle("set-network-preference", (event, preference: string) => {
    try { 
      console.log("Setting network preference to:", preference);
      store.set("networkPreference", preference);
      return store.get("networkPreference");
    } catch (error) {
      console.error("Error setting network preference:", error);
      return "local";
    }
  });

  ipcMain.handle('read-methods-from-file', async (event, filePath) => {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const methods = parseCandidFile(content);
      console.log(`Detected methods for ${filePath}:`, methods);
      return methods;
    } catch (error) {
      console.error('Error reading methods from file:', error);
      return [];
    }
  });

  function parseCandidFile(content: string): string[] {
    const serviceRegex = /service\s*:.*?{([\s\S]*?)}/;
    const methodRegex = /^\s*(\w+)\s*:/gm;
    const methods = [];

    const serviceMatch = serviceRegex.exec(content);
    if (serviceMatch && serviceMatch[1]) {
      const serviceContent = serviceMatch[1];
      let match;
      while ((match = methodRegex.exec(serviceContent)) !== null) {
        methods.push(match[1]);
      }
    }

    return methods;
  }

  async function retrieveAndStoreIdentities() {
    const useBundledDfx = store.get("useBundledDfx");
    console.log(`Retrieving identities. Using bundled DFX: ${useBundledDfx}`);

    async function executeIdentityListCommand(
      useBundled: boolean
    ): Promise<string> {
      console.log(
        `Executing identity list command. Using bundled DFX: ${useBundled}`
      );
      try {
        if (useBundled) {
          console.log("Attempting to use bundled DFX for identity list");
          return await executeBundledDfxCommand(
            bundledDfxPath,
            "identity",
            "list"
          );
        } else {
          console.log("Attempting to use system DFX for identity list");
          return await executeDfxCommand("identity", "list");
        }
      } catch (error) {
        console.error(
          `Error executing ${
            useBundled ? "bundled" : "system"
          } DFX for identity list:`,
          error
        );
        throw error;
      }
    }

    try {
      const result = await executeIdentityListCommand(useBundledDfx);
      if (typeof result !== "string") {
        throw new Error("Unexpected result type from DFX command");
      }

      const identityNames = result
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name !== "" && name !== "*");

      const newIdentities = identityNames.map((name) => ({
        name: name,
        isInternetIdentity: false,
      }));

      store.set("identities", newIdentities);
      console.log("Identities updated successfully:", newIdentities);
      trackEvent("identities-retrieved", {
        count: newIdentities.length,
        usedBundledDfx: useBundledDfx,
      });
      return newIdentities;
    } catch (error) {
      console.error("Error retrieving identities:", error);

      if (useBundledDfx) {
        console.log("Attempting fallback to system DFX for identity list...");
        try {
          const systemDfxAvailable = await isSystemDfxAvailable();
          if (systemDfxAvailable) {
            const result = await executeIdentityListCommand(false);
            console.log(
              "Fallback to system DFX successful. Updating preference."
            );
            store.set("useBundledDfx", false);

            const identityNames = result
              .split("\n")
              .map((name) => name.trim())
              .filter((name) => name !== "" && name !== "*");

            const newIdentities = identityNames.map((name) => ({
              name: name,
              isInternetIdentity: false,
            }));

            store.set("identities", newIdentities);
            console.log(
              "Identities updated successfully using system DFX:",
              newIdentities
            );

            return newIdentities;
          } else {
            console.error("System DFX not available for fallback");
            trackEvent("identities-retrieval-failed", {
              reason: "system-dfx-unavailable",
            });
            throw new Error(
              "Failed to retrieve identities and system DFX is not available for fallback"
            );
          }
        } catch (fallbackError) {
          console.error("Error with fallback to system DFX:", fallbackError);
          trackEvent("identities-retrieval-failed", {
            reason: "execution-error",
          });
          throw new Error(
            "Failed to retrieve identities with both bundled and system DFX"
          );
        }
      } else {
        console.error("Error with system DFX and no fallback available");
        trackEvent("identities-retrieval-failed", { usedBundledDfx: false });
        throw error;
      }
    }
  }

  ipcMain.handle("identity:refresh", async (event) => {
    try {
      const envVars = retrieveAndStoreIdentities();
      return envVars;
    } catch (error) {
      console.error("Failed to read identities from dfx:", error);
      return { error };
    }
  });

  await retrieveAndStoreIdentities();

  ipcMain.handle("get-dfx-preference", () => {
    const preference = store.get("useBundledDfx");
    console.log("Getting DFX preference:", preference);
    return preference;
  });

  ipcMain.handle("set-dfx-preference", async (event, useBundled: boolean) => {
    console.log("Setting DFX preference to:", useBundled);

    if (!useBundled) {
      // Check if system DFX is available before allowing to switch
      const systemDfxAvailable = await isSystemDfxAvailable();
      if (!systemDfxAvailable) {
        console.log("Cannot switch to system DFX as it's not available");
        return store.get("useBundledDfx"); // Return current value without changing
      }
    }

    store.set("useBundledDfx", useBundled);
    return store.get("useBundledDfx"); // Return the new value to confirm it's set
  });

  ipcMain.handle("get-dfx-versions", async () => {
    let systemVersion = "Not installed";
    let bundledVersion = "Not available";
    const useBundledDfx = store.get("useBundledDfx", false);

    try {
      if (useBundledDfx) {
        bundledVersion = await executeBundledDfxCommand(
          bundledDfxPath,
          "--version"
        );

        systemVersion = await executeDfxCommand("--version");
      } else {
        systemVersion = await executeDfxCommand("--version");
      }
    } catch (error) {
      console.error(
        `Error getting ${useBundledDfx ? "bundled" : "system"} DFX version:`,
        error
      );
    }

    return {
      system: systemVersion,
      bundled: bundledVersion,
    };
  });

  ipcMain.handle("run-install-command", async (event, version) => {
    const shell = process.platform === "win32" ? "powershell.exe" : "bash";
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: process.env,
    });

    ptyProcess.onData((data) => {
      event.sender.send("install-output", { content: data });
    });

    const command = `dfxvm install ${version}`;
    ptyProcess.write(`${command}\r`);

    return new Promise<void>((resolve, reject) => {
      ptyProcess.onExit(({ exitCode }) => {
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error(`Installation failed with exit code ${exitCode}`));
        }
      });
    });
  });

  // Cycles IPC Handlers
  ipcMain.handle("cycles:balance", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add precise option
      if (options.precise) {
        args.push("--precise");
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "balance", args);
      } else {
        result = await executeDfxCommand("cycles", "balance", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error getting cycles balance:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cycles:approve", async (event, spender, amount, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [spender, amount];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add memo option
      if (options.memo) {
        args.push("--memo", options.memo);
      }
      
      // Add expires-at option
      if (options.expiresAt) {
        args.push("--expires-at", options.expiresAt);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "approve", args);
      } else {
        result = await executeDfxCommand("cycles", "approve", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error approving cycles:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cycles:transfer", async (event, to, amount, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [to, amount];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add memo option
      if (options.memo) {
        args.push("--memo", options.memo);
      }
      
      // Add from-subaccount option
      if (options.fromSubaccount) {
        args.push("--from-subaccount", options.fromSubaccount);
      }
      
      // Add to-subaccount option
      if (options.toSubaccount) {
        args.push("--to-subaccount", options.toSubaccount);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "transfer", args);
      } else {
        result = await executeDfxCommand("cycles", "transfer", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error transferring cycles:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cycles:top-up", async (event, canister, amount, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [canister, amount];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add from-subaccount option
      if (options.fromSubaccount) {
        args.push("--from-subaccount", options.fromSubaccount);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "top-up", args);
      } else {
        result = await executeDfxCommand("cycles", "top-up", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error topping up canister:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cycles:convert", async (event, amount, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [amount];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add to-subaccount option
      if (options.toSubaccount) {
        args.push("--to-subaccount", options.toSubaccount);
      }
      
      // Add memo option
      if (options.memo) {
        args.push("--memo", options.memo);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "convert", args);
      } else {
        result = await executeDfxCommand("cycles", "convert", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error converting ICP to cycles:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cycles:redeem-faucet-coupon", async (event, coupon, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [coupon];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cycles", "redeem-faucet-coupon", args);
      } else {
        result = await executeDfxCommand("cycles", "redeem-faucet-coupon", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error redeeming faucet coupon:", error);
      return { success: false, error: error.message };
    }
  });

  // Wallet IPC Handlers
  ipcMain.handle("wallet:get-balance", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add precise option if available
      if (options.precise) {
        args.push("--precise");
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "balance", args);
      } else {
        result = await executeDfxCommand("wallet", "balance", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:send-cycles", async (event, destination, amount, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [destination, amount];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "send", args);
      } else {
        result = await executeDfxCommand("wallet", "send", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending cycles:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:list-controllers", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "controllers", args);
      } else {
        result = await executeDfxCommand("wallet", "controllers", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error listing wallet controllers:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:add-controller", async (event, controllerId, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [controllerId];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "add-controller", args);
      } else {
        result = await executeDfxCommand("wallet", "add-controller", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error adding wallet controller:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:remove-controller", async (event, controllerId, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [controllerId];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "remove-controller", args);
      } else {
        result = await executeDfxCommand("wallet", "remove-controller", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error removing wallet controller:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:list-custodians", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      console.log(`Executing dfx wallet custodians with args:`, args);
      
      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "custodians", args);
      } else {
        result = await executeDfxCommand("wallet", "custodians", args);
      }

      console.log(`dfx wallet custodians result:`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error listing wallet custodians:", error);
      console.error("Error details:", error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:authorize-custodian", async (event, custodianId, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [custodianId];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "authorize", args);
      } else {
        result = await executeDfxCommand("wallet", "authorize", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error authorizing wallet custodian:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:deauthorize-custodian", async (event, custodianId, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [custodianId];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "deauthorize", args);
      } else {
        result = await executeDfxCommand("wallet", "deauthorize", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error deauthorizing wallet custodian:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:get-dfx-addresses", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "addresses", args);
      } else {
        result = await executeDfxCommand("wallet", "addresses", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error getting wallet addresses:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:get-name", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "name", args);
      } else {
        result = await executeDfxCommand("wallet", "name", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error getting wallet name:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:set-name", async (event, name, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [name];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "set-name", args);
      } else {
        result = await executeDfxCommand("wallet", "set-name", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error setting wallet name:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:upgrade-wallet", async (event, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "upgrade", args);
      } else {
        result = await executeDfxCommand("wallet", "upgrade", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error upgrading wallet:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:redeem-faucet-coupon", async (event, coupon, options = {}) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      const args: string[] = [coupon];
      
      // Add network option
      if (options.network) {
        args.push("--network", options.network);
      }
      
      // Add faucet option if provided
      if (options.faucet) {
        args.push("--faucet", options.faucet);
      }
      
      // Add yes flag for non-interactive mode
      if (options.yes) {
        args.push("--yes");
      }

      let result: string;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "wallet", "redeem-faucet-coupon", args);
      } else {
        result = await executeDfxCommand("wallet", "redeem-faucet-coupon", args);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error redeeming faucet coupon:", error);
      return { success: false, error: error.message };
    }
  });

  // Local address book management (stored in Electron Store)
  ipcMain.handle("wallet:save-address", async (event, address, label, type = 'principal') => {
    try {
      const addresses = store.get("wallet.addresses", []);
      const newAddress = {
        id: Date.now().toString(),
        address,
        label,
        type,
        createdAt: new Date().toISOString()
      };
      
      addresses.push(newAddress);
      store.set("wallet.addresses", addresses);
      
      return { success: true, data: newAddress };
    } catch (error) {
      console.error("Error saving address:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:get-addresses", async () => {
    try {
      const addresses = store.get("wallet.addresses", []);
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Error getting addresses:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wallet:delete-address", async (event, addressId) => {
    try {
      const addresses = store.get("wallet.addresses", []);
      const filteredAddresses = addresses.filter(addr => addr.id !== addressId);
      store.set("wallet.addresses", filteredAddresses);
      
      return { success: true, data: filteredAddresses };
    } catch (error) {
      console.error("Error deleting address:", error);
      return { success: false, error: error.message };
    }
  });

  // Settings IPC handlers
  ipcMain.handle("settings:detect-shell", async () => {
    try {
      const shell = process.env.SHELL || "/bin/bash";
      const shellName = path.basename(shell);
      
      return { 
        success: true, 
        data: {
          shell: shell,
          shellName: shellName,
          supported: ["bash", "zsh", "fish", "elvish", "powershell"].includes(shellName)
        }
      };
    } catch (error) {
      console.error("Error detecting shell:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("settings:setup-completion", async (event, enable: boolean) => {
    try {
      const shell = process.env.SHELL || "/bin/bash";
      const shellName = path.basename(shell);
      const homeDir = require("os").homedir();
      
      if (!enable) {
        return { 
          success: true, 
          data: "Completion setup disabled. Manual removal instructions provided." 
        };
      }

      // Generate completion script
      const useBundledDfx = store.get("useBundledDfx", false);
      let completionScript: string;
      
      if (useBundledDfx) {
        completionScript = await executeBundledDfxCommand(bundledDfxPath, "completion", shellName);
      } else {
        completionScript = await executeDfxCommand("completion", shellName);
      }

      // Determine the appropriate shell config file
      let configFile: string;
      switch (shellName) {
        case "zsh":
          configFile = path.join(homeDir, ".zshrc");
          break;
        case "bash":
          configFile = path.join(homeDir, ".bashrc");
          // Also check for .bash_profile on macOS
          if (process.platform === "darwin" && !fs.existsSync(configFile)) {
            configFile = path.join(homeDir, ".bash_profile");
          }
          break;
        case "fish":
          const fishConfigDir = path.join(homeDir, ".config", "fish", "completions");
          if (!fs.existsSync(fishConfigDir)) {
            fs.mkdirSync(fishConfigDir, { recursive: true });
          }
          configFile = path.join(fishConfigDir, "dfx.fish");
          break;
        default:
          throw new Error(`Unsupported shell: ${shellName}`);
      }

      // For fish, write the completion script directly
      if (shellName === "fish") {
        fs.writeFileSync(configFile, completionScript);
      } else {
        // For bash/zsh, append source command to config file
        const sourceCommand = `\n# DFX completion (added by DFX Dashboard)\neval "$(dfx completion ${shellName})"\n`;
        
        // Check if completion is already set up
        if (fs.existsSync(configFile)) {
          const currentContent = fs.readFileSync(configFile, "utf8");
          if (currentContent.includes("dfx completion")) {
            return { 
              success: true, 
              data: "DFX completion is already configured in your shell." 
            };
          }
        }
        
        // Append the source command
        fs.appendFileSync(configFile, sourceCommand);
      }

      return { 
        success: true, 
        data: `DFX completion has been configured for ${shellName}. Please restart your terminal or run 'source ${configFile}' to enable it.` 
      };
    } catch (error) {
      console.error("Error setting up completion:", error);
      return { success: false, error: error.message };
    }
  });

  // Cache management IPC handlers
  ipcMain.handle("cache:list-versions", async () => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      
      // First, get the active version using dfx cache show
      let activeVersionPath: string;
      if (useBundledDfx) {
        activeVersionPath = await executeBundledDfxCommand(bundledDfxPath, "cache", "show");
      } else {
        activeVersionPath = await executeDfxCommand("cache", "show");
      }
      
      const activeVersionPath_trimmed = activeVersionPath.trim();
      const activeVersion = path.basename(activeVersionPath_trimmed);
      const cacheDir = path.dirname(activeVersionPath_trimmed);
      
      // List all folders in the cache directory
      const versions: any[] = [];
      if (fs.existsSync(cacheDir)) {
        const folders = fs.readdirSync(cacheDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .sort(); // Sort versions
        
        for (const folder of folders) {
          const folderPath = path.join(cacheDir, folder);
          let size = "0 MB";
          
          try {
            // Calculate folder size
            const calculateDirSize = (dirPath: string): number => {
              let totalSize = 0;
              const files = fs.readdirSync(dirPath);
              for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                  totalSize += calculateDirSize(filePath);
                } else {
                  totalSize += stats.size;
                }
              }
              return totalSize;
            };
            
            const sizeInBytes = calculateDirSize(folderPath);
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            size = `${sizeInMB} MB`;
          } catch (sizeError) {
            console.warn(`Could not calculate size for ${folder}:`, sizeError);
          }
          
          versions.push({
            version: folder,
            isActive: folder === activeVersion,
            path: folderPath,
            size: size
          });
        }
      }

      return { success: true, data: versions };
    } catch (error) {
      console.error("Error listing cache versions:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cache:get-cache-path", async () => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cache", "show");
      } else {
        result = await executeDfxCommand("cache", "show");
      }

      const cachePath = result.trim();
      
      // Get cache directory (parent of the specific version path)
      const cacheDir = path.dirname(cachePath);
      
      // Calculate total cache size
      let totalSize = "0 MB";
      try {
        const calculateDirSize = (dirPath: string): number => {
          let size = 0;
          if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              if (stats.isDirectory()) {
                size += calculateDirSize(filePath);
              } else {
                size += stats.size;
              }
            }
          }
          return size;
        };

        const sizeInBytes = calculateDirSize(cacheDir);
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        totalSize = `${sizeInMB} MB`;
      } catch (sizeError) {
        console.warn("Could not calculate cache size:", sizeError);
      }

      return { 
        success: true, 
        data: { 
          currentPath: cachePath,
          cacheDir: cacheDir,
          totalSize: totalSize
        } 
      };
    } catch (error) {
      console.error("Error getting cache path:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cache:delete-version", async (event, version) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cache", "delete", [], ["--version", version]);
      } else {
        result = await executeDfxCommand("cache", "delete", [], ["--version", version]);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error deleting cache version:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cache:install-version", async (event, version) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      // Note: dfx cache install installs the current version, not a specific version
      // For installing specific versions, we would need to use dfxvm or download manually
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "cache", "install");
      } else {
        result = await executeDfxCommand("cache", "install");
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error installing cache version:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("cache:clear-all", async () => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      
      // Get cache directory from dfx cache show
      let activeVersionPath: string;
      if (useBundledDfx) {
        activeVersionPath = await executeBundledDfxCommand(bundledDfxPath, "cache", "show");
      } else {
        activeVersionPath = await executeDfxCommand("cache", "show");
      }
      
      const cacheDir = path.dirname(activeVersionPath.trim());
      
      // Get all version folders from cache directory
      const versions: string[] = [];
      if (fs.existsSync(cacheDir)) {
        const folders = fs.readdirSync(cacheDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        versions.push(...folders);
      }

      const deletePromises = versions.map(async (version: string) => {
        try {
          if (useBundledDfx) {
            await executeBundledDfxCommand(bundledDfxPath, "cache", "delete", [], ["--version", version]);
          } else {
            await executeDfxCommand("cache", "delete", [], ["--version", version]);
          }
        } catch (error) {
          console.warn(`Failed to delete version ${version}:`, error);
        }
      });

      await Promise.allSettled(deletePromises);

      return { success: true, data: "Cache cleared successfully" };
    } catch (error) {
      console.error("Error clearing cache:", error);
      return { success: false, error: error.message };
    }
  });

  // Ledger IPC handlers
  ipcMain.handle("ledger:get-account-id", async (event, identity?: string, type?: string) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [];
      if (type === "principal" && identity) {
        args.push("--of-principal", identity);
      }
      
      const options: string[] = [];
      if (identity && type !== "principal") {
        options.push("--identity", identity);
      }
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "account-id", args, options);
      } else {
        result = await executeDfxCommand("ledger", "account-id", args, options);
      }

      return { success: true, data: result.trim() };
    } catch (error) {
      console.error("Error getting account ID:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("ledger:get-balance", async (event, accountId?: string, network = "local") => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [];
      if (accountId) {
        args.push(accountId);
      }
      
      const options: string[] = ["--network", network];
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "balance", args, options);
      } else {
        result = await executeDfxCommand("ledger", "balance", args, options);
      }

      return { success: true, data: result.trim() };
    } catch (error) {
      console.error("Error getting balance:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("ledger:transfer-icp", async (event, to: string, amount: string, memo: string, network = "local", identity?: string) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [to];
      const options: string[] = [
        "--amount", amount,
        "--memo", memo,
        "--network", network
      ];
      
      if (identity) {
        options.push("--identity", identity);
      }
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "transfer", args, options);
      } else {
        result = await executeDfxCommand("ledger", "transfer", args, options);
      }

      // Extract block height from result
      const blockHeightMatch = result.match(/BlockHeight:\s*(\d+)/);
      const blockHeight = blockHeightMatch ? blockHeightMatch[1] : result.trim();

      return { success: true, data: blockHeight };
    } catch (error) {
      console.error("Error transferring ICP:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("ledger:create-canister", async (event, controller: string, amount: string, network = "local", identity?: string) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [controller];
      const options: string[] = [
        "--amount", amount,
        "--network", network
      ];
      
      if (identity) {
        options.push("--identity", identity);
      }
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "create-canister", args, options);
      } else {
        result = await executeDfxCommand("ledger", "create-canister", args, options);
      }

      // Extract canister ID from result
      const canisterIdMatch = result.match(/canister\s+([a-z0-9-]+)/i);
      const canisterId = canisterIdMatch ? canisterIdMatch[1] : result.trim();

      return { success: true, data: canisterId };
    } catch (error) {
      console.error("Error creating canister:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("ledger:top-up-canister", async (event, canisterId: string, amount: string, network = "local", identity?: string) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [canisterId];
      const options: string[] = [
        "--amount", amount,
        "--network", network
      ];
      
      if (identity) {
        options.push("--identity", identity);
      }
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "top-up", args, options);
      } else {
        result = await executeDfxCommand("ledger", "top-up", args, options);
      }

      // Extract block height from result
      const blockHeightMatch = result.match(/BlockHeight:\s*(\d+)/);
      const blockHeight = blockHeightMatch ? blockHeightMatch[1] : result.trim();

      return { success: true, data: blockHeight };
    } catch (error) {
      console.error("Error topping up canister:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("ledger:fabricate-cycles", async (event, canisterId?: string, amount?: string, amountType = "t", all = false) => {
    try {
      const useBundledDfx = store.get("useBundledDfx", false);
      let result: string;
      
      const args: string[] = [];
      const options: string[] = ["--network", "local"]; // Fabricate cycles only works on local network
      
      if (all) {
        options.push("--all");
      } else if (canisterId) {
        options.push("--canister", canisterId);
      }
      
      if (amount) {
        switch (amountType) {
          case "cycles":
            options.push("--cycles", amount);
            break;
          case "icp":
            options.push("--amount", amount);
            break;
          case "t":
            options.push("--t", amount);
            break;
        }
      }
      
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(bundledDfxPath, "ledger", "fabricate-cycles", args, options);
      } else {
        result = await executeDfxCommand("ledger", "fabricate-cycles", args, options);
      }

      return { success: true, data: result.trim() };
    } catch (error) {
      console.error("Error fabricating cycles:", error);
      return { success: false, error: error.message };
    }
  });

  // Ledger operations
  ipcMain.handle("ledger:get-transactions", async (event, identity: string) => {
    try {
      console.log(`Getting transaction history for identity ${identity}`);
      
      // Get the account ID for this identity
      const accountIdResult = await executeDfxCommand(
        "ledger",
        "account-id",
        [],
        ["--identity", identity],
        undefined
      );
      
      const accountId = accountIdResult.trim();
      console.log(`Account ID for identity ${identity}: ${accountId}`);
      
      // For now, return empty data since ICP ledger is not available on local network
      // In the future, this could be enhanced to work with IC network
      console.log("Returning empty transaction history (ICP ledger not available on local network)");
      return { 
        success: true, 
        data: {
          transactions: [],
          totalCount: 0,
          hasMore: false
        }
      };

    } catch (error) {
      console.error("Error getting transaction history:", error);
      return { 
        success: true, // Return success with empty data instead of error for better UX
        data: {
          transactions: [],
          totalCount: 0,
          hasMore: false
        }
      };
    }
  });



  ipcMain.handle("ledger:setup-notifications", async (event, enabled: boolean) => {
    try {
      // This is a placeholder - real implementation would set up
      // transaction notifications through the ledger canister
      store.set("ledgerNotificationsEnabled", enabled);
      
      return { success: true, data: `Notifications ${enabled ? 'enabled' : 'disabled'}` };
    } catch (error) {
      console.error("Error setting up notifications:", error);
      return { success: false, error: error.message };
    }
  });

  if (isProd) {
    await mainWindow.loadURL("app://./projects");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/projects`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
