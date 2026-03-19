const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

function readConfig() {
  try {
    // En la app instalada, busca config.json junto al .exe
    const exeDir = path.dirname(process.execPath);
    const configPath = path.join(exeDir, "config.json");
    const raw = fs.readFileSync(configPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    // Fallback para desarrollo: buscar en la raíz del proyecto
    try {
      const devConfigPath = path.join(process.cwd(), "config.json");
      const raw = fs.readFileSync(devConfigPath, "utf8");
      return JSON.parse(raw);
    } catch {
      return { API_URL: "" };
    }
  }
}

contextBridge.exposeInMainWorld("desktop", {
  ping: () => "pong",
  config: readConfig(),
  generateConsultaPdf: (payload) => ipcRenderer.invoke("consultas:pdf", payload),
});