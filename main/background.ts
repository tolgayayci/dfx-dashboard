import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";

// Helpers
import { createWindow } from "./helpers";
import { executeDfxCommand } from "./helpers/dfx-helper";
import { handleIdentities } from "./helpers/manage-identities";
import { handleProjects } from "./helpers/manage-projects";

const path = require("node:path");
const fs = require("fs");

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
        isInternetIdentity: { type: "boolean" },
        internetIdentityPrincipal: { type: "string", default: "" },
      },
      required: ["isInternetIdentity"],
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
      preload: path.join(__dirname, "preload.js"),
    },
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

  ipcMain.handle("store:manageIdentities", async (event, action, identity) => {
    try {
      const result = await handleIdentities(store, action, identity);
      return result;
    } catch (error) {
      console.error("Error on identities:", error);
      throw error;
    }
  });

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
      const result = await executeDfxCommand("--version");
      return result;
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
        console.log("json:update", filePath, directoryPath, jsonContent);
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

  // New Function: Retrieve and Store Identities
  async function retrieveAndStoreIdentities() {
    try {
      const result = await executeDfxCommand("identity", "list");
      // Split the result string into an array of identities
      const identityNames = result
        .split("\n")
        .filter((identity) => identity.trim() !== "");

      for (const name of identityNames) {
        // Create an identity object
        const identity = {
          name: name,
          isInternetIdentity: false, // Set this based on your criteria
          internetIdentityPrincipal: "", // Set this appropriately
        };

        // Add each identity to the store
        try {
          await handleIdentities(store, "add", identity);
        } catch (error) {
          console.error(`Error adding identity '${name}':`, error);
          // Handle error appropriately for each identity
        }
      }
    } catch (error) {
      console.error("Error retrieving identities:", error);
      // Handle error appropriately
    }
  }

  await retrieveAndStoreIdentities();

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
