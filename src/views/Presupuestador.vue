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
          
          <div class="mb-4">
            <label class="subtitle-2">Logo de tu empresa</label>
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
      logoPreview: '',
      vendedorSeleccionado: null,
      vendedores: [],
      colorCliente: localStorage.getItem('colorCliente') || '#1976D2',
      ivaSeleccionado: 21,
      opcionesIva: [
        { texto: '21%', valor: 21 },
        { texto: '10.5%', valor: 10.5 },
        { texto: 'Exento (0%)', valor: 0 }
      ],
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

  async mounted() {
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
        this.extraerColorDominante(e.target.result);
      };
      reader.readAsDataURL(file);
    },

    extraerColorDominante(imageSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size).data;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < imageData.length; i += 4) {
          const red = imageData[i];
          const green = imageData[i + 1];
          const blue = imageData[i + 2];
          const alpha = imageData[i + 3];
          
          if (alpha < 128) continue;
          
          const brightness = (red + green + blue) / 3;
          if (brightness > 240 || brightness < 15) continue;
          
          r += red;
          g += green;
          b += blue;
          count++;
        }
        
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          const brightness = (r + g + b) / 3;
          
          if (brightness < 60) {
            this.colorCliente = '#37474F';
          } else if (brightness > 200) {
            this.colorCliente = '#1976D2';
          } else {
            const toHex = (c) => c.toString(16).padStart(2, '0');
            this.colorCliente = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
          }
        } else {
          this.colorCliente = '#1976D2';
        }
        
        localStorage.setItem('colorCliente', this.colorCliente);
      };
      img.src = imageSrc;
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
      this.colorCliente = '#1976D2';
      localStorage.setItem('colorCliente', this.colorCliente);
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
      if (confirm('¿Seguro que querés limpiar todo?')) {
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

    generarPDF() {
      const doc = new jsPDF();
      const fechaHoy = new Date().toLocaleDateString('es-AR');
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(25, 118, 210);
      doc.text('PRESUPUESTO', 105, 20, { align: 'center' });
      
      // Fecha
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha: ${fechaHoy}`, 195, 15, { align: 'right' });
      
      // Línea separadora
      doc.setDrawColor(25, 118, 210);
      doc.setLineWidth(0.5);
      doc.line(15, 25, 195, 25);
      
      // Info sucursal
      doc.setFontSize(12);
      doc.setTextColor(0);
      const sucursal = this.$store.state.idSucursal === 1 
        ? 'ISENOA - Tucumán' 
        : 'Insumos de Seguridad Rosario';
      doc.text(sucursal, 15, 35);
      
      // Vendedor
      if (this.vendedorSeleccionado) {
        const vendedor = this.vendedores.find(
          v => v.id === this.vendedorSeleccionado
        );
        if (vendedor) {
          doc.setFontSize(10);
          doc.text(`Vendedor: ${vendedor.nombre}`, 15, 42);
        }
      }
      
      let yPos = 52;
      
      // Tabla de productos
      if (this.itemsPresupuesto.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(25, 118, 210);
        doc.text('Productos', 15, yPos);
        yPos += 5;
        
        const productosData = this.itemsPresupuesto.map(item => [
          item.producto.substring(0, 40),
          item.marca,
          item.cantidad,
          `$ ${parseFloat(item.netoUSD).toFixed(2)}`,
          `$ ${(parseFloat(item.netoUSD) * item.cantidad).toFixed(2)}`
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'Marca', 'Cant.', 'USD Unit.', 'USD Total']],
          body: productosData,
          theme: 'striped',
          headStyles: { 
            fillColor: [25, 118, 210],
            fontSize: 9
          },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 30 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // Tabla de mano de obra
      if (this.itemsManoObra.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(25, 118, 210);
        doc.text('Mano de Obra / Servicios', 15, yPos);
        yPos += 5;
        
        const manoObraData = this.itemsManoObra.map(item => [
          item.descripcion,
          `$ ${parseFloat(item.precioUSD).toFixed(2)}`
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Descripción', 'USD']],
          body: manoObraData,
          theme: 'striped',
          headStyles: { 
            fillColor: [76, 175, 80],
            fontSize: 9
          },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 40, halign: 'right' }
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // Totales
      yPos += 5;
      doc.setDrawColor(200);
      doc.line(120, yPos, 195, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text('Subtotal USD:', 120, yPos);
      doc.text(`$ ${this.subtotalUSD}`, 195, yPos, { align: 'right' });
      
      yPos += 7;
      doc.text(`IVA (${this.ivaSeleccionado}%):`, 120, yPos);
      doc.text(`$ ${this.ivaUSD}`, 195, yPos, { align: 'right' });
      
      yPos += 2;
      doc.setDrawColor(25, 118, 210);
      doc.line(120, yPos, 195, yPos);
      
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(25, 118, 210);
      doc.text('TOTAL USD:', 120, yPos);
      doc.setFontSize(14);
      doc.text(`$ ${this.totalUSD}`, 195, yPos, { align: 'right' });
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text('Total ARS:', 120, yPos);
      doc.text(`$ ${this.totalARS}`, 195, yPos, { align: 'right' });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Presupuesto válido por 7 días. Precios sujetos a cambio.',
        105, 285, { align: 'center' }
      );
      
      // Descargar
      doc.save(`presupuesto_${fechaHoy.replace(/\//g, '-')}.pdf`);
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
