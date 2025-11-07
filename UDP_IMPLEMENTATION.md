# 📡 Implementación UDP - FVX Showroom Web

## ✅ Implementación Completa

La funcionalidad de envío UDP **ya está implementada y funcionando** en este proyecto Electron.

---

## 🔍 Comparación con el Proyecto Flutter

### Proyecto Flutter (móvil/tablet)
```dart
// Usa RawDatagramSocket de Dart
final socket = await RawDatagramSocket.bind(InternetAddress.anyIPv4, 0);
final data = message.codeUnits;
socket.send(data, InternetAddress(ip), port);
socket.close();
```

### Proyecto Electron (desktop/web)
```javascript
// Usa dgram de Node.js (proceso main)
const socket = dgram.createSocket('udp4');
const buffer = Buffer.from(message);
socket.send(buffer, 0, buffer.length, port, ip, callback);
socket.close();
```

**Ambas implementaciones son equivalentes** y funcionan de la misma manera.

---

## 🔐 Permisos Necesarios

### ✅ En Misma Red Local (LAN)
**NO se necesitan permisos adicionales**

- ✅ Flutter: Funciona directo
- ✅ Electron: Funciona directo
- ✅ Ambos usan UDP sin restricciones en LAN

### ⚠️ Consideraciones de Firewall

En algunos casos, el firewall del sistema operativo puede bloquear el envío UDP:

#### Windows
```powershell
# Si hay problemas, ejecutar como administrador:
New-NetFirewallRule -DisplayName "FVX Showroom UDP" -Direction Outbound -Protocol UDP -Action Allow
```

#### macOS
```bash
# El firewall de macOS normalmente permite UDP saliente por defecto
# Si hay problemas, verificar en: System Preferences > Security & Privacy > Firewall
```

#### Linux
```bash
# Normalmente no hay problemas, pero si los hay:
sudo ufw allow out proto udp
```

**En la mayoría de los casos NO necesitas hacer nada** - UDP saliente suele estar permitido por defecto.

---

## 🏗️ Arquitectura de la Implementación

### 1. Proceso Main (main.js)
```javascript
// Handler IPC que ejecuta el envío UDP
ipcMain.handle('udp-send', async (event, { ip, port, message }) => {
  const socket = dgram.createSocket('udp4');
  const buffer = Buffer.from(message);
  socket.send(buffer, 0, buffer.length, port, ip, callback);
});
```

**Por qué en el proceso main:**
- Node.js tiene acceso completo al módulo `dgram`
- No hay restricciones de seguridad del navegador
- Equivalente a cómo funciona Flutter (acceso directo al sistema)

### 2. Preload Script (preload.js)
```javascript
// Expone API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  udp: {
    send: (ip, port, message) => ipcRenderer.invoke('udp-send', { ip, port, message })
  }
});
```

**Por qué usar contextBridge:**
- Seguridad: aislamiento de contexto
- Angular no tiene acceso directo a Node.js
- API limpia y controlada

### 3. Angular Service (udp.service.ts)
```typescript
// Usa la API expuesta por Electron
const result = await window.electronAPI.udp.send(ip, port, message);
```

**Ventajas:**
- Código TypeScript limpio
- Detección automática de entorno (Electron vs navegador)
- Fallback a simulación para desarrollo web

---

## 🔄 Diferencias con el Backend HTTP Opcional

### Backend HTTP (NO NECESARIO)
```
Angular → HTTP POST → Node.js Server → UDP → Pantalla
```
- ❌ Requiere servidor separado
- ❌ Más complejo de mantener
- ❌ Latencia adicional
- ✅ Útil si Angular corre en navegador web normal

### Implementación Electron (ACTUAL)
```
Angular → IPC → Electron Main → UDP → Pantalla
```
- ✅ Todo integrado en una app
- ✅ Más simple y directo
- ✅ Menor latencia
- ✅ Equivalente a Flutter

---

## 📊 Tabla Comparativa

| Característica | Flutter | Electron | Backend HTTP |
|---------------|---------|----------|--------------|
| **Envío UDP Real** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Permisos Extra** | ❌ No | ❌ No | ❌ No |
| **Complejidad** | Baja | Baja | Alta |
| **Latencia** | Mínima | Mínima | Media |
| **Arquitectura** | Nativa | IPC | HTTP |
| **Servidor Separado** | No | No | Sí |

---

## 🧪 Cómo Probar

### 1. Modo Desarrollo
```bash
cd /Users/sadic/Desktop/rinno/fvx-showroom-web
npm run electron-dev
```

### 2. Verificar en Consola
Al enviar un mensaje, deberías ver:
```
[MAIN] [UDP] Enviando mensaje a 192.168.1.100:5000 - "rojo"
[MAIN] [UDP] Mensaje enviado exitosamente
```

### 3. Verificar en DevTools (F12)
```
📡 Enviando UDP a 192.168.1.100:5000 - "rojo"
✅ Mensaje UDP enviado exitosamente
```

---

## ❓ Solución de Problemas

### "Error sending UDP message: EACCES"
**Causa:** Firewall bloqueando UDP saliente  
**Solución:** Agregar excepción en firewall (ver sección de permisos arriba)

### "electronAPI is undefined"
**Causa:** preload.js no se cargó correctamente  
**Solución:** Verificar que el archivo preload.js existe y está correctamente referenciado en main.js

### "Mensaje no llega a la pantalla"
**Causas posibles:**
1. ✅ IP incorrecta → Verificar IP de la pantalla
2. ✅ Puerto incorrecto → Verificar que la pantalla escucha en el puerto especificado
3. ✅ Pantalla no en misma red → Verificar conexión de red
4. ✅ Firewall de la pantalla → Verificar configuración de la pantalla receptora

---

## 🎯 Resumen

### ¿Necesito el backend HTTP?
**NO** - Si usas Electron, el envío UDP ya está integrado directamente.

### ¿Necesito permisos adicionales?
**NO** - En red local, UDP saliente funciona sin configuración adicional en la mayoría de los casos.

### ¿Funciona igual que Flutter?
**SÍ** - Ambas implementaciones son equivalentes y usan las APIs nativas de cada plataforma.

### ¿Puedo usarlo en producción?
**SÍ** - La implementación está completa y lista para producción.

---

## 📝 Notas Técnicas

### Puerto UDP por Defecto
```typescript
// Configurado en app.component.ts línea 116
await this.udpService.sendMessage(screen.ip, 5000, button.command);
```

Si tus pantallas usan un puerto diferente, cambia el valor `5000` en el código.

### Logging
Los mensajes UDP se registran automáticamente en:
- **Desarrollo:** Consola de terminal y DevTools
- **Producción:** Archivo `app.log` en `userData` folder

Ubicación del log:
- **Windows:** `%APPDATA%/fvx-showroom-web/app.log`
- **macOS:** `~/Library/Application Support/fvx-showroom-web/app.log`
- **Linux:** `~/.config/fvx-showroom-web/app.log`

---

**Actualizado:** Noviembre 2025  
**Estado:** ✅ Implementación completa y funcional
