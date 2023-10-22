import { app, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { executeDfxCommand } from './helpers/dfx-helper';

const path = require('node:path')

const isProd: boolean = process.env.NODE_ENV === 'production'

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
    height: 900,
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
