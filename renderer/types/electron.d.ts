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
  manageIdentities: (action, identity?) => Promise<any>;
  isDfxProject: (projectPath) => Promise<boolean>;
  isDfxInstalled: () => Promise<boolean>;
  listCanisters: (directoryPath) => Promise<any>;
  jsonRead: (filePath, directoryPath) => Promise<any>;
  jsonWrite: (filePath, directoryPath, data) => Promise<any>;
  reloadApplication: () => Promise<void>;
  openExternalLink: (url) => Promise<void>;
}

interface Window {
  awesomeApi: Versions;
}
