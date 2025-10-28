# Solución: Error al Desinstalar

## ❌ Problema
Error: "Installer integrity check has failed"

## ✅ Soluciones

### Opción 1: Desinstalación Manual (Recomendada)

1. **Cierra la aplicación** si está corriendo
2. **Abre el Explorador de archivos** y ve a una de estas ubicaciones:
   ```
   C:\Program Files\FVX Showroom
   ```
   O:
   ```
   C:\Users\TU_USUARIO\AppData\Local\Programs\FVX Showroom
   ```

3. **Elimina la carpeta completa** de "FVX Showroom"

4. **Elimina los accesos directos:**
   - Escritorio: Busca "FVX Showroom.lnk" y elimínalo
   - Menú Inicio: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\FVX Showroom`

5. **Limpia el registro** (opcional, solo si tienes experiencia):
   - Presiona `Win + R`
   - Escribe `regedit` y presiona Enter
   - Busca y elimina: `HKEY_LOCAL_MACHINE\SOFTWARE\FVX Showroom`
   - Busca y elimina: `HKEY_CURRENT_USER\SOFTWARE\FVX Showroom`

### Opción 2: Usar el Panel de Control

1. Presiona `Win + R`
2. Escribe: `appwiz.cpl` y presiona Enter
3. Busca "FVX Showroom" en la lista
4. Haz clic derecho → "Desinstalar"
5. Si aparece el error de nuevo, usa la Opción 1

### Opción 3: Usar PowerShell (Avanzado)

```powershell
# Ejecuta PowerShell como Administrador
Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like "*FVX*"} | ForEach-Object {$_.Uninstall()}
```

## 🔨 Compilar Nuevo Instalador

Después de desinstalar, compila un nuevo instalador sin el error:

```bash
# Limpiar archivos anteriores
rm -rf release/

# Compilar nuevo instalador
npm run build-electron
```

## ⚙️ Cambios Aplicados

Se agregaron estas configuraciones al `package.json` para evitar futuros problemas:

```json
"nsis": {
  "allowElevation": true,        // Permite permisos de administrador
  "perMachine": true,            // Instalación para todos los usuarios
  "deleteAppDataOnUninstall": false,  // No elimina datos del usuario
  "runAfterFinish": false        // No ejecuta automáticamente después de instalar
}
```

## 📝 Notas Importantes

- El nuevo instalador **no tendrá este problema**
- Los datos de la aplicación (pantallas configuradas) se guardan en:
  ```
  C:\Users\TU_USUARIO\AppData\Roaming\fvx-showroom-web
  ```
- Estos datos **NO se borrarán** al desinstalar manualmente
- Al reinstalar, tus configuraciones **se mantendrán**

## 🚀 Pasos Finales

1. ✅ Desinstala la versión actual (usa Opción 1 si hay error)
2. ✅ Compila el nuevo instalador: `npm run build-electron`
3. ✅ Instala la nueva versión desde `release/FVX Showroom Setup 1.0.0.exe`
4. ✅ Verifica que el acceso directo aparezca en el escritorio
