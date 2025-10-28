# Electron - Modo Kiosko

Esta aplicación ahora está configurada para ejecutarse en modo kiosko usando Electron.

## 🚀 Scripts Disponibles

### Desarrollo

```bash
# Ejecutar Electron en modo desarrollo (inicia Angular automáticamente)
npm run electron-dev
```

Este comando usa `concurrently` para:
1. Iniciar el servidor de desarrollo de Angular en `localhost:4200`
2. Esperar a que el servidor esté listo con `wait-on`
3. Lanzar Electron conectado al servidor

### Producción

```bash
# Construir y ejecutar Electron con la build de producción
npm run electron-build

# Solo ejecutar Electron (requiere que ya esté construido)
npm run electron
```

### Empaquetado

```bash
# Empaquetar para Windows
npm run build-electron

# Empaquetar para todas las plataformas
npm run electron:package

# Empaquetar solo para macOS
npm run electron:package:mac

# Empaquetar solo para Windows
npm run electron:package:win

# Empaquetar solo para Linux
npm run electron:package:linux
```

## 🔒 Características del Modo Kiosko

La aplicación está configurada con las siguientes características de seguridad:

- **Pantalla completa**: La aplicación se ejecuta en modo fullscreen/kiosk
- **Sin marco de ventana**: No hay barra de título ni controles de ventana
- **Atajos bloqueados**: 
  - F11 (toggle fullscreen)
  - Alt+F4 (cerrar ventana)
  - Ctrl+W (cerrar pestaña)
  - Ctrl+Q (salir de la aplicación)
- **Ventanas emergentes bloqueadas**: No se pueden abrir nuevas ventanas
- **Menú oculto**: La barra de menú está oculta automáticamente

## ⚙️ Configuración

### Modo Desarrollo vs Producción

- **Desarrollo**: Detecta `NODE_ENV=development` y carga desde `http://localhost:4200`
- **Producción**: Carga los archivos desde `dist/fvx-showroom-web/index.html`

### Habilitar DevTools

Las DevTools se habilitan automáticamente en modo desarrollo. Para deshabilitarlas, comenta esta línea en `main.js`:

```javascript
mainWindow.webContents.openDevTools();
```

### Salir del Modo Kiosko

Existen varias formas de salir del modo kiosko:

1. **Usando la API de Electron (Recomendado)**:
   - Desde tu aplicación Angular, puedes llamar:
   ```typescript
   // En tu componente Angular
   declare const electronAPI: any;
   
   // Salir del modo kiosko con contraseña
   electronAPI.exitKioskMode('1234');
   
   // Escuchar resultado
   electronAPI.onExitKioskResult((result: any) => {
     if (result.success) {
       console.log('Saliendo del modo kiosko');
     }
   });
   ```

2. **Durante desarrollo**: Cierra la ventana de terminal donde se ejecuta Electron

3. **Forzar salida**: Activity Monitor (Mac) / Task Manager (Windows) para matar el proceso

### Personalizar el Comportamiento

Edita `main.js` para:
- Cambiar las teclas bloqueadas
- Modificar el tamaño de la ventana
- Agregar comportamiento personalizado
- Configurar la salida de la aplicación

## 📦 Archivos de Configuración

- **`main.js`**: Proceso principal de Electron y configuración de ventana
- **`preload.js`**: Script de preload para exponer APIs de forma segura (IPC)
- **`electron-dev.js`**: Script que espera al servidor Angular antes de lanzar Electron
- **`package.json`**: Scripts y configuración de electron-builder
- **`angular.json`**: Configurado con `baseHref: "./"` para producción

## ⚠️ Solución al Problema de Pantalla en Blanco

El problema original ocurría porque:

1. **Electron se lanzaba antes que el servidor Angular estuviera listo**
   - Solución: `electron-dev.js` usa `wait-on` para esperar a `localhost:4200`

2. **No había detección de modo desarrollo**
   - Solución: `main.js` detecta `NODE_ENV=development` y carga la URL correcta

3. **Scripts mal configurados**
   - Solución: `npm run electron-dev` usa `concurrently` para iniciar ambos servicios

4. **Rutas incorrectas en producción**
   - Solución: `angular.json` usa `baseHref: "./"` y `main.js` apunta a la ruta correcta

## 🎨 Iconos de Aplicación

Para personalizar el icono de la aplicación, coloca los siguientes archivos en `src/assets/`:

- **macOS**: `icon.icns`
- **Windows**: `icon.ico`
- **Linux**: `icon.png`

Puedes generar estos iconos desde una imagen PNG usando herramientas como:
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [icon-gen](https://www.npmjs.com/package/icon-gen)

## 🛠️ Solución de Problemas

### La aplicación no se ejecuta en modo kiosko

Verifica que la opción `kiosk: true` esté configurada en `main.js`.

### Pantalla en blanco

1. Verifica que la aplicación Angular esté construida: `npm run build`
2. Verifica la ruta en `main.js` apunta a `dist/fvx-showroom-web/browser/index.html`

### No puedo cerrar la aplicación

Durante el desarrollo, cierra la terminal. Para producción, considera agregar un código de salida secreto o un botón oculto.

## 📋 Requisitos del Sistema

- Node.js 16+
- npm 7+
- Electron 38+

## 🔐 Seguridad

La configuración actual implementa las mejores prácticas de seguridad de Electron:
- `nodeIntegration: false`
- `contextIsolation: true`
- `enableRemoteModule: false`
- Uso de preload script para exponer APIs de forma controlada
