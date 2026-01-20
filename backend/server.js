const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const VENDEDORES_FILE = path.join(DATA_DIR, 'vendedores.json');
const CLIENTES_FILE = path.join(DATA_DIR, 'clientes.json');

// Helper para leer/escribir JSON
const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return file.includes('clientes') ? {} : [];
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// GET /api/vendedores - Lista de vendedores
app.get('/api/vendedores', (req, res) => {
  const vendedores = readJSON(VENDEDORES_FILE);
  res.json(vendedores);
});

// GET /api/cliente/:usuarioId - Datos del cliente
app.get('/api/cliente/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;
  const clientes = readJSON(CLIENTES_FILE);
  const cliente = clientes[usuarioId] || { 
    logo: '', 
    vendedorId: null,
    sucursalId: 2
  };
  res.json(cliente);
});

// POST /api/cliente/:usuarioId/logo - Guardar logo
app.post('/api/cliente/:usuarioId/logo', (req, res) => {
  const { usuarioId } = req.params;
  const { logo } = req.body;
  
  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = { logo: '', vendedorId: null };
  }
  clientes[usuarioId].logo = logo;
  writeJSON(CLIENTES_FILE, clientes);
  
  res.json({ success: true });
});

// POST /api/cliente/:usuarioId/vendedor - Asignar vendedor
app.post('/api/cliente/:usuarioId/vendedor', (req, res) => {
  const { usuarioId } = req.params;
  const { vendedorId } = req.body;
  
  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = { logo: '', vendedorId: null };
  }
  clientes[usuarioId].vendedorId = vendedorId;
  writeJSON(CLIENTES_FILE, clientes);
  
  res.json({ success: true });
});

// POST /api/cliente/:usuarioId/sucursal - Guardar sucursal
app.post('/api/cliente/:usuarioId/sucursal', (req, res) => {
  const { usuarioId } = req.params;
  const { sucursalId } = req.body;
  
  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = { 
      logo: '', 
      vendedorId: null, 
      sucursalId: 2 
    };
  }
  clientes[usuarioId].sucursalId = sucursalId;
  writeJSON(CLIENTES_FILE, clientes);
  
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/enviar-presupuesto - Enviar PDF por email
app.post('/api/enviar-presupuesto', async (req, res) => {
  const { 
    pdfBase64, 
    nombreCliente, 
    totalUSD, 
    totalARS,
    emailDestino 
  } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const fechaHoy = new Date().toLocaleDateString('es-AR');
    const nombreArchivo = nombreCliente 
      ? `presupuesto_${nombreCliente.replace(/\s+/g, '_')}_${fechaHoy.replace(/\//g, '-')}.pdf`
      : `presupuesto_${fechaHoy.replace(/\//g, '-')}.pdf`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailDestino || 'pansapablo@gmail.com',
      subject: `Nuevo Presupuesto - ${nombreCliente || 'Sin nombre'} - ${fechaHoy}`,
      html: `
        <h2>Nuevo Presupuesto Generado</h2>
        <p><strong>Cliente:</strong> ${nombreCliente || 'No especificado'}</p>
        <p><strong>Fecha:</strong> ${fechaHoy}</p>
        <p><strong>Total USD:</strong> $${totalUSD}</p>
        <p><strong>Total ARS:</strong> $${totalARS}</p>
        <br>
        <p>Se adjunta el PDF del presupuesto.</p>
        <br>
        <p style="color: #666; font-size: 12px;">
          Email enviado automáticamente desde IDSR - Fortia
        </p>
      `,
      attachments: [
        {
          filename: nombreArchivo,
          content: pdfBase64,
          encoding: 'base64'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email enviado correctamente' });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar email',
      error: error.message 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend IDSR corriendo en puerto ${PORT}`);
});
