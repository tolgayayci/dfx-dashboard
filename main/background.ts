const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";

// Helpers
import { createWindow } from "./helpers";
import { executeDfxCommand } from "./helpers/dfx-helper";
import { handleIdentities } from "./helpers/manage-identities";
import { handleProjects } from "./helpers/manage-projects";
import {
  updateProfileWithEnvVars,
  readEnvVarsFromProfiles,
} from "./helpers/env-variables";

const path = require("node:path");
const fs = require("fs");
const { shell } = require("electron");

const isProd: boolean = process.env.NODE_ENV === "production";

const Store = require("electron-store");

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
        principal: { type: "string" },
      },
    },
  },
};

const store = new Store({ schema });

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
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1500,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "../main/preload.js"),
    },
  });

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
    "dfx-command",
    async (event, command, subcommand, args?, flags?, path?) => {
      try {
        const result = await executeDfxCommand(
          command,
          subcommand,
          args,
          flags,
          path
        );
        return result;
      } catch (error) {
        console.error(`Error while executing DFX command: ${error}`);
        throw error;
      }
    }
  );

  ipcMain.handle("dialog:openDirectory", handleFileOpen);

  // Store: Projects Handler
  ipcMain.handle("store:manageProjects", async (event, action, project) => {
    try {
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
        const isDfxInstalled = result.trim().startsWith("dfx");
        return isDfxInstalled;
      } else {
        console.error("Main window not found");
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
    try {
      const result = await executeDfxCommand("identity", "list");
      // Split the result string into an array of identities
      const identityNames = result
        .split("\n")
        .filter(
          (identity) => identity.trim() !== "" && identity.trim() !== "*"
        );

      for (const name of identityNames) {
        // Create an identity object
        const identity = {
          name: name,
        };

        // Add each identity to the store
        try {
          await handleIdentities(store, "add", identity);
        } catch (error) {
          console.error(`Error adding identity '${name}':`, error);
        }
      }
    } catch (error) {
      console.error("Error retrieving identities:", error);
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

  if (isProd) {
    await mainWindow.loadURL("app://./projects");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/projects`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
