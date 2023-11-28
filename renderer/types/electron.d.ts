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
  manageIdentities: (action, identity) => Promise<any>;
  isDfxProject: (directoryPath) => Promise<boolean>;
  loginInternetIdentity: () => Promise<any>;
}

interface Window {
  awesomeApi: Versions;
}
