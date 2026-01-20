<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-btn
            color="primary"
            outlined
            class="mr-4"
            @click="$router.push('/')"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            VOLVER AL INICIO
          </v-btn>
          <h1 class="text-h4 ma-0">
            <v-icon left>mdi-file-document-outline</v-icon>
            Presupuestador
          </h1>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4">
          <v-card-title class="pa-0 mb-3">
            <v-icon left>mdi-account</v-icon>
            Datos del Cliente
          </v-card-title>

          <v-text-field
            v-model="nombreCliente"
            label="Nombre del cliente / Empresa"
            outlined
            dense
            prepend-inner-icon="mdi-domain"
            placeholder="Ej: Seguridad Total SRL"
            class="mb-3"
            disabled
          ></v-text-field>

          <div class="mb-4">
            <label class="subtitle-2">Logo de la empresa</label>
            <div class="d-flex align-center mt-2">
              <v-avatar size="80" class="mr-4" color="grey lighten-3">
                <v-img v-if="logoPreview" :src="logoPreview"></v-img>
                <v-icon v-else size="40">mdi-image-plus</v-icon>
              </v-avatar>
              <div>
                <v-btn 
                  small 
                  color="primary" 
                  @click="$refs.logoInput.click()"
                >
                  Subir Logo
                </v-btn>
                <v-btn 
                  v-if="logoPreview" 
                  small 
                  text 
                  color="error" 
                  @click="eliminarLogo"
                  class="ml-2"
                >
                  Quitar
                </v-btn>
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onLogoSelected"
                />
              </div>
            </div>
          </div>

          <v-select
            v-model="vendedorSeleccionado"
            :items="vendedores"
            item-text="nombre"
            item-value="id"
            label="Vendedor asignado"
            outlined
            dense
            prepend-inner-icon="mdi-account-tie"
            @change="guardarVendedor"
          ></v-select>

          <v-select
            v-model="ivaSeleccionado"
            :items="opcionesIva"
            item-text="texto"
            item-value="valor"
            label="Alícuota IVA"
            outlined
            dense
            prepend-inner-icon="mdi-percent"
          ></v-select>

          <v-textarea
            v-model="observaciones"
            label="Observaciones"
            outlined
            dense
            rows="3"
            prepend-inner-icon="mdi-note-text"
            placeholder="Notas adicionales para el presupuesto..."
          ></v-textarea>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4">
          <v-card-title class="pa-0 mb-3">
            <v-icon left>mdi-calculator</v-icon>
            Resumen
          </v-card-title>
          <div class="d-flex justify-space-between mb-2">
            <span>Productos:</span>
            <strong>{{ itemsPresupuesto.length }}</strong>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>Mano de obra:</span>
            <strong>{{ itemsManoObra.length }}</strong>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between mb-2">
            <span>Subtotal USD:</span>
            <strong>$ {{ subtotalUSD }}</strong>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>IVA ({{ ivaSeleccionado }}%):</span>
            <strong>$ {{ ivaUSD }}</strong>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between mb-2">
            <span>Total USD:</span>
            <strong class="green--text text-h6">
              $ {{ totalUSD }}
            </strong>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <span>Total ARS:</span>
            <strong class="blue--text text-h6">
              $ {{ totalARS }}
            </strong>
          </div>
          <v-btn 
            block 
            color="success" 
            :disabled="itemsPresupuesto.length === 0 
              && itemsManoObra.length === 0"
            @click="generarPDF"
            class="mb-2"
          >
            <v-icon left>mdi-file-pdf-box</v-icon>
            GENERAR PDF
          </v-btn>
          <v-btn 
            block 
            outlined
            color="primary" 
            @click="$router.push('/productos')"
          >
            <v-icon left>mdi-cart-plus</v-icon>
            Seguir comprando
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon left>mdi-account-hard-hat</v-icon>
            Mano de Obra / Servicios
            <v-spacer></v-spacer>
            <v-btn 
              small 
              color="primary"
              @click="mostrarDialogManoObra = true"
            >
              <v-icon left small>mdi-plus</v-icon>
              Agregar
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text v-if="itemsManoObra.length === 0">
            <v-alert type="info" text dense>
              No hay servicios agregados. 
              Usá el botón "Agregar" para incluir mano de obra.
            </v-alert>
          </v-card-text>

          <v-simple-table v-else>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th class="text-right">USD</th>
                  <th class="text-right">ARS</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsManoObra" :key="item.id">
                  <td>{{ item.descripcion }}</td>
                  <td class="text-right">
                    $ {{ parseFloat(item.precioUSD).toFixed(2) }}
                  </td>
                  <td class="text-right">
                    $ {{ parseFloat(item.precioARS).toFixed(2) }}
                  </td>
                  <td class="text-center">
                    <v-btn 
                      icon 
                      small 
                      color="error"
                      @click="eliminarManoObra(item.id)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-cart</v-icon>
            Productos en el presupuesto
            <v-spacer></v-spacer>
            <v-btn 
              small 
              text 
              color="error" 
              @click="limpiarPresupuesto"
              v-if="itemsPresupuesto.length > 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              Limpiar todo
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text v-if="itemsPresupuesto.length === 0">
            <v-alert type="info" text>
              No hay productos en el presupuesto. 
              Agregá productos desde el catálogo.
            </v-alert>
            <v-btn color="primary" to="/productos">
              <v-icon left>mdi-shopping</v-icon>
              Ir al catálogo
            </v-btn>
          </v-card-text>

          <v-simple-table v-else>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Marca</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-right">USD Unit.</th>
                  <th class="text-right">USD Total</th>
                  <th class="text-right">ARS Total</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="item in itemsPresupuesto" 
                  :key="item.id"
                >
                  <td>{{ item.producto }}</td>
                  <td>{{ item.marca }}</td>
                  <td class="text-center" style="width: 120px;">
                    <v-text-field
                      v-model.number="item.cantidad"
                      type="number"
                      min="1"
                      dense
                      hide-details
                      outlined
                      class="centered-input"
                      @change="actualizarCantidad(item)"
                    ></v-text-field>
                  </td>
                  <td class="text-right">
                    $ {{ parseFloat(item.netoUSD).toFixed(2) }}
                  </td>
                  <td class="text-right">
                    $ {{ calcularTotalItem(item, 'USD') }}
                  </td>
                  <td class="text-right">
                    $ {{ calcularTotalItem(item, 'ARS') }}
                  </td>
                  <td class="text-center">
                    <v-btn 
                      icon 
                      small 
                      color="error"
                      @click="eliminarItem(item.id)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="mostrarDialogManoObra" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-account-hard-hat</v-icon>
          Agregar Mano de Obra
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="nuevaManoObra.descripcion"
            label="Descripción del servicio"
            outlined
            dense
            placeholder="Ej: Instalación de cámaras"
          ></v-text-field>
          <v-text-field
            v-model.number="nuevaManoObra.precioUSD"
            label="Precio USD"
            type="number"
            min="0"
            step="0.01"
            outlined
            dense
            prefix="$"
          ></v-text-field>
          <p class="text-caption grey--text">
            El precio en ARS se calculará automáticamente.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            text 
            @click="mostrarDialogManoObra = false"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            @click="agregarManoObra"
            :disabled="!nuevaManoObra.descripcion 
              || !nuevaManoObra.precioUSD"
          >
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'PresupuestadorView',

  data() {
    return {
      nombreCliente: '',
      logoPreview: '',
      vendedorSeleccionado: null,
      vendedores: [],
      ivaSeleccionado: 21,
      opcionesIva: [
        { texto: '21%', valor: 21 },
        { texto: '10.5%', valor: 10.5 },
        { texto: 'Exento (0%)', valor: 0 }
      ],
      observaciones: localStorage.getItem('observaciones') || '',
      itemsManoObra: [],
      mostrarDialogManoObra: false,
      nuevaManoObra: {
        descripcion: '',
        precioUSD: null
      },
      cotizacionDolar: 1470
    }
  },

  computed: {
    itemsPresupuesto() {
      return this.$store.state.itemsPresupuesto;
    },
    subtotalProductosUSD() {
      return this.itemsPresupuesto
        .reduce((sum, item) => {
          return sum + (parseFloat(item.netoUSD) * item.cantidad);
        }, 0);
    },
    subtotalManoObraUSD() {
      return this.itemsManoObra
        .reduce((sum, item) => {
          return sum + parseFloat(item.precioUSD);
        }, 0);
    },
    subtotalUSD() {
      return (this.subtotalProductosUSD + this.subtotalManoObraUSD)
        .toFixed(2);
    },
    ivaUSD() {
      const subtotal = parseFloat(this.subtotalUSD);
      return (subtotal * this.ivaSeleccionado / 100).toFixed(2);
    },
    totalUSD() {
      const subtotal = parseFloat(this.subtotalUSD);
      const iva = parseFloat(this.ivaUSD);
      return (subtotal + iva).toFixed(2);
    },
    totalARS() {
      return (parseFloat(this.totalUSD) * this.cotizacionDolar)
        .toFixed(2);
    }
  },

  watch: {
    observaciones(val) {
      localStorage.setItem('observaciones', val);
    }
  },

  async mounted() {
    // Obtener nombre del cliente desde el store
    this.nombreCliente = this.$store.state.usuario || '';

    await this.cargarVendedores();
    await this.cargarDatosCliente();
    await this.obtenerCotizacionDolar();
    this.cargarManoObraGuardada();
  },

  methods: {
    async obtenerCotizacionDolar() {
      try {
        const res = await fetch(
          'https://dolarapi.com/v1/dolares/oficial'
        );
        const data = await res.json();
        if (data && data.venta) {
          this.cotizacionDolar = data.venta;
        }
      } catch (error) {
        console.error('Error obteniendo dólar:', error);
      }
    },

    async cargarVendedores() {
      try {
        const response = await fetch('/api/vendedores');
        this.vendedores = await response.json();
      } catch (error) {
        console.error('Error cargando vendedores:', error);
      }
    },

    async cargarDatosCliente() {
      const usuarioId = this.$store.state.usuarioId;
      if (!usuarioId || usuarioId === 0) return;

      try {
        const response = await fetch(`/api/cliente/${usuarioId}`);
        const data = await response.json();
        if (data.logo) {
          this.logoPreview = data.logo;
        }
        if (data.vendedorId) {
          this.vendedorSeleccionado = data.vendedorId;
        }
      } catch (error) {
        console.error('Error cargando datos cliente:', error);
      }
    },

    onLogoSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        this.logoPreview = e.target.result;
        await this.guardarLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    },

    async guardarLogo(logoBase64) {
      const usuarioId = this.$store.state.usuarioId;
      if (!usuarioId || usuarioId === 0) return;

      try {
        await fetch(`/api/cliente/${usuarioId}/logo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo: logoBase64 })
        });
      } catch (error) {
        console.error('Error guardando logo:', error);
      }
    },

    async eliminarLogo() {
      this.logoPreview = '';
      await this.guardarLogo('');
    },

    async guardarVendedor() {
      const usuarioId = this.$store.state.usuarioId;
      if (!usuarioId || usuarioId === 0) return;

      try {
        await fetch(`/api/cliente/${usuarioId}/vendedor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            vendedorId: this.vendedorSeleccionado 
          })
        });
      } catch (error) {
        console.error('Error guardando vendedor:', error);
      }
    },

    actualizarCantidad(item) {
      if (item.cantidad < 1) item.cantidad = 1;
      this.$store.commit('updateCantidadPresupuesto', {
        id: item.id,
        cantidad: item.cantidad
      });
    },

    eliminarItem(id) {
      this.$store.commit('removeItemPresupuesto', id);
    },

    limpiarPresupuesto() {
      if (confirm(
        '¿Seguro que querés limpiar todo el presupuesto?'
      )) {
        this.$store.commit('clearPresupuesto');
        this.itemsManoObra = [];
        this.guardarManoObra();
      }
    },

    calcularTotalItem(item, moneda) {
      const precio = moneda === 'USD' 
        ? parseFloat(item.netoUSD) 
        : parseFloat(item.netoARS);
      return (precio * item.cantidad).toFixed(2);
    },

    agregarManoObra() {
      const precioUSD = parseFloat(this.nuevaManoObra.precioUSD);
      const precioARS = precioUSD * this.cotizacionDolar;

      this.itemsManoObra.push({
        id: Date.now(),
        descripcion: this.nuevaManoObra.descripcion,
        precioUSD: precioUSD,
        precioARS: precioARS
      });

      this.guardarManoObra();
      this.nuevaManoObra = { descripcion: '', precioUSD: null };
      this.mostrarDialogManoObra = false;
    },

    eliminarManoObra(id) {
      this.itemsManoObra = this.itemsManoObra.filter(
        i => i.id !== id
      );
      this.guardarManoObra();
    },

    guardarManoObra() {
      localStorage.setItem(
        'itemsManoObra', 
        JSON.stringify(this.itemsManoObra)
      );
    },

    cargarManoObraGuardada() {
      const guardado = localStorage.getItem('itemsManoObra');
      if (guardado) {
        try {
          this.itemsManoObra = JSON.parse(guardado);
        } catch (error) {
          console.error('Error cargando mano de obra:', error);
        }
      }
    },

    async generarPDF() {
      const doc = new jsPDF();
      const fechaHoy = new Date().toLocaleDateString('es-AR');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Colores NEGRO y DORADO
      const negro = [25, 25, 25];
      const dorado = [184, 157, 102];
      const doradoClaro = [212, 192, 150];
      const grisTexto = [80, 80, 80];

      // === HEADER NEGRO ===
      doc.setFillColor(negro[0], negro[1], negro[2]);
      doc.rect(0, 0, pageWidth, 45, 'F');

      // Línea dorada decorativa
      doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
      doc.setLineWidth(1.5);
      doc.line(0, 45, pageWidth, 45);

      let xContenido = 15;

      // Logo del cliente (si hay)
      if (this.logoPreview && this.logoPreview.length > 100) {
        try {
          let formato = 'JPEG';
          if (this.logoPreview.indexOf('image/png') > -1) {
            formato = 'PNG';
          }
          doc.addImage(this.logoPreview, formato, 12, 7, 30, 30);
          xContenido = 48;
        } catch (e) {
          console.log('Error logo:', e);
        }
      }

      // Nombre cliente
      const titulo = this.nombreCliente || 'PRESUPUESTO';
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(titulo.toUpperCase(), xContenido, 22);

      // Línea dorada bajo el nombre
      doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
      doc.setLineWidth(0.8);
      doc.line(xContenido, 26, xContenido + 60, 26);

      // Fecha elegante a la derecha
      doc.setFillColor(dorado[0], dorado[1], dorado[2]);
      doc.roundedRect(pageWidth - 50, 12, 40, 18, 2, 2, 'F');
      doc.setTextColor(negro[0], negro[1], negro[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('FECHA', pageWidth - 30, 20, { align: 'center' });
      doc.setFontSize(11);
      doc.text(fechaHoy, pageWidth - 30, 27, { align: 'center' });

      let yPos = 58;

      // === PRODUCTOS ===
      if (this.itemsPresupuesto.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(dorado[0], dorado[1], dorado[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLE DE PRODUCTOS', 15, yPos);
        doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
        doc.setLineWidth(0.5);
        doc.line(15, yPos + 2, 70, yPos + 2);
        yPos += 6;

        const productosData = this.itemsPresupuesto.map(item => {
          let nombre = item.producto.replace(/\*\*/g, '');
          if (nombre.length > 42) {
            nombre = nombre.substring(0, 42) + '...';
          }
          return [
            nombre,
            item.marca,
            item.cantidad.toString(),
            '$ ' + parseFloat(item.netoUSD).toFixed(2),
            '$ ' + (parseFloat(item.netoUSD) * item.cantidad).toFixed(2)
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'Marca', 'Cant.', 'Unitario', 'Total']],
          body: productosData,
          theme: 'grid',
          headStyles: { 
            fillColor: negro,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
          },
          bodyStyles: { 
            fontSize: 8,
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250]
          }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // === MANO DE OBRA ===
      if (this.itemsManoObra.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(dorado[0], dorado[1], dorado[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICIOS ADICIONALES', 15, yPos);
        doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
        doc.setLineWidth(0.5);
        doc.line(15, yPos + 2, 65, yPos + 2);
        yPos += 6;

        const manoObraData = this.itemsManoObra.map(item => [
          item.descripcion,
          '$ ' + parseFloat(item.precioUSD).toFixed(2)
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Descripción', 'Precio USD']],
          body: manoObraData,
          theme: 'grid',
          headStyles: { 
            fillColor: negro,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
          },
          bodyStyles: { 
            fontSize: 8,
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250]
          }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // === OBSERVACIONES ===
      if (this.observaciones && this.observaciones.trim()) {
        doc.setFontSize(11);
        doc.setTextColor(dorado[0], dorado[1], dorado[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES', 15, yPos);
        doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
        doc.setLineWidth(0.5);
        doc.line(15, yPos + 2, 55, yPos + 2);

        yPos += 8;
        const obsLines = doc.splitTextToSize(
          this.observaciones, 
          pageWidth - 30
        );

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        doc.setFontSize(9);
        doc.text(obsLines, 15, yPos);

        yPos += obsLines.length * 5 + 10;
      }

      // === CUADRO DE TOTALES ===
      const totY = Math.max(yPos + 5, 180);
      const boxX = pageWidth - 75;
      const boxW = 60;

      doc.setFillColor(negro[0], negro[1], negro[2]);
      doc.roundedRect(boxX, totY, boxW, 50, 3, 3, 'F');

      doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
      doc.setLineWidth(1);
      doc.roundedRect(boxX, totY, boxW, 50, 3, 3, 'S');

      let tY = totY + 12;
      doc.setFontSize(9);
      doc.setTextColor(doradoClaro[0], doradoClaro[1], doradoClaro[2]);
      doc.setFont('helvetica', 'normal');

      doc.text('Subtotal:', boxX + 5, tY);
      doc.text('$ ' + this.subtotalUSD, boxX + boxW - 5, tY, 
        { align: 'right' });

      tY += 8;
      doc.text('IVA ' + this.ivaSeleccionado + '%:', boxX + 5, tY);
      doc.text('$ ' + this.ivaUSD, boxX + boxW - 5, tY, 
        { align: 'right' });

      tY += 6;
      doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
      doc.setLineWidth(0.5);
      doc.line(boxX + 5, tY, boxX + boxW - 5, tY);

      tY += 10;
      doc.setFontSize(10);
      doc.setTextColor(dorado[0], dorado[1], dorado[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL USD', boxX + 5, tY);
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('$ ' + this.totalUSD, boxX + boxW - 5, tY, 
        { align: 'right' });

      tY += 9;
      doc.setFontSize(8);
      doc.setTextColor(doradoClaro[0], doradoClaro[1], doradoClaro[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('ARS $ ' + this.formatearNumero(this.totalARS), 
        boxX + boxW - 5, tY, { align: 'right' });

      // === FOOTER ===
      doc.setFillColor(negro[0], negro[1], negro[2]);
      doc.rect(0, 282, pageWidth, 15, 'F');

      doc.setFontSize(8);
      doc.setTextColor(doradoClaro[0], doradoClaro[1], doradoClaro[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Presupuesto válido por 7 días  |  ' +
        'Precios sujetos a modificación sin previo aviso',
        pageWidth / 2,
        289,
        { align: 'center' }
      );

      // === NOMBRE ARCHIVO ===
      let nombreArchivo = 'presupuesto_' + 
        fechaHoy.replace(/\//g, '-') + '.pdf';
      if (this.nombreCliente && this.nombreCliente.length > 0) {
        const nombreLimpio = this.nombreCliente
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_');
        nombreArchivo = 'presupuesto_' + nombreLimpio + '_' + 
          fechaHoy.replace(/\//g, '-') + '.pdf';
      }

      // === ENVIAR EMAIL ===
      try {
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        await fetch('/api/enviar-presupuesto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64,
            nombreCliente: this.nombreCliente,
            totalUSD: this.totalUSD,
            totalARS: this.totalARS,
            emailDestino: 'pansapablo@gmail.com'
          })
        });
        this.$alertify.success('Presupuesto enviado por email');
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        this.$alertify.warning('PDF generado pero no se pudo enviar email');
      }

      // === GUARDAR PDF ===
      doc.save(nombreArchivo);
    },

    formatearNumero(numero) {
      return parseFloat(numero).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>