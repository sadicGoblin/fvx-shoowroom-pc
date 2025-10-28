# Troubleshooting - FVX Showroom Desktop App

## 🔍 El .exe no abre en Windows

### Paso 1: Verificar el archivo de log

Cuando el .exe no abre, la aplicación está escribiendo logs de error. Busca el archivo de log en:

**Windows**:
```
C:\Users\<TuUsuario>\AppData\Roaming\fvx-showroom-web\app.log
```

Abre este archivo con el Bloc de notas para ver los errores específicos.

### Paso 2: Errores comunes y soluciones

#### Error: "Cannot find module 'electron-store'"
**Solución**: electron-store no se empaquetó correctamente.
```bash
# Verificar que electron-store esté en dependencies (NO en devDependencies)
npm install electron-store --save

# Reconstruir
npm run build-electron
```

#### Error: "index.html no encontrado" o "did-fail-load"
**Problema**: Los archivos de Angular no se empaquetaron correctamente.

**Solución**:
```bash
# 1. Limpiar build anterior
rm -rf dist release

# 2. Rebuild Angular
ng build --configuration=production --base-href=./

# 3. Verificar que se creó dist/fvx-showroom-web/
ls dist/fvx-showroom-web/

# 4. Rebuild electron
npm run build-electron
```

#### Error: "Store is not a constructor"
**Problema**: Versión de electron-store incompatible.

**Solución**: Ya implementado en main.js con `await import('electron-store')`.

### Paso 3: Build con logging habilitado

El main.js ahora incluye logging extensivo que te ayudará a identificar problemas:

```javascript
// Los logs incluyen:
- Aplicación iniciando
- Rutas de archivos
- Estado de electron-store
- Errores de carga
- Estado de archivos (si existen o no)
```

### Paso 4: Verificar archivos empaquetados

Después de ejecutar `npm run build-electron`, verifica:

```bash
# Carpeta de release
ls release/

# Debería contener archivos .exe y/o instalador
```

### Paso 5: Test en desarrollo primero

Antes de crear el .exe, prueba que todo funcione:

```bash
npm run electron-dev
```

Si no funciona en desarrollo, no funcionará empaquetado.

## 📋 Checklist Pre-Build

Antes de ejecutar `npm run build-electron`:

- [ ] La aplicación funciona en `npm run electron-dev`
- [ ] electron-store está en dependencies (package.json)
- [ ] Angular se construye sin errores: `ng build --configuration=production`
- [ ] Existe la carpeta `dist/fvx-showroom-web/`
- [ ] Existe `dist/fvx-showroom-web/index.html`
- [ ] No hay errores en la consola de desarrollo

## 🔧 Comandos útiles

### Limpiar y reconstruir todo
```bash
# Limpiar
rm -rf dist release node_modules

# Reinstalar
npm install

# Build Angular
ng build --configuration=production --base-href=./

# Build Electron
npm run build-electron
```

### Ver estructura del .exe (Windows con 7-Zip)
```bash
# Puedes abrir el .exe con 7-Zip para ver su contenido
# Verifica que contenga:
# - app.asar (contiene main.js, preload.js, dist/)
# - node_modules/ (especialmente electron-store)
```

### Test rápido sin empaquetar
```bash
# Simular producción sin empaquetar
npm run electron-build
```

## 🐛 Debugging Avanzado

### Ver los logs de Electron en Windows

1. Abre PowerShell
2. Navega a la carpeta del .exe
3. Ejecuta: `.\FVX-Showroom.exe` (desde la terminal)
4. Los logs aparecerán en PowerShell

### Habilitar DevTools en producción (temporal)

En `main.js`, cambia temporalmente:

```javascript
// En modo producción
} else {
    // ...
    // AGREGAR TEMPORALMENTE:
    mainWindow.webContents.openDevTools();
}
```

Esto te permitirá ver errores de consola en producción.

## 📞 Ubicaciones importantes

### Logs
- **Windows**: `%APPDATA%\fvx-showroom-web\app.log`
- **macOS**: `~/Library/Application Support/fvx-showroom-web/app.log`

### Datos guardados
- **Windows**: `%APPDATA%\fvx-showroom-web\config.json`
- **macOS**: `~/Library/Application Support/fvx-showroom-web/config.json`

### Build output
- `release/` - Archivos empaquetados
- `dist/` - Build de Angular

## ✅ Verificación Post-Build

Después de crear el .exe:

1. **Copiar el .exe a otra máquina Windows** (no donde lo compilaste)
2. **Ejecutar desde PowerShell** para ver logs
3. **Verificar que se crea app.log** en AppData
4. **Revisar app.log** para errores
5. **Si funciona**: ¡Éxito! 🎉
6. **Si no funciona**: Lee app.log y busca el error en esta guía

## 🆘 Si nada funciona

1. Asegúrate de que `package.json` tenga:
```json
{
  "dependencies": {
    "electron-store": "^11.0.2"
  }
}
```

2. Verifica que el archivo `main.js` tenga el logging correcto

3. Ejecuta:
```bash
npm run electron-dev
```

Y comparte los errores que veas en consola.
