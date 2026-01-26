const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const DATA_DIR = path.join(__dirname, "data");

// === MAPA VENDEDORES -> EMAIL ===
const VENDEDOR_EMAILS = {
  'Agustina Mur': 'ventasisrluciano@gmail.com',
  'Maxi': 'ventasisrmaxi@gmail.com',
  'Facundo': 'ventasisrfacundo@gmail.com',
  'Estefania': 'ventasisrestefania@gmail.com',
  'Estefanía': 'ventasisrestefania@gmail.com',
  'Luciano': 'lucianobalonchard2019@gmail.com',
  'Mario Szemruch': 'facundogruposer@gmail.com',
  'ventas isenoa': 'info.isenoa@gmail.com',
  'milesi': 'pansapablo@gmail.com'
};
const EMAIL_DEFAULT = 'pansapablo@gmail.com';

// === CIANBOX CONFIG ===
const CIANBOX_URL = "https://cianbox.org/insumosdeseguridadrosario";
let cianboxCookies = null;
let cianboxLastLogin = null;

async function cianboxLogin() {
  try {
    const user = process.env.CIANBOX_USER;
    const pass = process.env.CIANBOX_PASS;

    if (!user || !pass) {
      throw new Error("Faltan credenciales CIANBOX_USER/PASS");
    }

    const loginUrl = `${CIANBOX_URL}/login.php`;

    const response = await axios.post(
      loginUrl,
      `usuario=${encodeURIComponent(user)}&clave=${encodeURIComponent(pass)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 400 || status === 302,
      },
    );

    const setCookies = response.headers["set-cookie"];
    if (setCookies) {
      cianboxCookies = setCookies.map((c) => c.split(";")[0]).join("; ");
      cianboxLastLogin = Date.now();
      console.log("Login Cianbox exitoso");
      return true;
    }

    throw new Error("No se recibieron cookies");
  } catch (error) {
    console.error("Error login Cianbox:", error.message);
    return false;
  }
}

async function ensureCianboxLogin() {
  const THIRTY_MIN = 30 * 60 * 1000;
  if (
    !cianboxCookies ||
    !cianboxLastLogin ||
    Date.now() - cianboxLastLogin > THIRTY_MIN
  ) {
    return await cianboxLogin();
  }
  return true;
}

async function cianboxPost(sec, extraParams = {}) {
  await ensureCianboxLogin();

  if (!cianboxCookies) {
    throw new Error("No hay sesión de Cianbox");
  }

  const params = new URLSearchParams({
    sec: sec,
    userid: "20",
    userlevel: "1",
    id_equipo: "0",
    tipo_a: "modulo",
    ...extraParams,
  });

  const response = await axios.post(
    `${CIANBOX_URL}/content.php`,
    params.toString(),
    {
      headers: {
        Cookie: cianboxCookies,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
}

// === HEALTH CHECK (Replit necesita endpoint rápido) ===
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// === ENDPOINT: Productos con IVA ===
app.get("/api/cianbox/productos-iva", async (req, res) => {
  try {
    const html = await cianboxPost("pv_productos");
    const $ = cheerio.load(html);
    const productos = [];

    $("tr").each((i, row) => {
      const cols = $(row).find("td");
      if (cols.length >= 8) {
        const textos = [];
        cols.each((j, col) => {
          textos.push($(col).text().trim());
        });

        const marca = textos[0];
        const codigo = textos[1];
        const descripcion = textos[2];
        const stockTotal = textos[3];
        const finalIvaStr = textos[6];
        const netoStr = textos[7];

        const parsearPrecio = (str) => {
          if (!str) return 0;
          return (
            parseFloat(
              str
                .replace("u$s", "")
                .replace("u$S", "")
                .replace("$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim(),
            ) || 0
          );
        };

        const neto = parsearPrecio(netoStr);
        const finalIva = parsearPrecio(finalIvaStr);

        let ivaPercent = 0;
        if (neto > 0 && finalIva > neto) {
          ivaPercent = ((finalIva - neto) / neto) * 100;
          ivaPercent = Math.round(ivaPercent * 10) / 10;
        }

        if (codigo && codigo.length > 2) {
          productos.push({
            codigo,
            marca,
            descripcion: descripcion.substring(0, 80),
            stockTotal,
            netoUSD: neto,
            finalUSD: finalIva,
            ivaPercent,
          });
        }
      }
    });

    res.json({ success: true, total: productos.length, productos });
  } catch (error) {
    console.error("Error productos-iva:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ENDPOINT: Clientes por vendedor ===
app.get("/api/cianbox/clientes-vendedor", async (req, res) => {
  try {
    const html = await cianboxPost("pv_clientes", {
      filter: "",
      pag: "1",
      lastId: "9999",
      scroll: "0",
    });
    const $ = cheerio.load(html);
    const clientes = [];

    $("tr").each((i, row) => {
      const cols = $(row).find("td");
      if (cols.length >= 12) {
        const textos = [];
        cols.each((j, col) => {
          textos.push($(col).text().trim());
        });

        const nombre = textos[0];
        const fantasia = textos[1];
        const domicilio = textos[2];
        const cuit = textos[3];
        const localidad = textos[4];
        const email = textos[5];
        const observaciones = textos[6];
        const saldo = textos[10];
        const vendedor = textos[11] || "Sin asignar";
        const id = textos[12];

        if (nombre && nombre.length > 2) {
          clientes.push({
            id, nombre, fantasia, domicilio, cuit,
            localidad, email, observaciones, saldo, vendedor,
          });
        }
      }
    });

    const porVendedor = {};
    clientes.forEach((c) => {
      const v = c.vendedor || "Sin asignar";
      if (!porVendedor[v]) porVendedor[v] = [];
      porVendedor[v].push(c);
    });

    const resumenVendedores = Object.keys(porVendedor).map((v) => ({
      vendedor: v,
      cantidadClientes: porVendedor[v].length,
    }));

    res.json({
      success: true,
      total: clientes.length,
      resumenVendedores,
      clientes,
      porVendedor,
    });
  } catch (error) {
    console.error("Error clientes-vendedor:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ENDPOINT: Test conexión Cianbox ===
app.get("/api/cianbox/test", async (req, res) => {
  try {
    const ok = await cianboxLogin();
    res.json({
      success: ok,
      message: ok ? "Conexión exitosa" : "Fallo el login",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ENDPOINTS EXISTENTES ===

app.get("/api/vendedores", (req, res) => {
  try {
    const data = fs.readFileSync(
      path.join(DATA_DIR, "vendedores.json"),
      "utf8",
    );
    res.json(JSON.parse(data));
  } catch (error) {
    res.json([]);
  }
});

app.get("/api/cliente/:id", (req, res) => {
  try {
    const clientesPath = path.join(DATA_DIR, "clientes.json");
    let clientes = {};
    if (fs.existsSync(clientesPath)) {
      clientes = JSON.parse(fs.readFileSync(clientesPath, "utf8"));
    }
    const cliente = clientes[req.params.id] || {};
    res.json(cliente);
  } catch (error) {
    res.json({});
  }
});

app.post("/api/cliente/:id/logo", (req, res) => {
  try {
    const clientesPath = path.join(DATA_DIR, "clientes.json");
    let clientes = {};
    if (fs.existsSync(clientesPath)) {
      clientes = JSON.parse(fs.readFileSync(clientesPath, "utf8"));
    }
    if (!clientes[req.params.id]) clientes[req.params.id] = {};
    clientes[req.params.id].logo = req.body.logo;
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/cliente/:id/vendedor", (req, res) => {
  try {
    const clientesPath = path.join(DATA_DIR, "clientes.json");
    let clientes = {};
    if (fs.existsSync(clientesPath)) {
      clientes = JSON.parse(fs.readFileSync(clientesPath, "utf8"));
    }
    if (!clientes[req.params.id]) clientes[req.params.id] = {};
    clientes[req.params.id].vendedorId = req.body.vendedorId;
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/cliente/:id/sucursal", (req, res) => {
  try {
    const clientesPath = path.join(DATA_DIR, "clientes.json");
    let clientes = {};
    if (fs.existsSync(clientesPath)) {
      clientes = JSON.parse(fs.readFileSync(clientesPath, "utf8"));
    }
    if (!clientes[req.params.id]) clientes[req.params.id] = {};
    clientes[req.params.id].sucursalId = req.body.sucursalId;
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/enviar-presupuesto", async (req, res) => {
  console.log('=== RECIBIDO PEDIDO EMAIL ===');
  try {
    const {
      pdfBase64, nombreCliente, clienteFinal,
      totalUSD, totalARS, vendedor
    } = req.body;

    const emailDestino = VENDEDOR_EMAILS[vendedor] || EMAIL_DEFAULT;
    console.log('Vendedor:', vendedor, '-> Email:', emailDestino);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const fecha = new Date().toLocaleDateString("es-AR");

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emailDestino,
      subject: `Presupuesto - ${clienteFinal || nombreCliente} - ${fecha}`,
      html: `
        <h2>Nuevo Presupuesto Generado</h2>
        <p><strong>Cliente:</strong> ${nombreCliente}</p>
        <p><strong>Cliente Final:</strong> ${clienteFinal || "-"}</p>
        <p><strong>Vendedor:</strong> ${vendedor || "-"}</p>
        <p><strong>Total USD:</strong> $${totalUSD}</p>
        <p><strong>Total ARS:</strong> $${totalARS}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
      `,
      attachments: [
        {
          filename: `presupuesto_${fecha.replace(/\//g, "-")}.pdf`,
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    });

    res.json({ success: true, emailEnviado: emailDestino });
  } catch (error) {
    console.error("Error enviando email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === SERVIR ARCHIVOS ESTÁTICOS ===
const distPath = path.join(__dirname, '..', 'dist');
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(distPath));
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

function startServer(retries = 5) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend corriendo en puerto ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Puerto ${PORT} ocupado. Reintentos restantes: ${retries}`);
      if (retries > 0) {
        setTimeout(() => {
          server.close();
          startServer(retries - 1);
        }, 2000);
      } else {
        console.error('No se pudo liberar el puerto después de varios intentos.');
        process.exit(1);
      }
    } else {
      console.error('Error en el servidor:', err);
    }
  });

  // Cierre limpio
  const shutdown = () => {
    console.log('Cerrando servidor backend...');
    server.close(() => {
      console.log('Servidor cerrado correctamente.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
