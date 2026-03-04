const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tubdown', {
  selectOutputFolder: () => ipcRenderer.invoke('dialog:selectOutput'),
  startDownload: (payload) => ipcRenderer.invoke('download:start', payload),
  cancelDownload: () => ipcRenderer.invoke('download:cancel'),
  onLog: (callback) => {
    ipcRenderer.on('download:log', (_event, message) => callback(message));
  }
});
