// electron.d.ts

interface Versions {
    node: string;
    chrome: string;
    electron: string;
    runDfxCommand: (command: string, path?: string) => Promise<string>;
    openDirectory: () => Promise<string>;
  }
  
  interface Window {
    versions: Versions;
  }
  