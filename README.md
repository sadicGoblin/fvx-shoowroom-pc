# FVX Showroom Web

Versión web Angular del proyecto Flutter Showroom UDP Control.

## Características

- ✅ **Gestión de Pantallas**: CRUD completo para administrar pantallas con nombre, ID personalizado y validación de IP
- ✅ **Botones de Contenido**: Crear, editar, eliminar y reordenar botones de contenido personalizables
- ✅ **Selección Múltiple**: Selecciona múltiples pantallas para enviar contenido en masa
- ✅ **Contenido Inicial**: Opción para enviar contenido al agregar una nueva pantalla
- ✅ **Almacenamiento Persistente**: Los datos se guardan automáticamente en localStorage
- ✅ **Diseño Responsive**: Grid adaptable que muestra 2-4 columnas según el ancho de pantalla
- ✅ **Interfaz Moderna**: Diseño inspirado en Material Design con animaciones suaves

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build
```

## Uso

La aplicación se ejecutará en `http://localhost:4200`

### Gestión de Pantallas

1. **Agregar Pantalla**: Haz clic en "Agregar Pantalla" en el header
2. **Editar Pantalla**: Haz clic en el ícono de editar (✏️) en la tarjeta de pantalla
3. **Eliminar Pantalla**: Haz clic en el ícono de eliminar (🗑️) o selecciona múltiples y usa clic derecho
4. **Seleccionar Pantallas**: Haz clic en las tarjetas para seleccionarlas

### Gestión de Contenido

1. **Agregar Contenido**: Haz clic en el botón "+" en la sección de contenido
2. **Editar Contenido**: Haz clic derecho en un botón de contenido
3. **Reordenar Contenido**: Haz clic en el ícono "☰" para abrir el diálogo de reorden

### Enviar Mensajes UDP

1. Selecciona una o más pantallas haciendo clic en sus tarjetas
2. Haz clic en uno de los botones de contenido
3. El mensaje UDP se enviará a todas las pantallas seleccionadas

## Nota sobre UDP

Los navegadores web no pueden enviar mensajes UDP directamente. Esta aplicación simula el envío de mensajes UDP en la consola del navegador.

Para producción, necesitarás:

1. Crear un backend (Node.js, Python, etc.) que pueda enviar UDP
2. Modificar el servicio `UdpService` para hacer llamadas HTTP a tu backend
3. El backend procesará las solicitudes y enviará los mensajes UDP reales

Ejemplo de implementación del backend en Node.js:

```javascript
const dgram = require('dgram');
const express = require('express');
const app = express();

app.post('/api/udp/send', (req, res) => {
  const { ip, port, message } = req.body;
  const socket = dgram.createSocket('udp4');
  const buffer = Buffer.from(message);
  
  socket.send(buffer, port, ip, (err) => {
    socket.close();
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(3000);
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── models/
│   │   └── screen.model.ts          # Modelos de datos
│   ├── services/
│   │   ├── storage.service.ts       # Gestión de localStorage
│   │   └── udp.service.ts           # Envío de mensajes UDP
│   ├── app.component.ts             # Componente principal
│   ├── app.component.html           # Template
│   └── app.component.scss           # Estilos
├── index.html
├── main.ts
└── styles.scss                       # Estilos globales
```

## Tecnologías

- **Angular 17**: Framework web con standalone components
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Preprocesador CSS
- **localStorage**: Almacenamiento persistente del lado del cliente

## Características Implementadas del Original Flutter

- ✅ Pantallas por defecto precargadas
- ✅ Colores de contenido predefinidos (Rojo, Amarillo, Azul, Verde, Blanco, Negro)
- ✅ Validación de IP con regex
- ✅ Prevención de IPs duplicadas
- ✅ Mensajes de estado con timeout automático
- ✅ Sistema de prioridad para mensajes de acción
- ✅ Contador de pantallas seleccionadas
- ✅ Grid responsive con diseño adaptable
- ✅ Indicadores visuales de contenido enviado
- ✅ Diálogos modales para todas las operaciones CRUD

## Diferencias con la Versión Flutter

1. **UDP**: Simulado en navegador, requiere backend para producción
2. **Orientación**: No hay bloqueo de orientación (específico de móviles)
3. **Reordenar**: Usa botones arriba/abajo en lugar de drag-and-drop
4. **Almacenamiento**: localStorage en lugar de SharedPreferences

## Próximas Mejoras Potenciales

- [ ] Backend Node.js para envío UDP real
- [ ] Estado de conexión en tiempo real
- [ ] Agrupación de pantallas
- [ ] Importar/exportar configuración
- [ ] Historial de mensajes enviados
- [ ] Programación de envíos
- [ ] Dark/Light theme toggle
