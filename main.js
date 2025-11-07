const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const dgram = require('dgram');

// Mantener una referencia global del objeto window y store
let mainWindow;
let store;

// Logging para debugging
function log(message) {
  console.log('[MAIN]', message);
  // En producción, también escribir a un archivo de log
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    try {
      const logPath = path.join(app.getPath('userData'), 'app.log');
      const timestamp = new Date().toISOString();
      fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
      console.error('Error escribiendo log:', e);
    }
  }
}

function createWindow() {
  log('Creando ventana...');
  
  // Determinamos la ruta correcta al archivo preload.js
  let preloadPath;
  if (app.isPackaged) {
    preloadPath = path.join(__dirname, 'preload.js');
  } else {
    preloadPath = path.join(__dirname, 'preload.js');
  }
  
  log('Ruta al archivo preload: ' + preloadPath);
  log('Preload existe: ' + fs.existsSync(preloadPath));
  
  // Crear la ventana del navegador como aplicación de escritorio normal
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    frame: true,  // Mostrar frame con controles de ventana
    resizable: true,  // Permitir redimensionar
    minimizable: true,  // Permitir minimizar
    maximizable: true,  // Permitir maximizar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  });
  
  // Datos compartidos con el renderer
  global.sharedData = {
    isVerticalScreen: false,
    screenWidth: 800,
    screenHeight: 800
  };

  // Cargar la aplicación Angular
  let startUrl;
  
  // En modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    startUrl = 'http://localhost:4200';
    log('Ejecutando en modo desarrollo, cargando desde: ' + startUrl);
    
    // Permitir que la ventana cargue contenido de localhost (evita problemas CORS)
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
      }
    );
    
    // Habilitar DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // En modo producción
    const indexPath = path.join(__dirname, 'dist/fvx-showroom-web/index.html');
    log('Buscando index.html en: ' + indexPath);
    log('index.html existe: ' + fs.existsSync(indexPath));
    
    startUrl = url.format({
      pathname: indexPath,
      protocol: 'file:',
      slashes: true
    });
    log('Ejecutando en modo producción, cargando desde: ' + startUrl);
  }
  
  log('Cargando URL...');
  mainWindow.loadURL(startUrl);
  
  // Capturar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log('ERROR AL CARGAR: ' + errorCode + ' - ' + errorDescription);
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    log('Página cargada exitosamente');
  });

  // Prevenir que se abran nuevas ventanas externas
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Capturar errores no manejados
process.on('uncaughtException', (error) => {
  log('ERROR NO CAPTURADO: ' + error.message);
  log(error.stack);
});

// Este método será llamado cuando Electron haya terminado
app.on('ready', async () => {
  try {
    log('Aplicación iniciando...');
    log('__dirname: ' + __dirname);
    log('userData: ' + app.getPath('userData'));
    log('Modo: ' + (process.env.NODE_ENV || 'production'));
    log('isPackaged: ' + app.isPackaged);
    
    // Inicializar electron-store (versión 11+ requiere import dinámico)
    log('Cargando electron-store...');
    const Store = (await import('electron-store')).default;
    store = new Store();
    log('electron-store inicializado correctamente');
    
    createWindow();
  } catch (error) {
    log('ERROR AL INICIAR: ' + error.message);
    log(error.stack);
    // Intentar mostrar diálogo de error
    const { dialog } = require('electron');
    dialog.showErrorBox('Error al iniciar', error.message + '\n\nRevisa el log en: ' + app.getPath('userData'));
    app.quit();
  }
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handlers IPC para electron-store (persistencia de datos)
ipcMain.handle('store-get', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', async (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', async (event, key) => {
  store.delete(key);
  return true;
});

ipcMain.handle('store-clear', async () => {
  store.clear();
  return true;
});

// Handler IPC para envío UDP
ipcMain.handle('udp-send', async (event, { ip, port, message }) => {
  return new Promise((resolve, reject) => {
    try {
      log(`[UDP] Enviando mensaje a ${ip}:${port} - "${message}"`);
      
      // Crear socket UDP
      const socket = dgram.createSocket('udp4');
      const buffer = Buffer.from(message);
      
      // Enviar mensaje
      socket.send(buffer, 0, buffer.length, port, ip, (err) => {
        socket.close();
        
        if (err) {
          log(`[UDP] Error al enviar: ${err.message}`);
          reject({ success: false, error: err.message });
        } else {
          log(`[UDP] Mensaje enviado exitosamente`);
          resolve({ success: true });
        }
      });
    } catch (error) {
      log(`[UDP] Error inesperado: ${error.message}`);
      reject({ success: false, error: error.message });
    }
  });
});
