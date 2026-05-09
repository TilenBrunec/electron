const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("pages/index.html");
  mainWindow.webContents.openDevTools();
}

ipcMain.on("open-settings", () => {
  const settingsWnd = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  settingsWnd.loadFile("pages/settings.html");
});

ipcMain.on("theme-changed", (event, theme) => {
  mainWindow.webContents.send("apply-theme", theme);
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
