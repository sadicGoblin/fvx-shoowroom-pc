# FVX Showroom Web

Versión Electron + Angular del proyecto Flutter Showroom UDP Control para aplicaciones de escritorio.

## Características

- ✅ **Envío UDP Real**: Implementado con Node.js/Electron (dgram) - **NO es simulación**
- ✅ **Gestión de Pantallas**: CRUD completo para administrar pantallas con nombre, ID personalizado y validación de IP
- ✅ **Botones de Contenido**: Crear, editar, eliminar y reordenar botones de contenido personalizables
- ✅ **Selección Múltiple**: Selecciona múltiples pantallas para enviar contenido en masa
- ✅ **Contenido Inicial**: Opción para enviar contenido al agregar una nueva pantalla
- ✅ **Almacenamiento Persistente**: Los datos se guardan automáticamente con electron-store
- ✅ **Diseño Responsive**: Grid adaptable que muestra 2-4 columnas según el ancho de pantalla
- ✅ **Interfaz Moderna**: Diseño inspirado en Material Design con animaciones suaves
- ✅ **Aplicación Nativa**: Empaquetada como app de escritorio (Windows, macOS, Linux)

## Instalación

```bash
# Instalar dependencias
npm install
```

## Ejecución

### Modo Desarrollo
```bash
# Opción 1: Electron con hot reload
npm run electron-dev

# Opción 2: Solo Angular en navegador (UDP simulado)
npm start  # http://localhost:4200
```

### Modo Producción
```bash
# Compilar y ejecutar
npm run electron-build

# Empaquetar para distribución
npm run build-electron  # Windows
npm run electron:package:mac  # macOS
npm run electron:package:linux  # Linux
```

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

## 📡 Implementación UDP

### ✅ Envío UDP Real - Completamente Implementado

Esta aplicación **envía mensajes UDP reales** a través de Electron usando el módulo nativo `dgram` de Node.js.

**Arquitectura:**
```
Angular UI → IPC → Electron Main Process → dgram (UDP) → Red Local
```

**Equivalente al proyecto Flutter:**
- Flutter usa `RawDatagramSocket` de Dart
- Electron usa `dgram` de Node.js
- **Ambos funcionan de la misma manera** sin diferencias funcionales

### 🔐 Permisos Necesarios

**En Red Local (LAN): NO se necesitan permisos adicionales**

- ✅ Funciona directo sin configuración
- ✅ UDP saliente permitido por defecto en la mayoría de sistemas
- ✅ Sin restricciones en misma red

**Firewall:** Solo en casos específicos puede ser necesario agregar excepción (ver `UDP_IMPLEMENTATION.md`)

### 📝 Documentación Adicional

Para más información sobre la implementación UDP:
- **`UDP_IMPLEMENTATION.md`** - Detalles técnicos completos
- **`FLUTTER_VS_ELECTRON.md`** - Comparación entre ambos proyectos

### Backend HTTP Opcional (NO necesario)

El directorio `backend-example/` contiene un servidor HTTP opcional que fue usado anteriormente. **Ya no es necesario** porque el envío UDP está integrado directamente en Electron.

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

- **Electron**: Framework para aplicaciones de escritorio multiplataforma
- **Angular 17**: Framework web con standalone components
- **Node.js**: Runtime para envío UDP con módulo dgram
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Preprocesador CSS
- **electron-store**: Almacenamiento persistente

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

| Característica | Flutter | Electron |
|---------------|---------|----------|
| **Plataforma** | Tablet/Móvil | Desktop |
| **UDP** | ✅ Real (RawDatagramSocket) | ✅ Real (dgram) |
| **Orientación** | Landscape forzado | Libre |
| **Reordenar** | Drag & drop | Botones ↑↓ |
| **Almacenamiento** | SharedPreferences | electron-store |
| **Logs** | Console | Console + archivo |

**Ambas versiones envían UDP de manera real y equivalente.**

## Próximas Mejoras Potenciales

- [ ] Estado de conexión en tiempo real
- [ ] Agrupación de pantallas
- [ ] Importar/exportar configuración
- [ ] Historial de mensajes enviados
- [ ] Programación de envíos
- [ ] Dark/Light theme toggle
- [ ] Notificaciones de sistema
