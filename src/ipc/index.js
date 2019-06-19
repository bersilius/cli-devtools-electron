import { ipcMain } from 'electron'

export const sync = {
  register: options => {
    options.map(option => {
      ipcMain.on(option.eventName, (event, arg) => {
        event.returnValue = option.handler(arg)
      })
    })
  }
}

export const async = {
  register: options => {
    options.map(option => {
      ipcMain.on(option.eventName, option.handler)
    })
  }
}
