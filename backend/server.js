const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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
    vendedorId: null 
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend IDSR corriendo en puerto ${PORT}`);
});
