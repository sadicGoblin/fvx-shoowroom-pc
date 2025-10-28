# Cambios Realizados - Electron Aplicación de Escritorio

## 📋 Resumen

El proyecto ahora funciona como una **aplicación de escritorio normal** (no modo kiosko). La ventana se abre con dimensiones de 800x800 píxeles y permite al usuario redimensionar, minimizar y maximizar como cualquier aplicación de escritorio estándar.

## 🔧 Archivos Modificados

### 1. `main.js` ✅
**Cambios principales:**
- Configurada ventana de 800x800 píxeles con controles estándar de escritorio
- `frame: true` - Muestra los controles de la ventana (cerrar, minimizar, maximizar)
- `resizable: true` - Permite redimensionar la ventana
- `minimizable: true` y `maximizable: true` - Controles de ventana habilitados
- Eliminados bloqueos de atajos de teclado
- Eliminados handlers IPC de modo kiosko
- Detección de `NODE_ENV` para modo desarrollo vs producción
- En desarrollo: carga desde `http://localhost:4200`
- En producción: carga desde `dist/fvx-showroom-web/index.html`
- DevTools se habilitan automáticamente en desarrollo

### 2. `preload.js` ✅
**Cambios principales:**
- IPC bridge con `electronAPI` (las funciones de kiosko ya no son necesarias)
- Función disponible:
  - `getScreenOrientation()` - Detectar orientación de pantalla

### 3. `electron-dev.js` ✅ (NUEVO ARCHIVO)
**Propósito:**
- Espera a que el servidor Angular en `localhost:4200` esté disponible usando `wait-on`
- Luego lanza Electron con `NODE_ENV=development`
- Evita que Electron se lance antes que Angular esté listo (causa de la pantalla en blanco)

### 4. `package.json` ✅
**Scripts actualizados:**
```json
"electron-dev": "concurrently --kill-others \"ng serve --port 4200\" \"node electron-dev.js\""
"electron-build": "ng build --configuration=production && electron ."
"build-electron": "ng build --configuration=production --base-href=./ && electron-builder build --win"
```

**Dependencias agregadas:**
- `wait-on: ^9.0.1`
- `concurrently: ^9.2.1`
- `electron-store: ^8.x.x` - Para persistencia real de datos

### 5. `angular.json` ✅
**Cambio en configuración de producción:**
```json
"production": {
  ...
  "baseHref": "./"
}
```
Esto permite que Electron cargue correctamente los archivos en modo producción.

### 6. `.gitignore` ✅
Agregado:
```
# Electron
/release
*.dmg
*.exe
*.AppImage
```

### 7. `ELECTRON.md` ✅
Actualizada la documentación con:
- Comandos correctos
- Explicación del problema de pantalla en blanco
- Instrucciones de uso de la API IPC
- Guía de solución de problemas

### 8. `CAMBIOS_ELECTRON.md` ✅ (ESTE ARCHIVO)

## 🚀 Cómo Usar

### Modo Desarrollo
```bash
npm run electron-dev
```
Este comando:
1. Inicia `ng serve` en puerto 4200
2. Espera que el servidor esté listo
3. Lanza Electron conectado al servidor
4. Habilita DevTools automáticamente

### Modo Producción
```bash
npm run electron-build
```
Construye la aplicación y la ejecuta en Electron.

### Empaquetar
```bash
npm run build-electron        # Windows
npm run electron:package:mac  # macOS
npm run electron:package:win  # Windows
```

## ✨ Características de Aplicación de Escritorio

La aplicación ahora funciona como cualquier otra aplicación de escritorio:
- ✅ Ventana redimensionable
- ✅ Botones de minimizar, maximizar y cerrar
- ✅ Se puede mover por la pantalla
- ✅ El usuario tiene control total de la ventana
- ✅ Tamaño inicial de 800x800 píxeles
- ✅ **Persistencia de datos real con electron-store**
- ✅ Los datos se mantienen al cerrar y reabrir el .exe
- ✅ Ideal para distribuir como .exe en Windows

## ❗ Problemas Solucionados

### Problema Original:
- `npm run electron:dev` abría ventana en blanco
- El sistema se colgaba y requería reinicio

### Causas Identificadas:
1. Electron se lanzaba antes que Angular estuviera listo
2. No había detección de modo desarrollo
3. Scripts mal configurados
4. Falta de `baseHref` en producción

### Soluciones Aplicadas:
1. ✅ `electron-dev.js` con `wait-on`
2. ✅ Detección de `NODE_ENV` en `main.js`
3. ✅ Script `electron-dev` con `concurrently`
4. ✅ `baseHref: "./"` en `angular.json`

## 📝 Notas Importantes

1. **Tamaño de ventana**: Por defecto 800x800 píxeles, modificable en `main.js` líneas 21-22
2. **Puerto**: El servidor Angular debe usar puerto 4200 en desarrollo
3. **DevTools**: Habilitadas automáticamente en desarrollo
4. **Controles de ventana**: Frame, redimensionar, minimizar y maximizar están habilitados

## 🔄 Próximos Pasos

1. Ejecutar `npm install` si aún no se han instalado las dependencias
2. Probar con `npm run electron-dev` para desarrollo
3. Verificar que la aplicación carga correctamente como ventana de escritorio
4. Para crear el .exe: ejecutar `npm run build-electron`
5. Opcional: Agregar iconos personalizados en `src/assets/`
6. Opcional: Ajustar el tamaño inicial de ventana según necesidad

## 📞 Cambios Recientes

La aplicación fue modificada de modo kiosko a aplicación de escritorio normal para permitir su distribución como .exe con controles de ventana estándar.
