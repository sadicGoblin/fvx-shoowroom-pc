# Guía: Crear Icono para el Instalador y Acceso Directo

## ✅ Configuración Completada

Ya se ha configurado `package.json` para:
- ✓ Crear acceso directo en el **Escritorio**
- ✓ Crear acceso directo en el **Menú Inicio**
- ✓ Usar tu icono personalizado en el instalador
- ✓ Mostrar el icono en la aplicación instalada

## 📁 Archivos Necesarios

Necesitas crear el archivo de icono en: `src/assets/icon.ico`

### Opción 1: Usar el SVG generado (Recomendado)

Ya se creó un icono SVG básico en `src/assets/icon.svg`. Ahora necesitas convertirlo a ICO:

#### **Método A: Convertidor Online (Más Fácil)**

1. Abre el archivo `src/assets/icon.svg` en tu navegador
2. Ve a uno de estos sitios:
   - https://convertio.co/es/svg-ico/
   - https://cloudconvert.com/svg-to-ico
   - https://online-convert.com/es/convertir-a-ico
3. Sube el archivo `icon.svg`
4. Configura el tamaño: **256x256 píxeles**
5. Descarga el archivo como `icon.ico`
6. Copia `icon.ico` a la carpeta `src/assets/`

#### **Método B: Usando ImageMagick (Mac/Linux)**

```bash
# Instalar ImageMagick
brew install imagemagick

# Convertir SVG a ICO
convert -resize 256x256 -background transparent src/assets/icon.svg src/assets/icon.ico
```

#### **Método C: Usando herramientas online de diseño**

1. Abre https://www.canva.com o https://www.figma.com
2. Crea un diseño de 512x512 píxeles
3. Diseña tu logo personalizado
4. Exporta como PNG
5. Convierte el PNG a ICO usando los convertidores online mencionados arriba

### Opción 2: Usar tu propio logo

Si ya tienes un logo en PNG, JPEG o cualquier otro formato:

1. Ve a https://convertio.co/es/png-ico/ (cambia 'png' por tu formato)
2. Sube tu logo
3. Asegúrate de que tenga al menos 256x256 píxeles
4. Descarga como `icon.ico`
5. Guárdalo en `src/assets/icon.ico`

## 🔨 Compilar con el Nuevo Icono

Una vez que tengas el archivo `icon.ico` en `src/assets/`:

```bash
# Compilar la aplicación con electron-builder
npm run build-electron
```

Esto generará un nuevo instalador en la carpeta `release/` que:
- ✅ Usará tu icono en el instalador
- ✅ Creará un acceso directo en el Escritorio con tu icono
- ✅ Creará un acceso directo en el Menú Inicio con tu icono
- ✅ Mostrará tu icono en la aplicación instalada

## 🎨 Personalizar el Icono SVG

Si quieres personalizar el icono antes de convertirlo, edita `src/assets/icon.svg`:

- **Cambiar colores**: Modifica los valores `#007ACC` y `#0056A3` en el gradiente
- **Cambiar texto**: Modifica el texto "FVX" y "SHOWROOM"
- **Ajustar tamaños**: Modifica los valores de `font-size`

## 📋 Configuración Actual del Instalador (package.json)

```json
"nsis": {
  "oneClick": false,                          // Permite elegir carpeta de instalación
  "allowToChangeInstallationDirectory": true, // Usuario puede cambiar la ruta
  "createDesktopShortcut": true,              // Crea acceso directo en Escritorio ✅
  "createStartMenuShortcut": true,            // Crea acceso directo en Menú Inicio ✅
  "shortcutName": "FVX Showroom",            // Nombre del acceso directo
  "installerIcon": "src/assets/icon.ico",    // Icono del instalador
  "uninstallerIcon": "src/assets/icon.ico",  // Icono del desinstalador
  "installerHeaderIcon": "src/assets/icon.ico" // Icono del header del instalador
}
```

## ⚠️ Solución de Problemas

### Error: "Cannot find icon.ico"
- Asegúrate de que el archivo esté en `src/assets/icon.ico` (no en otra carpeta)
- Verifica que el archivo se llame exactamente `icon.ico` (en minúsculas)

### El icono no se ve bien
- Asegúrate de que el archivo ICO tenga al menos 256x256 píxeles
- Prueba con diferentes tamaños: 16x16, 32x32, 48x48, 256x256 en un solo archivo ICO

### El acceso directo no se crea
- Verifica que `createDesktopShortcut: true` esté en package.json
- Vuelve a compilar la aplicación después de hacer cambios

## 🚀 Comandos Útiles

```bash
# Ver si el icono existe
ls -la src/assets/icon.ico

# Compilar la aplicación
npm run build-electron

# Ver el instalador generado
ls -la release/

# Ejecutar el instalador (Windows)
# Doble clic en release/FVX Showroom Setup 1.0.0.exe
```

## 📝 Notas

- El icono se aplicará solo después de recompilar con `npm run build-electron`
- El instalador creará automáticamente el acceso directo en el Escritorio
- Si ya tienes la aplicación instalada, desinstálala primero antes de reinstalar con el nuevo icono
