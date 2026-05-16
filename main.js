const { app, BrowserWindow, ipcMain, dialog, protocol, session } = require("electron");
const path = require("path");
const fsp = require("fs/promises");
const fs = require("fs");
const Zadni_file = path.join(__dirname, "lastFile.txt");

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
  //mainWindow.webContents.openDevTools();
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

ipcMain.on("save-last-path", (event, filePath) => {
  fs.writeFileSync(Zadni_file, filePath);
});

ipcMain.handle("get-last-path", () => {
  try {
    return fs.readFileSync(Zadni_file, "utf8");
  } catch {
    return null;
  }
});

ipcMain.handle("open-file-dialog", async () => {
  const restulr = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (restulr.canceled) return;
  return restulr.filePaths[0];
});

ipcMain.handle("load-json-file", async (event, filePath) => {
  try {
    const data = await fsp.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
});

app.whenReady().then(() => {
  protocol.handle("app", async (request) => {
    const urlPath = request.url.replace("app://", "");
    const resolved= path.normalize(path.join(__dirname, urlPath));
    if (!resolved.startsWith(__dirname)) {
      throw new Response("Neavtoriziran dostop", { status: 403 });
    }
    try {
      const file = await fsp.readFile(resolved);
      return new Response(file , {status: 200});
    } catch {
      throw new Response("Datoteka ni najdena", { status: 404 });
    }
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' app:; script-src 'self' app:; style-src 'self' app:; img-src 'self' app: data:"
        ]
      }
    })
  })

  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
