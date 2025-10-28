/**
 * Backend de ejemplo para envío UDP
 * 
 * Este servidor Node.js recibe peticiones HTTP desde la aplicación Angular
 * y envía mensajes UDP a las direcciones IP especificadas.
 * 
 * Instalación:
 * npm install express cors dgram body-parser
 * 
 * Uso:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const dgram = require('dgram');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para enviar mensajes UDP
app.post('/api/udp/send', (req, res) => {
  const { ip, port, message } = req.body;

  // Validación
  if (!ip || !port || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields: ip, port, message' 
    });
  }

  // Crear socket UDP
  const socket = dgram.createSocket('udp4');
  const buffer = Buffer.from(message);

  console.log(`📡 Sending UDP to ${ip}:${port} - "${message}"`);

  // Enviar mensaje
  socket.send(buffer, 0, buffer.length, port, ip, (err) => {
    socket.close();

    if (err) {
      console.error('❌ Error sending UDP:', err);
      return res.status(500).json({ 
        error: 'Failed to send UDP message',
        details: err.message 
      });
    }

    console.log('✅ UDP message sent successfully');
    res.json({ 
      success: true,
      message: 'UDP message sent successfully',
      details: { ip, port, message }
    });
  });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 UDP Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to send UDP messages`);
});
