const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appAPI', {
  openSettings: () => ipcRenderer.send('open-settings'),
  changeTheme: (theme) => ipcRenderer.send('theme-changed', theme),
  onThemeChanged: (callback) => ipcRenderer.on('apply-theme', (event, theme) => callback(theme)),

  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  loadJsonFile: (filePath) => ipcRenderer.invoke('load-json-file', filePath),

  saveLastPath: (filePath) => ipcRenderer.send('save-last-path', filePath),
  getLastPath: () => ipcRenderer.invoke('get-last-path'),
})