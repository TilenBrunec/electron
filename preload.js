const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appAPI', {
  openSettings: () => ipcRenderer.send('open-settings'),
  changeTheme: (theme) => ipcRenderer.send('theme-changed', theme),
  onThemeChanged: (callback) => ipcRenderer.on('apply-theme', (event, theme) => callback(theme))
})