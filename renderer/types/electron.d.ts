// electron.d.ts

interface Versions {
    node: string;
    chrome: string;
    electron: string;
    runDfxCommand: (command,
      subcommand,
      args?,
      flags?,
      path?) => Promise<string>;
    openDirectory: () => Promise<string>;
  }
  
  interface Window {
    awesomeApi: Versions;
  }
  