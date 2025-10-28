# 🚀 Inicio Rápido - FVX Showroom Web

## ⚡ Empezar en 2 Minutos

```bash
cd /Users/sadic/Desktop/rinno/fvx-showroom-web

# 1. Instalar dependencias
npm install

# 2. Iniciar la aplicación
npm start
```

La aplicación se abrirá en `http://localhost:4200` 🎉

## 📋 ¿Qué Incluye?

### ✅ Todas las Funciones del Original Flutter

- **Gestión de Pantallas**: Agregar, editar, eliminar pantallas con validación de IP
- **Botones Personalizables**: Crea contenido con colores personalizados
- **Selección Múltiple**: Envía contenido a varias pantallas a la vez
- **Almacenamiento Persistente**: Los datos se guardan automáticamente
- **Diseño Responsive**: Se adapta a diferentes tamaños de pantalla
- **Interfaz Moderna**: Diseño limpio basado en Material Design

### 📦 Pantallas Pre-configuradas

El proyecto viene con 4 pantallas ya configuradas:
- Prueba Rinno (172.16.70.247)
- VW2x1 (172.16.70.161)
- Pantalla PUA Vertical (172.16.70.159)
- Pantalla Led (172.16.70.160)

### 🎨 Contenido Pre-configurado

6 botones de color listos para usar:
- Rojo, Amarillo, Azul, Verde, Blanco, Negro

## 🔧 Configuración Básica

### Modo Simulación (Por defecto)
Por defecto, el envío UDP está simulado en la consola del navegador. Perfecto para desarrollo y pruebas.

### Modo Producción (UDP Real)

Si necesitas enviar mensajes UDP reales:

**1. Iniciar el Backend:**
```bash
# En una nueva terminal
cd backend-example
npm install
npm start
```

**2. El backend correrá en** `http://localhost:3000`

**3. Para más detalles**, consulta [INSTALLATION.md](./INSTALLATION.md)

## 📖 Uso Básico

### Agregar una Pantalla
1. Clic en "Agregar Pantalla" (arriba derecha)
2. Completa: Nombre, IP (ej: 192.168.1.100)
3. Opcionalmente selecciona contenido inicial
4. Clic en "Agregar Pantalla"

### Enviar Contenido
1. Selecciona una o más pantallas (clic en las tarjetas)
2. Clic en uno de los botones de contenido
3. El mensaje se enviará a todas las pantallas seleccionadas

### Editar/Eliminar
- **Editar pantalla**: Clic en el ícono ✏️
- **Eliminar pantalla**: Clic en el ícono 🗑️
- **Editar contenido**: Clic derecho en un botón
- **Reordenar contenido**: Clic en el ícono ☰

## 🗂️ Estructura del Proyecto

```
fvx-showroom-web/
├── src/app/
│   ├── models/          → Modelos de datos
│   ├── services/        → Lógica de negocio
│   ├── app.component.*  → Componente principal
│   └── ...
├── backend-example/     → Servidor UDP (opcional)
├── README.md           → Documentación completa
├── INSTALLATION.md     → Guía detallada
└── QUICKSTART.md       → Este archivo
```

## 🛠️ Comandos Útiles

```bash
npm start              # Desarrollo
npm run build          # Compilar para producción
npm run watch          # Build con recarga automática
```

## ❓ Problemas Comunes

### Puerto ocupado
```bash
lsof -ti:4200 | xargs kill -9
```

### Dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Los datos no se guardan
- Verifica localStorage en DevTools → Application → Local Storage

## 📚 Documentación Completa

- **[README.md](./README.md)** - Características completas y arquitectura
- **[INSTALLATION.md](./INSTALLATION.md)** - Guía de instalación detallada
- **[backend-example/README.md](./backend-example/README.md)** - Configuración del backend UDP

## 🎯 Próximos Pasos

1. ✅ **Ya funciona**: Abre `http://localhost:4200` y empieza a usar la app
2. 🎨 **Personaliza**: Agrega tus propias pantallas y contenido
3. 📡 **UDP Real**: Configura el backend si necesitas enviar mensajes UDP reales
4. 🚀 **Deploy**: Compila con `npm run build` y despliega en tu servidor

---

**¿Listo?** Ejecuta `npm start` y empieza a controlar tus pantallas! 🎉
