// electron.d.ts

interface Versions {
  node: string;
  chrome: string;
  electron: string;
  runDfxCommand: (
    command,
    subcommand?,
    args?,
    flags?,
    path?
  ) => Promise<string>;
  openDirectory: () => Promise<string>;
  manageProjects: (action, path?) => Promise<any>;
  manageIdentities: (action, identity?, newIdentity?) => Promise<any>;
  isDfxProject: (projectPath) => Promise<boolean>;
  isDfxInstalled: () => Promise<boolean>;
  listCanisters: (directoryPath) => Promise<any>;
  listNNSCanisters: (network: string) => Promise<any>;
  jsonRead: (filePath, directoryPath) => Promise<any>;
  jsonWrite: (filePath, directoryPath, data) => Promise<any>;
  reloadApplication: () => Promise<void>;
  openExternalLink: (url) => Promise<void>;
  readEnvVariables: () => Promise<{ [key: string]: string }>;
  updateEnvVariables: (path, key, value) => Promise<void>;
  refreshIdentities: () => Promise<void>;
  setKeyValue: (
    key: string,
    value: any
  ) => Promise<{ success: boolean; message?: string }>;
  getKeyValue: (
    key: string
  ) => Promise<{ success: boolean; value?: any; message?: string }>;
  deleteKeyValue: (
    key: string
  ) => Promise<{ success: boolean; message?: string }>;
  onUpdateDelegate: (callback: (value: any) => void) => void;
  offUpdateDelegate: (callback: (value: any) => void) => void;
  openEditor: (projectPath, editor) => Promise<void>;
  checkEditors: () => Promise<any>;
  getAppVersion: () => Promise<any>;
  getDfxVersion: () => Promise<any>;
  readCommandLogs: () => Promise<string>;
  checkFileExists: (filePath: string) => Promise<boolean>;
  runCommand: (command: string) => Promise<any>;
  getDfxPreference: () => Promise<boolean>;
  setDfxPreference: (useBundled: boolean) => Promise<void>;
  getDfxVersions: () => Promise<{ system: string; bundled: string }>;
  getTrackingAllowed: () => Promise<boolean>;
  setTrackingAllowed: (value: boolean) => Promise<{ success: boolean }>;
  getNetworkPreference: () => Promise<string>;
  setNetworkPreference: (preference: string) => Promise<string>;
  getNetworks: () => Promise<{ [key: string]: { type: string } }>;

  runAssistedCommand: (
    command: string,
    canisterName: string,
    customPath: string,
    methodName?: string,
    network?: string
  ) => Promise<string>;

  onAssistedCommandOutput: (
    callback: (data: { type: "stdout" | "stderr"; content: string }) => void
  ) => void;

  onAssistedCommandInputRequired: (
    callback: (data: { prompt: string }) => void
  ) => void;

  sendAssistedCommandInput: (input: string) => Promise<{ success: boolean; error?: string }>;

  offAssistedCommandOutput: (
    callback: (data: { type: "stdout" | "stderr"; content: string }) => void
  ) => void;

  offAssistedCommandInputRequired: (
    callback: (data: { prompt: string }) => void
  ) => void;

  terminateAssistedCommand: () => Promise<{ success: boolean; error?: string }>;

  runInstallCommand: (version: string) => Promise<void>;

  onInstallOutput: (callback: (data: { content: string }) => void) => void;

  offInstallOutput: (callback: (data: { content: string }) => void) => void;

  readMethodsFromFile: (filePath: string) => Promise<string[]>;

  getCanisterMetadata: (
    canisterName: string,
    network: string,
    projectPath?: string
  ) => Promise<{
    success: boolean;
    data?: {
      'candid:service'?: string;
      'candid:args'?: string;
      'dfx:wasm_url'?: string;
      'dfx:deps'?: string;
      'dfx:init'?: string;
      'cdk:name'?: string;
      'cdk:version'?: string;
    };
    error?: string;
  }>;

  // Cycles operations
  cyclesBalance: (options?: {
    network?: string;
    precise?: boolean;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  cyclesApprove: (
    spender: string,
    amount: string,
    options?: {
      network?: string;
      memo?: string;
      expiresAt?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cyclesTransfer: (
    to: string,
    amount: string,
    options?: {
      network?: string;
      memo?: string;
      fromSubaccount?: string;
      toSubaccount?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cyclesTopUp: (
    canister: string,
    amount: string,
    options?: {
      network?: string;
      fromSubaccount?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cyclesConvert: (
    amount: string,
    options?: {
      network?: string;
      toSubaccount?: string;
      memo?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cyclesRedeemFaucetCoupon: (
    coupon: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  // Settings operations
  settingsDetectShell: () => Promise<{
    success: boolean;
    data?: {
      shell: string;
      shellName: string;
      supported: boolean;
    };
    error?: string;
  }>;

  settingsSetupCompletion: (
    enable: boolean
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  // Cache operations
  cacheListVersions: () => Promise<{
    success: boolean;
    data?: Array<{
      version: string;
      isActive: boolean;
      path: string;
      size: string;
    }>;
    error?: string;
  }>;

  cacheGetPath: () => Promise<{
    success: boolean;
    data?: {
      currentPath: string;
      cacheDir: string;
      totalSize: string;
    };
    error?: string;
  }>;

  cacheDeleteVersion: (
    version: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cacheInstallVersion: (
    version?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  cacheClearAll: () => Promise<{ success: boolean; data?: string; error?: string }>;

  // Wallet operations
  walletGetBalance: (options?: {
    network?: string;
    precise?: boolean;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletSendCycles: (
    destination: string,
    amount: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletListControllers: (options?: {
    network?: string;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletAddController: (
    controllerId: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletRemoveController: (
    controllerId: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletListCustodians: (options?: {
    network?: string;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletAuthorizeCustodian: (
    custodianId: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletDeauthorizeCustodian: (
    custodianId: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletGetDfxAddresses: (options?: {
    network?: string;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletGetName: (options?: {
    network?: string;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletSetName: (
    name: string,
    options?: {
      network?: string;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletUpgrade: (options?: {
    network?: string;
  }) => Promise<{ success: boolean; data?: string; error?: string }>;

  walletSaveAddress: (
    address: string,
    label: string,
    type?: 'principal' | 'account'
  ) => Promise<{ success: boolean; data?: any; error?: string }>;

  walletGetAddresses: () => Promise<{ success: boolean; data?: any[]; error?: string }>;

  walletDeleteAddress: (
    addressId: string
  ) => Promise<{ success: boolean; data?: any[]; error?: string }>;

  walletRedeemFaucetCoupon: (
    coupon: string,
    options?: {
      network?: string;
      faucet?: string;
      yes?: boolean;
    }
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  // Ledger operations
  ledgerGetAccountId: (
    identity?: string,
    type?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerGetBalance: (
    accountId?: string,
    network?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerTransferICP: (
    to: string,
    amount: string,
    memo: string,
    network?: string,
    identity?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerCreateCanister: (
    controller: string,
    amount: string,
    network?: string,
    identity?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerTopUpCanister: (
    canisterId: string,
    amount: string,
    network?: string,
    identity?: string
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerFabricateCycles: (
    canisterId?: string,
    amount?: string,
    amountType?: string,
    all?: boolean
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  ledgerGetTransactions: (
    identity: string
  ) => Promise<{ 
    success: boolean; 
    data?: Array<{
      blockHeight: number;
      timestamp: string;
      operation: string;
      amount: string;
      from: string;
      to: string;
      memo: string;
      status: "completed" | "pending" | "failed";
    }>; 
    error?: string 
  }>;

  ledgerSetupNotifications: (
    enabled: boolean
  ) => Promise<{ success: boolean; data?: string; error?: string }>;

  // Store operations
  storeGet: (key: string) => Promise<{ success: boolean; value?: any; error?: string }>;
  storeSet: (key: string, value: any) => Promise<{ success: boolean; error?: string }>;
}

interface Window {
  awesomeApi: Versions;
}
