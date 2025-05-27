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
  listNNSCanisters: async (network) => {
    return ipcRenderer.invoke("canister:list-nns", network);
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
  openEditor: async (projectPath, editor) => {
    return ipcRenderer.invoke("open-editor", projectPath, editor);
  },
  checkEditors: async () => {
    return ipcRenderer.invoke("check-editors");
  },
  getAppVersion: async () => {
    return ipcRenderer.invoke("get-app-version");
  },
  getDfxVersion: async () => {
    return ipcRenderer.invoke("get-dfx-version");
  },
  readCommandLogs: async () => {
    return ipcRenderer.invoke("fetch-command-logs");
  },
  checkFileExists: async (filePath) => {
    return ipcRenderer.invoke('check-file-exists', filePath);
  },
  getDfxVersions: async () => {
    return ipcRenderer.invoke("get-dfx-versions");
  },
  getDfxPreference: () => ipcRenderer.invoke("get-dfx-preference"),
  setDfxPreference: (useBundled) =>
    ipcRenderer.invoke("set-dfx-preference", useBundled),
  getTrackingAllowed: async () => {
    return ipcRenderer.invoke("store:get-tracking", "trackingAllowed");
  },
  setTrackingAllowed: async (value) => {
    return ipcRenderer.invoke("store:set-tracking", "trackingAllowed", value);
  },
  getNetworks: async () => {
    return ipcRenderer.invoke("get-networks");
  },
  getNetworkPreference: () => ipcRenderer.invoke("get-network-preference"),
  setNetworkPreference: (preference) =>
    ipcRenderer.invoke("set-network-preference", preference),

  runAssistedCommand: (command, canisterName, customPath, methodName, network) =>
    ipcRenderer.invoke(
      "run-assisted-command",
      command,
      canisterName,
      customPath,
      methodName,
      network
    ),

  onAssistedCommandOutput: (callback) =>
    ipcRenderer.on("assisted-command-output", (_, data) => callback(data)),

  onAssistedCommandInputRequired: (callback) =>
    ipcRenderer.on("assisted-command-input-required", (_, data) =>
      callback(data)
    ),

  sendAssistedCommandInput: (input) =>
    ipcRenderer.invoke("assisted-command-input", input),

  offAssistedCommandOutput: (callback) =>
    ipcRenderer.removeListener("assisted-command-output", callback),

  offAssistedCommandInputRequired: (callback) =>
    ipcRenderer.removeListener("assisted-command-input-required", callback),

  terminateAssistedCommand: () =>
    ipcRenderer.invoke("terminate-assisted-command"),

  // ... rest of the methods ...

  runInstallCommand: (version) => ipcRenderer.invoke("run-install-command", version),

  onInstallOutput: (callback) =>
    ipcRenderer.on("install-output", (_, data) => callback(data)),

  offInstallOutput: (callback) =>
    ipcRenderer.removeListener("install-output", callback),

  readMethodsFromFile: async (filePath) => {
    return ipcRenderer.invoke('read-methods-from-file', filePath);
  },
  getCanisterMetadata: async (canisterName, network, projectPath) => {
    return ipcRenderer.invoke("canister:get-metadata", canisterName, network, projectPath);
  },

  // Cycles operations
  cyclesBalance: async (options) => {
    return ipcRenderer.invoke("cycles:balance", options);
  },
  cyclesApprove: async (spender, amount, options) => {
    return ipcRenderer.invoke("cycles:approve", spender, amount, options);
  },
  cyclesTransfer: async (to, amount, options) => {
    return ipcRenderer.invoke("cycles:transfer", to, amount, options);
  },
  cyclesTopUp: async (canister, amount, options) => {
    return ipcRenderer.invoke("cycles:top-up", canister, amount, options);
  },
  cyclesConvert: async (amount, options) => {
    return ipcRenderer.invoke("cycles:convert", amount, options);
  },
  cyclesRedeemFaucetCoupon: async (coupon, options) => {
    return ipcRenderer.invoke("cycles:redeem-faucet-coupon", coupon, options);
  },

  // Settings operations
  settingsDetectShell: async () => {
    return ipcRenderer.invoke("settings:detect-shell");
  },
  settingsSetupCompletion: async (enable) => {
    return ipcRenderer.invoke("settings:setup-completion", enable);
  },

  // Cache operations
  cacheListVersions: async () => {
    return ipcRenderer.invoke("cache:list-versions");
  },
  cacheGetPath: async () => {
    return ipcRenderer.invoke("cache:get-cache-path");
  },
  cacheDeleteVersion: async (version) => {
    return ipcRenderer.invoke("cache:delete-version", version);
  },
  cacheInstallVersion: async (version) => {
    return ipcRenderer.invoke("cache:install-version", version);
  },
  cacheClearAll: async () => {
    return ipcRenderer.invoke("cache:clear-all");
  },

  // Wallet operations
  walletGetBalance: async (options) => {
    return ipcRenderer.invoke("wallet:get-balance", options);
  },
  walletSendCycles: async (destination, amount, options) => {
    return ipcRenderer.invoke("wallet:send-cycles", destination, amount, options);
  },
  walletListControllers: async (options) => {
    return ipcRenderer.invoke("wallet:list-controllers", options);
  },
  walletAddController: async (controllerId, options) => {
    return ipcRenderer.invoke("wallet:add-controller", controllerId, options);
  },
  walletRemoveController: async (controllerId, options) => {
    return ipcRenderer.invoke("wallet:remove-controller", controllerId, options);
  },
  walletListCustodians: async (options) => {
    return ipcRenderer.invoke("wallet:list-custodians", options);
  },
  walletAuthorizeCustodian: async (custodianId, options) => {
    return ipcRenderer.invoke("wallet:authorize-custodian", custodianId, options);
  },
  walletDeauthorizeCustodian: async (custodianId, options) => {
    return ipcRenderer.invoke("wallet:deauthorize-custodian", custodianId, options);
  },
  walletGetDfxAddresses: async (options) => {
    return ipcRenderer.invoke("wallet:get-dfx-addresses", options);
  },
  walletGetName: async (options) => {
    return ipcRenderer.invoke("wallet:get-name", options);
  },
  walletSetName: async (name, options) => {
    return ipcRenderer.invoke("wallet:set-name", name, options);
  },
  walletUpgrade: async (options) => {
    return ipcRenderer.invoke("wallet:upgrade-wallet", options);
  },
  walletSaveAddress: async (address, label, type) => {
    return ipcRenderer.invoke("wallet:save-address", address, label, type);
  },
  walletGetAddresses: async () => {
    return ipcRenderer.invoke("wallet:get-addresses");
  },
  walletDeleteAddress: async (addressId) => {
    return ipcRenderer.invoke("wallet:delete-address", addressId);
  },
  walletRedeemFaucetCoupon: async (coupon, options) => {
    return ipcRenderer.invoke("wallet:redeem-faucet-coupon", coupon, options);
  },

  // Ledger operations
  ledgerGetAccountId: async (identity, type) => {
    return ipcRenderer.invoke("ledger:get-account-id", identity, type);
  },
  ledgerGetBalance: async (accountId, network) => {
    return ipcRenderer.invoke("ledger:get-balance", accountId, network);
  },
  ledgerTransferICP: async (to, amount, memo, network, identity) => {
    return ipcRenderer.invoke("ledger:transfer-icp", to, amount, memo, network, identity);
  },
  ledgerCreateCanister: async (controller, amount, network, identity) => {
    return ipcRenderer.invoke("ledger:create-canister", controller, amount, network, identity);
  },
  ledgerTopUpCanister: async (canisterId, amount, network, identity) => {
    return ipcRenderer.invoke("ledger:top-up-canister", canisterId, amount, network, identity);
  },
  ledgerFabricateCycles: async (canisterId, amount, amountType, all) => {
    return ipcRenderer.invoke("ledger:fabricate-cycles", canisterId, amount, amountType, all);
  },
  ledgerGetTransactions: async (identity) => {
    return ipcRenderer.invoke("ledger:get-transactions", identity);
  },
  ledgerSetupNotifications: async (enabled) => {
    return ipcRenderer.invoke("ledger:setup-notifications", enabled);
  },

  // Store operations
  storeGet: (key) => ipcRenderer.invoke("store:get", key),
  storeSet: (key, value) => ipcRenderer.invoke("store:set", key, value),
});
