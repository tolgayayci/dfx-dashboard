import { app, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { executeDfxCommand } from './helpers/dfx-helper';
import { handleIdentities } from './helpers/manage-identities';
import { handleProjects } from './helpers/manage-projects';

const path = require('node:path')
const fs = require('fs');

const isProd: boolean = process.env.NODE_ENV === 'production'

const Store = require('electron-store');

const schema = {
  projects: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        path: { type: 'string' },
        selected: {type: 'boolean'}
      },
      required: ['name', 'path']
    }
  },
  identities: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name']
    }
  }
};


const store = new Store({schema});

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    {
      properties: ['openDirectory'],
    }
  )
  if (!canceled) {
    return filePaths[0]
  }
}

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1500,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.handle('dfx-command', async (event, command, subcommand, args?, flags?, path?) => {
    try {
        const result = await executeDfxCommand(command, subcommand, args, flags, path);
        return result;
    } catch (error) {
        throw error;
    }
  });

  ipcMain.handle('dialog:openDirectory', handleFileOpen)

  // Store: Projects Handler
  ipcMain.handle('store:manageProjects', async (event, action, project) => {
    try {
      const result = await handleProjects(store, action, project)
      return result
    } catch (error) {
      console.error('Error managing projects:', error);
      throw error;
    }
  });

  ipcMain.handle('store:manageIdentities', async (event, action, identity) => {
    try {
      const result = await handleIdentities(store, action, identity);
      return result
    } catch (error) {
      console.error('Error on identities:', error);
      throw error;
    }
  });

  ipcMain.handle('is-dfx-project', async (event, directoryPath) => {
    try {
      const dfxConfigPath = path.join(directoryPath, 'dfx.json');
      return fs.existsSync(dfxConfigPath);
    } catch (error) {
      console.error(`Error while checking for Dfinity project: ${error}`);
      return false;
    }
  });
  
  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})
