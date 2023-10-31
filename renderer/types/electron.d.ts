// electron.d.ts

interface Versions {
    node: string;
    chrome: string;
    electron: string;
    runDfxCommand: (command,
      subcommand?,
      args?,
      flags?,
      path?) => Promise<string>;
    openDirectory: () => Promise<string>;
    manageProjects: (action, path?) => Promise<any>;
    manageIdentities: (action, identity) => Promise<string>;
    isDfxProject: (directoryPath) => Promise<boolean>;
  }
  
  interface Window {
    awesomeApi: Versions;
  }
  