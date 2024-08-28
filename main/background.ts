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

// Aptabase Analytics
initialize("A-EU-1521640385");

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
};

const store = new Store({ schema });

console.log("Use Bundled Dfx:", store.get("useBundledDfx"));

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
    // Production: Use the path relative to the executable
    basePath = path.dirname(app.getPath("exe"));
    resourcePath = path.join(basePath, "..", "Resources");
  } else {
    // Development: Use the path relative to the project root
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
  // Log the path for debugging
  console.log("Bundled DFX Path:", dfxPath);

  // Check if the file exists
  if (!fs.existsSync(dfxPath)) {
    console.error("DFX file not found at:", dfxPath);
  }

  return dfxPath;
}

if (!gotTheLock) {
  app.quit();
} else {
  app.on("open-url", function (event, url) {
    event.preventDefault();
    console.log("open-url event: " + url);
  });

  app.whenReady().then(() => {
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
    trackEvent("app_started");
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
    const extractVersionNumber = (versionString: string): string => {
      // This regex matches version numbers like 0.21.0 or 1.0.0
      const match = versionString.match(/\d+\.\d+\.\d+/);
      return match ? match[0] : "Unknown";
    };

    const getDfxVersion = async () => {
      const useBundledDfx = store.get("useBundledDfx");

      console.log("Fetching DFX version..." + useBundledDfx);

      try {
        let versionOutput: string;
        if (useBundledDfx) {
          versionOutput = await executeBundledDfxCommand(
            bundledDfxPath,
            "--version"
          );
        } else {
          versionOutput = await executeDfxCommand("--version");
        }
        const version = extractVersionNumber(versionOutput);
        return {
          version,
          type: useBundledDfx ? "bundled" : "system",
          error: null,
        };
      } catch (error) {
        console.error("Error fetching dfx version:", error);
        return {
          version: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch dfx version",
        };
      }
    };

    const getDfxvmVersion = async () => {
      try {
        const versionOutput = await runCommand("dfxvm --version");
        const version = extractVersionNumber(versionOutput);
        return { version, error: null };
      } catch (error) {
        console.error("Error fetching dfxvm version:", error);
        return {
          version: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch dfxvm version",
        };
      }
    };

    const [dfxResult, dfxvmResult] = await Promise.all([
      getDfxVersion(),
      getDfxvmVersion(),
    ]);

    return {
      dfx: dfxResult.version || "Not installed",
      dfxError: dfxResult.error,
      dfxvm: dfxvmResult.version || "Not installed",
      dfxvmError: dfxvmResult.error,
    };
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

  ipcMain.handle(
    "dfx-command",
    async (event, command, subcommand, args?, flags?, path?) => {
      const useBundledDfx = store.get("useBundledDfx");

      try {
        let result;
        if (useBundledDfx) {
          result = await executeBundledDfxCommand(
            bundledDfxPath,
            command,
            subcommand,
            args,
            flags,
            path
          );
        } else {
          result = await executeDfxCommand(
            command,
            subcommand,
            args,
            flags,
            path
          );
        }

        trackEvent("dfx-command-executed");

        if (command && command === "canister") {
          const formattedResult = result
            ? `Result: ${JSON.stringify(result)}`
            : "";

          commandLog.info(
            "dfx",
            command,
            subcommand ? subcommand : "",
            args ? args.join(" ") : "",
            flags ? flags.join(" ") : "",
            path ? path : "",
            formattedResult
          );
        }

        return result;
      } catch (error) {
        console.error(`Error while executing DFX command:`, error);
        if (useBundledDfx) {
          // If there's an error with the bundled DFX, try falling back to the system DFX
          console.log("Falling back to system DFX...");
          try {
            const result = await executeDfxCommand(
              command,
              subcommand,
              args,
              flags,
              path
            );
            // If successful, update the preference to use system DFX
            store.set("useBundledDfx", false);
            return result;
          } catch (fallbackError) {
            console.error("Error with fallback to system DFX:", fallbackError);
            throw new Error(
              "Failed to execute DFX command with both bundled and system DFX"
            );
          }
        } else {
          throw error;
        }
      }
    }
  );

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

  async function retrieveAndStoreIdentities() {
    const useBundledDfx = store.get("useBundledDfx");

    try {
      let result;
      if (useBundledDfx) {
        result = await executeBundledDfxCommand(
          bundledDfxPath,
          "identity",
          "list"
        );
      } else {
        result = await executeDfxCommand("identity", "list");
      }

      if (typeof result !== "string") {
        throw new Error("Unexpected result type from DFX command");
      }

      // Parse the result to get identity names
      const identityNames = result
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name !== "" && name !== "*");

      // Clear existing identities
      store.set("identities", []);

      // Rebuild the list of identities
      const newIdentities = identityNames.map((name) => ({
        name: name,
        isInternetIdentity: false, // You might want to determine this dynamically if possible
      }));

      // Store the new list of identities
      store.set("identities", newIdentities);
      console.log("Identities updated successfully:", newIdentities);
      return newIdentities;
    } catch (error) {
      console.error("Error retrieving identities:", error);

      if (useBundledDfx) {
        console.log("Falling back to system DFX...");
        try {
          const result = await executeDfxCommand("identity", "list");
          // If successful, update the preference to use system DFX
          store.set("useBundledDfx", false);

          // Process the result as before
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
        } catch (fallbackError) {
          console.error("Error with fallback to system DFX:", fallbackError);
          throw new Error(
            "Failed to retrieve identities with both bundled and system DFX"
          );
        }
      } else {
        throw error;
      }
    }
  }

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
    console.log("Getting DFX preference...");
    console.log("Use Bundled Dfx:", store.get("useBundledDfx"));
    return store.get("useBundledDfx");
  });

  ipcMain.handle("set-dfx-preference", (event, useBundled: boolean) => {
    store.set("useBundledDfx", useBundled);
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
