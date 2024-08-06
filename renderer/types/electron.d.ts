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
  runAssistedCommand: (
    command: string,
    canisterName: string,
    customPath: string,
    alwaysAssist: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  sendAssistedCommandInput: (
    input: string
  ) => Promise<{ success: boolean; error?: string }>;
  onAssistedCommandOutput: (
    callback: (data: {
      type: string;
      content: string;
      success?: boolean;
    }) => void
  ) => void;
  offAssistedCommandOutput: (
    callback: (data: {
      type: string;
      content: string;
      success?: boolean;
    }) => void
  ) => void;
  runCommand: (command: string) => Promise<any>;
  setUseBundledDfx: (value: boolean) => Promise<boolean>;
  getUseBundledDfx: () => Promise<boolean>;
  setCustomDfxPath: (path: string) => Promise<boolean>;
  getCustomDfxPath: () => Promise<string>;
  checkSystemDfx: () => Promise<boolean>;
  getBundledDfxPath: () => Promise<string>;
  setupBundledDfx: () => Promise<boolean>;
}

interface Window {
  awesomeApi: Versions;
}
