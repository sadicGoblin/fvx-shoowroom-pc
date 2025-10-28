# Guía de Instalación - FVX Showroom Web

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación Rápida

### 1. Instalar Dependencias del Frontend

```bash
cd fvx-showroom-web
npm install
```

### 2. Ejecutar la Aplicación

```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:4200`

## Configuración Completa (Frontend + Backend UDP)

Si deseas enviar mensajes UDP reales (no simulados), necesitas configurar el backend:

### 1. Instalar Dependencias del Backend

```bash
cd backend-example
npm install
```

### 2. Iniciar el Backend

En una terminal separada:

```bash
cd backend-example
npm start
```

El backend se ejecutará en `http://localhost:3000`

### 3. Configurar el Frontend para Usar el Backend

#### a) Instalar HttpClient en Angular

El proyecto ya está configurado, pero verifica que `main.ts` tenga:

```typescript
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));
```

#### b) Actualizar el Servicio UDP

Reemplaza el contenido de `src/app/services/udp.service.ts` con:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UdpService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly USE_BACKEND = true; // Cambia a false para modo simulación

  constructor(private http: HttpClient) {}

  async sendMessage(ip: string, port: number, message: string): Promise<void> {
    if (this.USE_BACKEND) {
      return this.sendViaBackend(ip, port, message);
    } else {
      return this.simulateSend(ip, port, message);
    }
  }

  private async sendViaBackend(ip: string, port: number, message: string): Promise<void> {
    try {
      console.log(`📡 Sending UDP via backend to ${ip}:${port} - "${message}"`);
      
      await firstValueFrom(
        this.http.post(`${this.API_URL}/udp/send`, { ip, port, message })
      );
      
      console.log('✅ UDP message sent successfully via backend');
    } catch (error) {
      console.error('❌ Error sending UDP message:', error);
      throw error;
    }
  }

  private async simulateSend(ip: string, port: number, message: string): Promise<void> {
    console.log(`📡 [SIMULATED] Sending UDP to ${ip}:${port} - "${message}"`);
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('✅ [SIMULATED] UDP message sent');
  }
}
```

### 4. Reiniciar el Frontend

```bash
npm start
```

## Verificación

### Verificar Frontend

1. Abre `http://localhost:4200`
2. Deberías ver la interfaz de Showroom Control
3. Intenta agregar una pantalla
4. Los datos deben persistir al recargar la página

### Verificar Backend (si está configurado)

1. Abre `http://localhost:3000/api/health`
2. Deberías ver: `{"status":"ok","timestamp":"..."}`
3. Revisa la consola del backend para ver los logs

## Compilar para Producción

### Frontend

```bash
npm run build
```

Los archivos compilados estarán en `dist/fvx-showroom-web/`

### Backend

El backend no requiere compilación. Para producción:

```bash
cd backend-example
npm install --production
pm2 start server.js --name showroom-udp
```

## Solución de Problemas

### Error: "Port 4200 is already in use"

```bash
# Mata el proceso en el puerto 4200
lsof -ti:4200 | xargs kill -9
```

### Error: "Cannot find module '@angular/core'"

```bash
# Reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
```

### Backend no conecta con Angular

1. Verifica que CORS esté habilitado en el backend
2. Confirma que el backend esté en `http://localhost:3000`
3. Revisa la consola del navegador para errores CORS

### Los datos no se guardan

1. Verifica que localStorage esté habilitado en tu navegador
2. Abre DevTools → Application → Local Storage
3. Busca las claves `showroom_screens` y `showroom_content`

## Configuración Avanzada

### Cambiar el Puerto del Frontend

Edita `angular.json`:

```json
"serve": {
  "options": {
    "port": 8080
  }
}
```

### Cambiar el Puerto del Backend

Edita `backend-example/server.js`:

```javascript
const PORT = 8000; // Cambia este valor
```

### Habilitar HTTPS

Para desarrollo con HTTPS:

```bash
ng serve --ssl
```

## Despliegue

### Frontend (Netlify, Vercel, etc.)

```bash
npm run build
# Sube la carpeta dist/fvx-showroom-web
```

### Backend (Heroku, DigitalOcean, AWS)

1. Asegúrate de tener un `Procfile` o scripts de inicio
2. Configura variables de entorno
3. Habilita CORS para tu dominio de producción

## Comandos Útiles

```bash
# Frontend
npm start                 # Desarrollo
npm run build            # Producción
npm run watch            # Build con hot reload

# Backend
npm start                 # Iniciar servidor
npm run dev              # Desarrollo con nodemon
node server.js           # Iniciar directamente

# General
npm list                 # Ver dependencias instaladas
npm outdated            # Ver actualizaciones disponibles
npm update              # Actualizar dependencias
```

## Estructura Final del Proyecto

```
fvx-showroom-web/
├── backend-example/          # Backend Node.js (opcional)
│   ├── server.js
│   ├── package.json
│   └── README.md
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── screen.model.ts
│   │   ├── services/
│   │   │   ├── storage.service.ts
│   │   │   └── udp.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.config.ts
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
└── INSTALLATION.md
```

## Soporte

Para problemas o preguntas, revisa:
- [README.md](./README.md) - Documentación general
- [backend-example/README.md](./backend-example/README.md) - Documentación del backend
- Consola del navegador (F12) para errores del frontend
- Terminal donde corre el backend para errores UDP
