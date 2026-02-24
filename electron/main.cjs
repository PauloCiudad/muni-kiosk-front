const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
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

  ipcMain.handle("consultas:pdf", async (_event, payload) => {
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        sandbox: true,
      },
    });

    const html = renderConsultaHtml(payload);

    await win.loadURL(
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );

    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
    });

    win.close();

    return pdfBuffer.toString("base64");
  });

  function renderConsultaHtml({ meta, items }) {
    const rows = (items || [])
      .map(
        (it) => `
          <tr>
            <td>${escapeHtml(it.concepto || "")}</td>
            <td style="text-align:right">S/ ${escapeHtml(
              String(it.monto ?? "")
            )}</td>
          </tr>
        `
      )
      .join("");

    return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          h1 { font-size: 20px; margin-bottom: 10px; }
          .meta { margin-bottom: 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Consultas en Línea</h1>

        <div class="meta">
          ${meta?.nombre ? `<div><b>Nombre:</b> ${escapeHtml(meta.nombre)}</div>` : ""}
          ${meta?.dni ? `<div><b>DNI:</b> ${escapeHtml(meta.dni)}</div>` : ""}
          <div><b>Fecha:</b> ${new Date().toLocaleString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th style="text-align:right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]));
  }

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