const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura a través del contexto de aislamiento
contextBridge.exposeInMainWorld('electronAPI', {
  // Funciones de storage persistente
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  },
  
  // Funciones UDP
  udp: {
    send: (ip, port, message) => ipcRenderer.invoke('udp-send', { ip, port, message })
  },
  
  // Detectar orientación de pantalla directamente
  getScreenOrientation: () => {
    return window.innerHeight > window.innerWidth ? 'vertical' : 'horizontal';
  }
});
