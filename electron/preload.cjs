const { contextBridge } = require("electron");

// Por ahora no exponemos nada.
// (Tu app sigue igual, consumiendo APIs por fetch)
contextBridge.exposeInMainWorld("desktop", {
  ping: () => "pong",
  generateConsultaPdf: (payload) => ipcRenderer.invoke("consultas:pdf", payload),
});
