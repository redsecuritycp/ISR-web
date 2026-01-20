const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DATA_DIR = path.join(__dirname, "data");
const VENDEDORES_FILE = path.join(DATA_DIR, "vendedores.json");
const CLIENTES_FILE = path.join(DATA_DIR, "clientes.json");
const BUSQUEDAS_FILE = path.join(DATA_DIR, "busquedas.json");

// Crear directorio data si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper para leer/escribir JSON
const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    if (file.includes("busquedas")) return [];
    return file.includes("clientes") ? {} : [];
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// GET /api/vendedores
app.get("/api/vendedores", (req, res) => {
  const vendedores = readJSON(VENDEDORES_FILE);
  res.json(vendedores);
});

// GET /api/cliente/:usuarioId
app.get("/api/cliente/:usuarioId", (req, res) => {
  const { usuarioId } = req.params;
  const clientes = readJSON(CLIENTES_FILE);
  const cliente = clientes[usuarioId] || {
    logo: "",
    vendedorId: null,
    sucursalId: 2,
  };
  res.json(cliente);
});

// POST /api/cliente/:usuarioId/logo
app.post("/api/cliente/:usuarioId/logo", (req, res) => {
  const { usuarioId } = req.params;
  const { logo } = req.body;

  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = { logo: "", vendedorId: null };
  }
  clientes[usuarioId].logo = logo;
  writeJSON(CLIENTES_FILE, clientes);

  res.json({ success: true });
});

// POST /api/cliente/:usuarioId/vendedor
app.post("/api/cliente/:usuarioId/vendedor", (req, res) => {
  const { usuarioId } = req.params;
  const { vendedorId } = req.body;

  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = { logo: "", vendedorId: null };
  }
  clientes[usuarioId].vendedorId = vendedorId;
  writeJSON(CLIENTES_FILE, clientes);

  res.json({ success: true });
});

// POST /api/cliente/:usuarioId/sucursal
app.post("/api/cliente/:usuarioId/sucursal", (req, res) => {
  const { usuarioId } = req.params;
  const { sucursalId } = req.body;

  const clientes = readJSON(CLIENTES_FILE);
  if (!clientes[usuarioId]) {
    clientes[usuarioId] = {
      logo: "",
      vendedorId: null,
      sucursalId: 2,
    };
  }
  clientes[usuarioId].sucursalId = sucursalId;
  writeJSON(CLIENTES_FILE, clientes);

  res.json({ success: true });
});

// ================================================
// HISTORIAL DE BÚSQUEDAS
// ================================================

// POST /api/busqueda - Guardar búsqueda
app.post("/api/busqueda", (req, res) => {
  const { usuarioId, usuario, termino } = req.body;

  if (!termino || !termino.trim()) {
    return res.json({ success: false, message: "Sin término" });
  }

  const busquedas = readJSON(BUSQUEDAS_FILE);

  busquedas.push({
    usuarioId: usuarioId || 0,
    usuario: usuario || "Anónimo",
    termino: termino.trim().toLowerCase(),
    fecha: new Date().toISOString(),
  });

  writeJSON(BUSQUEDAS_FILE, busquedas);

  res.json({ success: true });
});

// GET /api/reporte-busquedas - Generar y enviar reporte mensual
app.get("/api/reporte-busquedas", async (req, res) => {
  try {
    const busquedas = readJSON(BUSQUEDAS_FILE);

    // Filtrar búsquedas del último mes
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    const busquedasMes = busquedas.filter(
      (b) => new Date(b.fecha) >= haceUnMes,
    );

    // Agrupar por cliente
    const porCliente = {};
    busquedasMes.forEach((b) => {
      const key = b.usuario || "Anónimo";
      if (!porCliente[key]) {
        porCliente[key] = {
          usuario: key,
          usuarioId: b.usuarioId,
          totalBusquedas: 0,
          terminos: {},
        };
      }
      porCliente[key].totalBusquedas++;

      // Contar términos
      const term = b.termino;
      porCliente[key].terminos[term] =
        (porCliente[key].terminos[term] || 0) + 1;
    });

    // Ordenar clientes por cantidad de búsquedas
    const clientesOrdenados = Object.values(porCliente).sort(
      (a, b) => b.totalBusquedas - a.totalBusquedas,
    );

    // Top 10 términos globales
    const terminosGlobales = {};
    busquedasMes.forEach((b) => {
      terminosGlobales[b.termino] = (terminosGlobales[b.termino] || 0) + 1;
    });
    const topTerminos = Object.entries(terminosGlobales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Generar URL del gráfico con QuickChart
    const labels = topTerminos.map((t) => t[0]).slice(0, 8);
    const data = topTerminos.map((t) => t[1]).slice(0, 8);

    const chartConfig = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Búsquedas",
            data: data,
            backgroundColor: "rgba(25, 118, 210, 0.8)",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Top Términos Buscados",
          },
        },
      },
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify(chartConfig),
    )}&w=500&h=300`;

    // Generar HTML del email
    const fechaReporte = new Date().toLocaleDateString("es-AR");
    const mesAnterior = new Date();
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    const mesNombre = mesAnterior.toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    });

    let tablaClientes = "";
    clientesOrdenados.slice(0, 20).forEach((c, i) => {
      const topTerms = Object.entries(c.terminos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((t) => t[0])
        .join(", ");

      tablaClientes += `
        <tr style="background-color: ${i % 2 === 0 ? "#f9f9f9" : "#fff"};">
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            ${c.usuario}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; 
              text-align: center; font-weight: bold; color: #1976D2;">
            ${c.totalBusquedas}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; 
              font-size: 12px; color: #666;">
            ${topTerms || "-"}
          </td>
        </tr>
      `;
    });

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; 
                  margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e1e1e, #333); 
                    color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; color: #d4af37;">
            📊 Reporte de Búsquedas
          </h1>
          <p style="margin: 10px 0 0 0; color: #ccc;">
            ${mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)}
          </p>
        </div>

        <div style="padding: 25px; background-color: #f5f5f5;">
          <div style="background: white; border-radius: 8px; 
                      padding: 20px; margin-bottom: 20px; 
                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">
              Resumen General
            </h2>
            <div style="display: flex; justify-content: space-around; 
                        text-align: center;">
              <div>
                <p style="font-size: 36px; font-weight: bold; 
                          color: #1976D2; margin: 0;">
                  ${busquedasMes.length}
                </p>
                <p style="color: #666; margin: 5px 0;">
                  Búsquedas Totales
                </p>
              </div>
              <div>
                <p style="font-size: 36px; font-weight: bold; 
                          color: #43a047; margin: 0;">
                  ${clientesOrdenados.length}
                </p>
                <p style="color: #666; margin: 5px 0;">
                  Clientes Activos
                </p>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 8px; 
                      padding: 20px; margin-bottom: 20px;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">
              Top Términos Buscados
            </h2>
            <img src="${chartUrl}" alt="Gráfico de búsquedas" 
                 style="width: 100%; max-width: 500px; display: block; 
                        margin: 0 auto;">
          </div>

          <div style="background: white; border-radius: 8px; 
                      padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">
              Búsquedas por Cliente
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #1976D2; color: white;">
                  <th style="padding: 12px; text-align: left;">Cliente</th>
                  <th style="padding: 12px; text-align: center;">
                    Búsquedas
                  </th>
                  <th style="padding: 12px; text-align: left;">
                    Términos Top
                  </th>
                </tr>
              </thead>
              <tbody>
                ${tablaClientes}
              </tbody>
            </table>
          </div>
        </div>

        <div style="background-color: #1e1e1e; color: #888; 
                    padding: 15px; text-align: center; font-size: 12px;">
          Reporte generado automáticamente - IDSR Fortia<br>
          ${fechaReporte}
        </div>
      </div>
    `;

    // Enviar email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "pansapablo@gmail.com",
      subject: `📊 Reporte de Búsquedas - ${mesNombre}`,
      html: htmlEmail,
    });

    // Limpiar búsquedas del mes anterior (opcional)
    // writeJSON(BUSQUEDAS_FILE, []);

    res.json({
      success: true,
      message: "Reporte enviado",
      stats: {
        totalBusquedas: busquedasMes.length,
        clientesActivos: clientesOrdenados.length,
        topTerminos: topTerminos.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// POST /api/enviar-presupuesto
app.post("/api/enviar-presupuesto", async (req, res) => {
  const {
    pdfBase64,
    nombreCliente,
    clienteFinal,
    totalUSD,
    totalARS,
    emailDestino,
  } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const fechaHoy = new Date().toLocaleDateString("es-AR");

    let nombreArchivo;
    if (clienteFinal) {
      nombreArchivo = `presupuesto_${clienteFinal.replace(
        /\s+/g,
        "_",
      )}_${fechaHoy.replace(/\//g, "-")}.pdf`;
    } else if (nombreCliente) {
      nombreArchivo = `presupuesto_${nombreCliente.replace(
        /\s+/g,
        "_",
      )}_${fechaHoy.replace(/\//g, "-")}.pdf`;
    } else {
      nombreArchivo = `presupuesto_${fechaHoy.replace(/\//g, "-")}.pdf`;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailDestino || "pansapablo@gmail.com",
      subject: `Nuevo Presupuesto - ${nombreCliente || "Cliente"} - ${fechaHoy}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; 
                    margin: 0 auto;">
          <div style="background-color: #1e1e1e; color: white; 
                      padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: #d4af37;">
              Nuevo Presupuesto Generado
            </h2>
          </div>

          <div style="padding: 20px; background-color: #f5f5f5;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  <strong>Generado por:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  ${nombreCliente || "No especificado"}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  <strong>Cliente final:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  ${clienteFinal || "No especificado"}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  <strong>Fecha:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  ${fechaHoy}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  <strong>Total USD:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; 
                    color: #2e7d32; font-weight: bold;">
                  $${totalUSD}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px;">
                  <strong>Total ARS:</strong>
                </td>
                <td style="padding: 10px; color: #1565c0; font-weight: bold;">
                  $${totalARS}
                </td>
              </tr>
            </table>
          </div>

          <div style="padding: 15px; background-color: #1e1e1e; 
                      color: #888; text-align: center; font-size: 12px;">
            Se adjunta el PDF del presupuesto.<br>
            Email enviado automáticamente desde IDSR - Fortia
          </div>
        </div>
      `,
      attachments: [
        {
          filename: nombreArchivo,
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error enviando email:", error);
    res.status(500).json({
      success: false,
      message: "Error al enviar email",
      error: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend IDSR corriendo en puerto ${PORT}`);
});
