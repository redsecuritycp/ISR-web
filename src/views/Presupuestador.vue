<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <v-icon left>mdi-file-document-outline</v-icon>
          Presupuestador
        </h1>
      </v-col>
    </v-row>

    <!-- Datos del cliente -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4">
          <v-card-title class="pa-0 mb-3">
            <v-icon left>mdi-account</v-icon>
            Datos del Cliente
          </v-card-title>
          
          <!-- Logo -->
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

          <!-- Vendedor -->
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
        </v-card>
      </v-col>

      <!-- Resumen -->
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
            <span>Total USD:</span>
            <strong class="green--text">
              $ {{ totalUSD }}
            </strong>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <span>Total ARS:</span>
            <strong class="blue--text">
              $ {{ totalARS }}
            </strong>
          </div>
          <v-btn 
            block 
            color="success" 
            :disabled="itemsPresupuesto.length === 0"
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

    <!-- Lista de productos -->
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
  </v-container>
</template>

<script>
export default {
  name: 'PresupuestadorView',
  
  data() {
    return {
      logoPreview: '',
      vendedorSeleccionado: null,
      vendedores: []
    }
  },

  computed: {
    itemsPresupuesto() {
      return this.$store.state.itemsPresupuesto;
    },
    totalUSD() {
      return this.itemsPresupuesto
        .reduce((sum, item) => {
          return sum + (parseFloat(item.netoUSD) * item.cantidad);
        }, 0)
        .toFixed(2);
    },
    totalARS() {
      return this.itemsPresupuesto
        .reduce((sum, item) => {
          return sum + (parseFloat(item.netoARS) * item.cantidad);
        }, 0)
        .toFixed(2);
    }
  },

  async mounted() {
    await this.cargarVendedores();
    await this.cargarDatosCliente();
  },

  methods: {
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
      if (confirm('¿Seguro que querés limpiar todo el presupuesto?')) {
        this.$store.commit('clearPresupuesto');
      }
    },

    calcularTotalItem(item, moneda) {
      const precio = moneda === 'USD' 
        ? parseFloat(item.netoUSD) 
        : parseFloat(item.netoARS);
      return (precio * item.cantidad).toFixed(2);
    },

    generarPDF() {
      const doc = new jsPDF();
      const fechaHoy = new Date().toLocaleDateString('es-AR');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      let yPos = 20;
      let logoOK = false;
      
      if (this.logoPreview && this.logoPreview.length > 0) {
        try {
          let fmt = 'JPEG';
          if (this.logoPreview.indexOf('image/png') > -1) fmt = 'PNG';
          if (this.logoPreview.indexOf('image/gif') > -1) fmt = 'GIF';
          doc.addImage(this.logoPreview, fmt, 15, 15, 35, 35);
          logoOK = true;
        } catch (e) {
          console.log('Logo error:', e);
        }
      }
      
      const xT = logoOK ? 55 : 15;
      const tit = this.nombreCliente || 'PRESUPUESTO';
      
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(tit.toUpperCase(), xT, 28);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Fecha: ' + fechaHoy, xT, 38);
      
      yPos = 58;
      doc.setDrawColor(30, 136, 229);
      doc.setLineWidth(2);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 15;
      
      if (this.itemsPresupuesto.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(30, 136, 229);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODUCTOS', 15, yPos);
        yPos += 5;
        
        const self = this;
        const datos = this.itemsPresupuesto.map(function(item) {
          let n = item.producto.replace(/\*\*/g, '');
          if (n.length > 50) n = n.substring(0, 50) + '...';
          return [
            n,
            item.marca,
            item.cantidad.toString(),
            '$ ' + parseFloat(item.netoUSD).toFixed(2),
            '$ ' + (parseFloat(item.netoUSD) * item.cantidad).toFixed(2)
          ];
        });
        
        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'Marca', 'Cant.', 'Unit.', 'Total']],
          body: datos,
          theme: 'grid',
          headStyles: {
            fillColor: [30, 136, 229],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: 4
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: [50, 50, 50]
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 28, halign: 'center' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 28, halign: 'right' },
            4: { cellWidth: 28, halign: 'right' }
          },
          alternateRowStyles: { fillColor: [240, 248, 255] },
          margin: { left: 15, right: 15 }
        });
        
        yPos = doc.lastAutoTable.finalY + 12;
      }
      
      if (this.itemsManoObra.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(56, 142, 60);
        doc.setFont('helvetica', 'bold');
        doc.text('MANO DE OBRA / SERVICIOS', 15, yPos);
        yPos += 5;
        
        const dMO = this.itemsManoObra.map(function(item) {
          return [
            item.descripcion,
            '$ ' + parseFloat(item.precioUSD).toFixed(2)
          ];
        });
        
        autoTable(doc, {
          startY: yPos,
          head: [['Descripcion', 'USD']],
          body: dMO,
          theme: 'grid',
          headStyles: {
            fillColor: [56, 142, 60],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            cellPadding: 4
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: [50, 50, 50]
          },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 32, halign: 'right' }
          },
          alternateRowStyles: { fillColor: [232, 245, 233] },
          margin: { left: 15, right: 15 }
        });
        
        yPos = doc.lastAutoTable.finalY + 12;
      }
      
      yPos += 5;
      const bX = pageWidth - 90;
      const bW = 75;
      const bH = 60;
      
      doc.setDrawColor(30, 136, 229);
      doc.setLineWidth(1);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(bX, yPos, bW, bH, 4, 4, 'FD');
      
      let tY = yPos + 12;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Subtotal USD:', bX + 5, tY);
      doc.text('$ ' + this.subtotalUSD, bX + bW - 5, tY, { align: 'right' });
      
      tY += 10;
      doc.text('IVA (' + this.ivaSeleccionado + '%):', bX + 5, tY);
      doc.text('$ ' + this.ivaUSD, bX + bW - 5, tY, { align: 'right' });
      
      tY += 8;
      doc.setDrawColor(30, 136, 229);
      doc.setLineWidth(0.5);
      doc.line(bX + 5, tY, bX + bW - 5, tY);
      
      tY += 10;
      doc.setFontSize(13);
      doc.setTextColor(30, 136, 229);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL USD:', bX + 5, tY);
      doc.text('$ ' + this.totalUSD, bX + bW - 5, tY, { align: 'right' });
      
      tY += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Total ARS:', bX + 5, tY);
      doc.text('$ ' + this.formatearNumero(this.totalARS), bX + bW - 5, tY, { align: 'right' });
      
      if (this.observaciones && this.observaciones.trim().length > 0) {
        yPos += bH + 15;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES:', 15, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const lin = doc.splitTextToSize(this.observaciones, pageWidth - 30);
        doc.text(lin, 15, yPos + 8);
      }
      
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Presupuesto valido por 7 dias - Precios sujetos a cambio',
        pageWidth / 2,
        285,
        { align: 'center' }
      );
      
      let arch = 'presupuesto_' + fechaHoy.replace(/\//g, '-') + '.pdf';
      if (this.nombreCliente && this.nombreCliente.length > 0) {
        arch = 'presupuesto_' + this.nombreCliente.replace(/\s+/g, '_') + '_' + fechaHoy.replace(/\//g, '-') + '.pdf';
      }
      doc.save(arch);
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
