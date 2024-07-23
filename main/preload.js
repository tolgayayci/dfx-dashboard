const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("awesomeApi", {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  runDfxCommand: async (command, subcommand, args, flags, path) => {
    return ipcRenderer.invoke(
      "dfx-command",
      command,
      subcommand,
      args,
      flags,
      path
    );
  },
  openDirectory: async () => {
    return ipcRenderer.invoke("dialog:openDirectory");
  },
  manageProjects: async (action, project) => {
    return ipcRenderer.invoke("store:manageProjects", action, project);
  },
  manageIdentities: async (action, identity, newIdentity) => {
    return ipcRenderer.invoke(
      "store:manageIdentities",
      action,
      identity,
      newIdentity
    );
  },
  isDfxProject: async (directoryPath) => {
    return ipcRenderer.invoke("is-dfx-project", directoryPath);
  },
  isDfxInstalled: async () => {
    return ipcRenderer.invoke("is-dfx-installed");
  },
  listCanisters: async (directoryPath) => {
    return ipcRenderer.invoke("canister:list", directoryPath);
  },
  jsonRead: async (filePath, directoryPath) => {
    return ipcRenderer.invoke("json:read", filePath, directoryPath);
  },
  jsonWrite: async (filePath, directoryPath, data) => {
    return ipcRenderer.invoke("json:update", filePath, directoryPath, data);
  },
  reloadApplication: async () => {
    return ipcRenderer.invoke("app:reload");
  },
  openExternalLink: async (url) => {
    return ipcRenderer.invoke("open-external-link", url);
  },
  readEnvVariables: async () => {
    return ipcRenderer.invoke("env:read-script");
  },
  updateEnvVariables: async (path, key, value) => {
    return ipcRenderer.invoke("env:update-script", path, key, value);
  },
  refreshIdentities: async () => {
    return ipcRenderer.invoke("identity:refresh");
  },
  setKeyValue: async (key, value) => {
    return ipcRenderer.invoke("store:set", key, value);
  },
  getKeyValue: async (key) => {
    return ipcRenderer.invoke("store:get", key);
  },
  deleteKeyValue: async (key) => {
    return ipcRenderer.invoke("store:delete", key);
  },
  onUpdateDelegate: (callback) => {
    ipcRenderer.on("delegation-received", (event, value) => {
      callback(value);
    });
  },
  offUpdateDelegate: (callback) => {
    // Use the stored listener to remove the event listener
    if (callback._listener) {
      ipcRenderer.removeListener("delegation-received", callback._listener);

      // Clean up by deleting the stored listener
      delete callback._listener;
    }
  },
  runCommand: (command) => ipcRenderer.invoke("runCommand", command),
});
