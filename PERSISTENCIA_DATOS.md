# Persistencia de Datos con electron-store

## 📋 Resumen

La aplicación ahora utiliza **electron-store** para persistencia real de datos en aplicaciones Electron empaquetadas (.exe). Esto garantiza que los datos se mantengan incluso después de cerrar y reabrir la aplicación.

## ❓ Problema Previo

**localStorage** en aplicaciones Electron empaquetadas puede ser volátil y no garantiza persistencia entre sesiones. Los datos guardados podían perderse al cerrar el .exe.

## ✅ Solución Implementada

### 1. **electron-store**
Librería especializada para almacenamiento persistente en Electron que:
- Guarda datos en archivos JSON en el directorio de datos de usuario del sistema
- Es multiplataforma (Windows, macOS, Linux)
- Garantiza persistencia entre sesiones
- Funciona correctamente en aplicaciones empaquetadas

### 2. **Ubicación de los datos**

Los datos se guardan automáticamente en:
- **Windows**: `C:\Users\<Usuario>\AppData\Roaming\fvx-showroom-web\config.json`
- **macOS**: `~/Library/Application Support/fvx-showroom-web/config.json`
- **Linux**: `~/.config/fvx-showroom-web/config.json`

## 🔧 Archivos Modificados

### **main.js**
```javascript
// Variables globales
let store;

// Inicializar electron-store de manera asíncrona
app.on('ready', async () => {
  // electron-store v11+ requiere import dinámico en CommonJS
  const Store = (await import('electron-store')).default;
  store = new Store();
  
  createWindow();
});

// Handlers IPC para persistencia
ipcMain.handle('store-get', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', async (event, key, value) => {
  store.set(key, value);
  return true;
});
```

**Nota importante**: electron-store v11+ usa ES Modules, por lo que requiere importación dinámica con `await import()` en archivos CommonJS.

### **preload.js**
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  }
});
```

### **storage.service.ts**
- Detecta si se ejecuta en Electron o navegador
- Usa `electron-store` en Electron (persistencia real)
- Usa `localStorage` como fallback en navegador web
- Todos los métodos son ahora **async/await**

```typescript
async saveScreens(screens: Screen[]): Promise<void> {
  if (this.isElectron()) {
    await electronAPI.store.set(this.SCREENS_KEY, screens);
  } else {
    localStorage.setItem(this.SCREENS_KEY, JSON.stringify(screens));
  }
}
```

### **app.component.ts**
- Todos los métodos que guardan/cargan datos ahora usan `async/await`
- `ngOnInit()` es ahora async
- Métodos actualizados: `saveScreens()`, `loadScreens()`, `saveContent()`, `loadContent()`

## 🎯 Datos Persistentes

### **Pantallas guardadas** (`showroom_screens`)
- ID de pantalla
- Nombre de pantalla
- IP de pantalla
- Último contenido enviado
- Fecha de última actualización

### **Botones de contenido** (`showroom_content`)
- Nombre del botón
- Comando a enviar
- Color de fondo
- Color de texto

## 🚀 Cómo Funciona

1. **Al agregar una pantalla**: Se guarda automáticamente en electron-store
2. **Al cerrar la aplicación**: Los datos permanecen en el archivo config.json
3. **Al reabrir el .exe**: Los datos se cargan automáticamente desde electron-store
4. **En navegador web**: Usa localStorage como fallback

## ✨ Ventajas

✅ **Persistencia real** - Los datos NO se pierden al cerrar la app  
✅ **Multiplataforma** - Funciona en Windows, macOS y Linux  
✅ **Ubicación estándar** - Datos en directorio de usuario del sistema  
✅ **Fallback a localStorage** - Funciona también en navegador web  
✅ **Fácil de debuguear** - Datos en archivo JSON legible  

## 🔍 Verificar Datos Guardados

Para ver los datos guardados, abre el archivo `config.json` en:

**Windows**:
```
%APPDATA%\fvx-showroom-web\config.json
```

**macOS**:
```
~/Library/Application Support/fvx-showroom-web/config.json
```

**Linux**:
```
~/.config/fvx-showroom-web/config.json
```

## 📝 Ejemplo de config.json

```json
{
  "showroom_screens": [
    {
      "id": "1",
      "name": "Pantalla Principal",
      "ip": "172.16.70.247",
      "isSelected": false,
      "lastUpdate": "2025-10-24T21:00:00.000Z",
      "isOnline": false,
      "lastContent": "Rojo"
    }
  ],
  "showroom_content": [
    {
      "name": "Salsas",
      "command": "Rojo",
      "color": "#f44336",
      "textColor": "#ffffff"
    }
  ]
}
```

## 🧪 Probar la Persistencia

1. Ejecuta `npm run electron-dev`
2. Agrega una nueva pantalla
3. Cierra completamente la aplicación
4. Vuelve a abrir la aplicación
5. ✅ La pantalla agregada debe aparecer automáticamente

## 📦 Construir el .exe

```bash
npm run build-electron
```

El ejecutable creado tendrá persistencia de datos completa.

## 🔧 Dependencias

```json
{
  "electron-store": "^11.0.2"
}
```

Ya instalada con: `npm install electron-store`

**Nota**: La versión 11+ de electron-store usa ES Modules y requiere importación dinámica en archivos CommonJS.
