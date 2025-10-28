# Backend UDP para Showroom Control

Este es un servidor backend de ejemplo que permite a la aplicación Angular enviar mensajes UDP reales a las pantallas.

## ¿Por qué necesito esto?

Los navegadores web no pueden enviar mensajes UDP directamente por razones de seguridad. Este backend actúa como intermediario:

```
Angular App → HTTP Request → Backend Server → UDP Message → Pantalla
```

## Instalación

```bash
# Navegar a la carpeta del backend
cd backend-example

# Instalar dependencias
npm install
```

## Uso

```bash
# Iniciar el servidor
npm start

# O usar nodemon para desarrollo (reinicia automáticamente)
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## Configurar la Aplicación Angular

Para que la aplicación Angular use este backend, modifica el archivo `src/app/services/udp.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UdpService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async sendMessage(ip: string, port: number, message: string): Promise<void> {
    try {
      console.log(`📡 Sending UDP message to ${ip}:${port} - "${message}"`);
      
      await firstValueFrom(
        this.http.post(`${this.API_URL}/udp/send`, { ip, port, message })
      );
      
      console.log('✅ UDP message sent successfully');
    } catch (error) {
      console.error('❌ Error sending UDP message:', error);
      throw error;
    }
  }
}
```

Y agrega `HttpClient` a los providers en `src/main.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));
```

## API Endpoints

### POST /api/udp/send
Envía un mensaje UDP a la IP y puerto especificados.

**Request Body:**
```json
{
  "ip": "192.168.1.100",
  "port": 5000,
  "message": "Rojo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "UDP message sent successfully",
  "details": {
    "ip": "192.168.1.100",
    "port": 5000,
    "message": "Rojo"
  }
}
```

### GET /api/health
Health check del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Producción

Para producción, considera:

1. **Seguridad**: Agregar autenticación y rate limiting
2. **Variables de entorno**: Usar archivos `.env` para configuración
3. **HTTPS**: Usar certificados SSL
4. **Validación**: Validar IPs y puertos antes de enviar
5. **Logging**: Implementar logging robusto
6. **Docker**: Containerizar la aplicación

## Ejemplo de Despliegue con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar el servidor
pm2 start server.js --name showroom-udp

# Ver logs
pm2 logs showroom-udp

# Reiniciar
pm2 restart showroom-udp
```
