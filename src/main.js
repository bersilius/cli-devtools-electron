import { app, BrowserWindow } from 'electron'

import config from './config'
import developmentHelpers from './dev'
import { sync, async } from './ipc'
import cli from './cli'

let mainWindow

function createWindow () {
  const nodeIntegration = process.env.NODE_ENV === 'development'

  if (nodeIntegration) {
    developmentHelpers()
  }

  async.register([
    {
      eventName: 'cli-run',
      handler: (event, args) => {
        return cli
          .spawn({ ...args, sender: event.sender })
      }
    }
  ])

  mainWindow = new BrowserWindow({
    ...config.mainWindow,
    webPreferences: {
      nodeIntegration
    }
  })

  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(config.guiBuildServerURL)

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
