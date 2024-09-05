const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
const { readFile } = require("fs").promises;

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
    enum: ["ic", "local"],
    default: "local",
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
let assistedCommandProcess = null;
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

  ipcMain.handle(
    "run-assisted-command",
    async (event, command, canisterName, customPath, alwaysAssist) => {
      console.log(
        `Starting assisted command: dfx canister ${command} ${canisterName} ${
          alwaysAssist ? "--always-assist" : ""
        }`
      );
      console.log(`Working directory: ${customPath}`);
      try {
        const args = ["canister", command, canisterName];
        if (alwaysAssist) {
          args.push("--always-assist");
        }

        assistedCommandProcess = spawn("dfx", args, {
          cwd: customPath,
          shell: true,
          stdio: ["pipe", "pipe", "pipe"],
        });

        assistedCommandProcess.stdout.on("data", (data) => {
          const output = data.toString();
          console.log(`Stdout: ${output}`);
          mainWindow.webContents.send("assisted-command-output", {
            type: "stdout",
            content: output,
          });
        });

        assistedCommandProcess.stderr.on("data", (data) => {
          const output = data.toString();
          if (alwaysAssist) {
            // When always-assist is used, we'll handle stderr differently
            handleAlwaysAssistStderr(output);
          } else {
            console.error(`Stderr: ${output}`);
            mainWindow.webContents.send("assisted-command-output", {
              type: "stderr",
              content: output,
            });
          }
        });

        assistedCommandProcess.on("close", (code) => {
          console.log(`Child process exited with code ${code}`);
          mainWindow.webContents.send("assisted-command-output", {
            type: "status",
            content: `Process completed with exit code ${code}`,
            success: code === 0,
          });
          assistedCommandProcess = null;
        });

        assistedCommandProcess.on("error", (error) => {
          console.error(`Process error: ${error.message}`);
          mainWindow.webContents.send("assisted-command-output", {
            type: "error",
            content: `Process error: ${error.message}`,
          });
        });

        return { success: true };
      } catch (error) {
        console.error(`Error starting assisted command: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  );

  function handleAlwaysAssistStderr(output) {
    // Here you can implement custom logic for handling stderr when always-assist is used
    // For example, you might want to:
    // 1. Ignore certain types of messages
    // 2. Reclassify some stderr messages as stdout
    // 3. Only log specific types of errors

    // This is a simple example that ignores messages containing "warning" and sends others as info
    if (!output.toLowerCase().includes("warning")) {
      console.log(`Always-assist stderr (treated as info): ${output}`);
      mainWindow.webContents.send("assisted-command-output", {
        type: "info",
        content: output,
      });
    }
  }

  // The rest of your code (ipcMain.handle for "send-assisted-command-input") remains the same
  // Set a key-value pair
  ipcMain.handle("store:set", (event, key, value) => {
    try {
      store.set(key, value);
      return { success: true, message: `Successfully set ${key}` };
    } catch (error) {
      console.error("Error setting value:", error);
      return { success: false, message: error.toString() };
    }
  });

  // Get a value by key
  ipcMain.handle("store:get", (event, key) => {
    try {
      const value = store.get(key);
      return { success: true, value: value };
    } catch (error) {
      console.error("Error getting value:", error);
      return { success: false, message: error.toString() };
    }
  });

  // Delete a key-value pair
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

  ipcMain.handle("get-network-preference", () => {
    const preference = store.get("networkPreference", "local");
    console.log("Getting network preference:", preference);
    return preference;
  });

  ipcMain.handle(
    "set-network-preference",
    (event, preference: "ic" | "local") => {
      console.log("Setting network preference to:", preference);
      store.set("networkPreference", preference);
      return store.get("networkPreference");
    }
  );

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
