const { app, BrowserWindow } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    const indexHtml = path.join(__dirname, "..", "dist", "index.html");
    const url = pathToFileURL(indexHtml).toString();

    // Con HashRouter, arrancamos siempre en "#/".
    win.loadURL(`${url}#/`);
  }

  win.webContents.on("did-fail-load", (_e, code, desc, validatedURL) => {
    console.error("did-fail-load", { code, desc, validatedURL });
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});