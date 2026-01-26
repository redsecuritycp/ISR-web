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
            Datos para el Presupuesto
          </v-card-title>

          <!-- Logo -->
          <div class="mb-4">
            <label class="subtitle-2">Logo de tu empresa</label>
            <p class="caption grey--text mb-1">
              Formato: PNG o JPG, ideal 200x200px
            </p>
            <div class="d-flex align-center mt-2">
              <v-avatar size="80" class="mr-4" color="grey lighten-3">
                <v-img 
                  v-if="logoPreview" 
                  :src="logoPreview"
                ></v-img>
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

          <!-- Nombre Cliente Final (editable) -->
          <v-text-field
            v-model="nombreClienteFinal"
            label="Nombre en el PDF (editable)"
            outlined
            dense
            prepend-inner-icon="mdi-account-box"
            placeholder="Se autocompleta o escribí manualmente"
            class="mb-3"
          ></v-text-field>

          <!-- Datos opcionales del emisor -->
          <v-text-field
            v-model="cuitEmisor"
            label="CUIT (opcional)"
            outlined
            dense
            prepend-inner-icon="mdi-card-account-details"
            placeholder="Ej: 30-12345678-9"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="domicilioEmisor"
            label="Domicilio (opcional)"
            outlined
            dense
            prepend-inner-icon="mdi-map-marker"
            placeholder="Ej: Av. Córdoba 1234"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="localidadEmisor"
            label="Localidad (opcional)"
            outlined
            dense
            prepend-inner-icon="mdi-city"
            placeholder="Ej: Rosario, Santa Fe"
            class="mb-3"
          ></v-text-field>

          <!-- Vendedor -->
          <v-select
            v-model="vendedorSeleccionado"
            :items="vendedores"
            label="Tu vendedor en IDSR"
            outlined
            dense
            prepend-inner-icon="mdi-account-tie"
            placeholder="Seleccioná tu vendedor"
            class="mb-3"
            clearable
          ></v-select>

          <v-text-field
            v-model.number="porcentajeGanancia"
            label="% Ganancia sobre productos"
            outlined
            dense
            type="number"
            min="0"
            max="100"
            prepend-inner-icon="mdi-percent-outline"
            hint="Se aplica solo en el PDF, no en pantalla"
            persistent-hint
            class="mb-3"
          ></v-text-field>

          <!-- IVA para Mano de Obra -->
          <v-select
            v-model="ivaSeleccionado"
            :items="opcionesIva"
            item-text="texto"
            item-value="valor"
            label="IVA para Mano de Obra"
            outlined
            dense
            prepend-inner-icon="mdi-percent"
            class="mt-3"
          ></v-select>

          <!-- Observaciones -->
          <v-textarea
            v-model="observaciones"
            label="Observaciones (opcional)"
            outlined
            dense
            rows="3"
            prepend-inner-icon="mdi-note-text"
            class="mt-3"
          ></v-textarea>
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
            <span>Usuario logueado:</span>
            <strong>{{ usuarioLogueado }}</strong>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>Cliente en PDF:</span>
            <strong>{{ nombreClienteFinal || '(sin definir)' }}</strong>
          </div>
          <v-divider class="my-2"></v-divider>
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
            <strong>$ {{ subtotalConGananciaUSD }}</strong>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>IVA:</span>
            <strong>$ {{ ivaConGananciaUSD }}</strong>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between mb-2">
            <span>Total USD:</span>
            <strong class="green--text text-h6">
              $ {{ totalConGananciaUSD }}
            </strong>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <span>Total ARS:</span>
            <strong class="blue--text text-h6">
              $ {{ totalConGananciaARS }}
            </strong>
          </div>
          <v-btn 
            block 
            color="success" 
            :disabled="itemsPresupuesto.length === 0"
            :loading="generandoPDF"
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

        <!-- Mano de obra -->
        <v-card class="pa-4">
          <v-card-title class="pa-0 mb-3">
            <v-icon left>mdi-wrench</v-icon>
            Mano de Obra / Servicios
          </v-card-title>
          <v-row dense>
            <v-col cols="8">
              <v-text-field
                v-model="nuevaManoObra.descripcion"
                label="Descripción"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="nuevaManoObra.precioUSD"
                label="USD"
                outlined
                dense
                type="number"
                prefix="$"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn 
            small 
            color="primary" 
            @click="agregarManoObra"
            :disabled="!nuevaManoObra.descripcion"
          >
            <v-icon left small>mdi-plus</v-icon>
            Agregar
          </v-btn>
          <v-list dense v-if="itemsManoObra.length > 0" class="mt-3">
            <v-list-item 
              v-for="(item, idx) in itemsManoObra" 
              :key="idx"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.descripcion }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <div class="d-flex align-center">
                  <span class="mr-3">$ {{ item.precioUSD }}</span>
                  <v-btn 
                    icon 
                    x-small 
                    color="error"
                    @click="eliminarManoObra(idx)"
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
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
          </v-card-text>

          <v-simple-table v-else>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Marca</th>
                  <th class="text-center">Cant.</th>
                  <th class="text-center">IVA</th>
                  <th class="text-right">USD Unit.</th>
                  <th class="text-right">USD Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsPresupuesto" :key="item.id">
                  <td>{{ item.producto }}</td>
                  <td>{{ item.marca }}</td>
                  <td class="text-center" style="width: 100px;">
                    <v-text-field
                      v-model.number="item.cantidad"
                      type="number"
                      min="1"
                      dense
                      hide-details
                      outlined
                      class="centered-input"
                      style="max-width: 70px; margin: 0 auto;"
                      @change="actualizarCantidad(item)"
                    ></v-text-field>
                  </td>
                  <td class="text-center">
                    <v-chip 
                      x-small 
                      :color="item.ivaPercent === 10.5 
                        ? 'orange' : 'grey'"
                      dark
                    >
                      {{ item.ivaPercent || 21 }}%
                    </v-chip>
                  </td>
                  <td class="text-right">
                    $ {{ parseFloat(item.netoUSD).toFixed(2) }}
                  </td>
                  <td class="text-right">
                    $ {{ calcularTotalItem(item, 'USD') }}
                  </td>
                  <td class="text-right">
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ColorThief from 'colorthief';

export default {
  name: 'PresupuestadorView',

  data() {
    return {
      logoPreview: '',
      nombreClienteFinal: localStorage.getItem('nombreClienteFinal') || '',
      ivaSeleccionado: 21,
      opcionesIva: [
        { texto: '21%', valor: 21 },
        { texto: '10.5%', valor: 10.5 },
        { texto: 'Exento (0%)', valor: 0 }
      ],
      observaciones: localStorage.getItem('observacionesPresupuesto') || '',
      itemsManoObra: JSON.parse(localStorage.getItem('itemsManoObra') || '[]'),
      nuevaManoObra: {
        descripcion: '',
        precioUSD: ''
      },
      generandoPDF: false,
      colorPrimario: [30, 30, 30],
      colorSecundario: [212, 175, 55],
      // Mapa de IVAs por código
      mapaIvas: {},
      loadingIvas: false,
      // Datos opcionales del emisor (para el PDF)
      cuitEmisor: localStorage.getItem('cuitEmisor') || '',
      domicilioEmisor: localStorage.getItem('domicilioEmisor') || '',
      localidadEmisor: localStorage.getItem('localidadEmisor') || '',
      // Vendedor
      vendedores: [],
      vendedorSeleccionado: localStorage.getItem('vendedorSeleccionado') || '',
      porcentajeGanancia: parseFloat(
        localStorage.getItem('porcentajeGanancia')
      ) || 0
    }
  },

  computed: {
    usuarioLogueado() {
      return this.$store.state.usuario || '';
    },
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
          return sum + parseFloat(item.precioUSD || 0);
        }, 0);
    },
    subtotalUSD() {
      return (this.subtotalProductosUSD + this.subtotalManoObraUSD)
        .toFixed(2);
    },
    // IVA calculado sumando el IVA individual de cada producto
    ivaProductosUSD() {
      return this.itemsPresupuesto.reduce((sum, item) => {
        const ivaPercent = item.ivaPercent || 21;
        const subtotalItem = parseFloat(item.netoUSD) * item.cantidad;
        return sum + (subtotalItem * ivaPercent / 100);
      }, 0);
    },
    ivaManoObraUSD() {
      // Mano de obra usa el IVA seleccionado manualmente
      return this.subtotalManoObraUSD * this.ivaSeleccionado / 100;
    },
    ivaUSD() {
      return (this.ivaProductosUSD + this.ivaManoObraUSD).toFixed(2);
    },
    totalUSD() {
      return (parseFloat(this.subtotalUSD) + parseFloat(this.ivaUSD))
        .toFixed(2);
    },
    totalARS() {
      const cotizacion = 1460;
      return (parseFloat(this.totalUSD) * cotizacion)
        .toLocaleString('es-AR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
    },
    factorGanancia() {
      return 1 + (this.porcentajeGanancia / 100);
    },
    subtotalConGananciaUSD() {
      const subtotalProductos = this.subtotalProductosUSD * 
        this.factorGanancia;
      return (subtotalProductos + this.subtotalManoObraUSD).toFixed(2);
    },
    ivaConGananciaUSD() {
      const ivaProductos = this.itemsPresupuesto.reduce((sum, item) => {
        const ivaPercent = item.ivaPercent || 21;
        const subtotalItem = parseFloat(item.netoUSD) * 
          item.cantidad * this.factorGanancia;
        return sum + (subtotalItem * ivaPercent / 100);
      }, 0);
      return (ivaProductos + this.ivaManoObraUSD).toFixed(2);
    },
    totalConGananciaUSD() {
      return (parseFloat(this.subtotalConGananciaUSD) + 
        parseFloat(this.ivaConGananciaUSD)).toFixed(2);
    },
    totalConGananciaARS() {
      const cotizacion = 1460;
      return (parseFloat(this.totalConGananciaUSD) * cotizacion)
        .toLocaleString('es-AR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
    }
  },

  async mounted() {
    await this.cargarDatosCliente();
    await this.cargarMapaIvas();
    await this.cargarVendedores();
  },

  methods: {
    async cargarDatosCliente() {
      const usuarioId = this.$store.state.usuarioId;
      if (!usuarioId || usuarioId === 0) return;

      try {
        const response = await fetch(`/api/cliente/${usuarioId}`);
        const data = await response.json();
        if (data.logo) {
          this.logoPreview = data.logo;
          this.$nextTick(() => {
            this.extraerColoresLogo();
          });
        }
      } catch (error) {
        console.error('Error cargando datos cliente:', error);
      }
    },


    async cargarMapaIvas() {
      this.loadingIvas = true;
      try {
        const response = await fetch('/api/cianbox/productos-iva');
        const data = await response.json();
        if (data.success && data.productos) {
          // Crear mapa codigo -> ivaPercent
          this.mapaIvas = {};
          data.productos.forEach(p => {
            this.mapaIvas[p.codigo] = p.ivaPercent;
          });
          // Actualizar items existentes en el presupuesto
          this.actualizarIvasPresupuesto();
        }
      } catch (error) {
        console.error('Error cargando mapa IVAs:', error);
      }
      this.loadingIvas = false;
    },

    async cargarVendedores() {
      try {
        const response = await fetch('/api/cianbox/clientes-vendedor');
        const data = await response.json();
        if (data.success && data.resumenVendedores) {
          this.vendedores = data.resumenVendedores
            .filter(v => v.vendedor !== 'Sin asignar')
            .map(v => v.vendedor);
        }
      } catch (error) {
        console.error('Error cargando vendedores:', error);
      }
    },

    actualizarIvasPresupuesto() {
      // Actualizar el IVA de cada producto en el presupuesto
      this.itemsPresupuesto.forEach(item => {
        if (!item.ivaPercent && item.codigoInterno) {
          const iva = this.mapaIvas[item.codigoInterno];
          if (iva !== undefined) {
            this.$store.commit('updateIvaPresupuesto', {
              id: item.id,
              ivaPercent: iva
            });
          }
        }
      });
    },

    onLogoSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        this.logoPreview = e.target.result;
        await this.guardarLogo(e.target.result);
        this.extraerColoresLogo();
      };
      reader.readAsDataURL(file);
    },

    extraerColoresLogo() {
      if (!this.logoPreview) return;
      
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = this.logoPreview;
      
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 5);
          
          if (palette && palette.length >= 2) {
            let primario = palette[0];
            let secundario = palette[1];
            
            // Si el primario es muy claro, usar el siguiente
            const lum = (0.299*primario[0] + 0.587*primario[1] + 0.114*primario[2]) / 255;
            if (lum > 0.7 && palette[1]) {
              primario = palette[1];
              secundario = palette[2] || [212, 175, 55];
            }
            
            this.colorPrimario = primario;
            this.colorSecundario = secundario;
          }
        } catch (err) {
          console.log('ColorThief error:', err);
        }
      };
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

    

    agregarManoObra() {
      if (!this.nuevaManoObra.descripcion) return;

      this.itemsManoObra.push({
        descripcion: this.nuevaManoObra.descripcion,
        precioUSD: parseFloat(this.nuevaManoObra.precioUSD) || 0
      });
      localStorage.setItem('itemsManoObra', JSON.stringify(this.itemsManoObra));

      this.nuevaManoObra = { descripcion: '', precioUSD: '' };
    },

    eliminarManoObra(idx) {
      this.itemsManoObra.splice(idx, 1);
      localStorage.setItem('itemsManoObra', JSON.stringify(this.itemsManoObra));
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
        this.itemsManoObra = [];
        localStorage.removeItem('itemsManoObra');
      }
    },

    calcularTotalItem(item, moneda) {
      const precio = moneda === 'USD' 
        ? parseFloat(item.netoUSD) 
        : parseFloat(item.netoARS);
      return (precio * item.cantidad).toFixed(2);
    },

    generarPDF() {
      this.generandoPDF = true;

      try {
        const doc = new jsPDF();
        const fechaHoy = new Date().toLocaleDateString('es-AR');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Colores del logo o default negro/dorado
        const negro = this.colorPrimario;
        const dorado = this.colorSecundario;

        // === HEADER NEGRO ===
        doc.setFillColor(negro[0], negro[1], negro[2]);
        doc.rect(0, 0, pageWidth, 55, 'F');

        // Logo del cliente
        let xTexto = 20;
        if (this.logoPreview && this.logoPreview.length > 50) {
          try {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(12, 8, 38, 38, 3, 3, 'F');
            doc.addImage(this.logoPreview, 'JPEG', 14, 10, 34, 34);
            xTexto = 58;
          } catch (e1) {
            try {
              doc.addImage(this.logoPreview, 'PNG', 14, 10, 34, 34);
              xTexto = 58;
            } catch (e2) {
              console.error('Error logo:', e2);
              xTexto = 20;
            }
          }
        }

        // Nombre del cliente final (grande)
        const nombrePDF = this.nombreClienteFinal || 'PRESUPUESTO';
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(nombrePDF.toUpperCase(), pageWidth / 2, 28, 
          { align: 'center' });

        // Línea dorada decorativa
        doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
        doc.setLineWidth(2);
        doc.line(pageWidth / 2 - 35, 34, pageWidth / 2 + 35, 34);

        // Cuadro de fecha
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 45, 12, 35, 30, 2, 2, 'F');
        doc.setTextColor(negro[0], negro[1], negro[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('FECHA', pageWidth - 27.5, 22, { align: 'center' });
        doc.setFontSize(11);
        doc.text(fechaHoy, pageWidth - 27.5, 35, { align: 'center' });

        let yPos = 70;

        // Datos opcionales del emisor
        const tieneDataEmisor = this.cuitEmisor || 
          this.domicilioEmisor || this.localidadEmisor;
        if (tieneDataEmisor) {
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          
          if (this.cuitEmisor) {
            doc.text(`CUIT: ${this.cuitEmisor}`, 15, yPos);
            yPos += 5;
          }
          if (this.domicilioEmisor) {
            doc.text(`Domicilio: ${this.domicilioEmisor}`, 15, yPos);
            yPos += 5;
          }
          if (this.localidadEmisor) {
            doc.text(`Localidad: ${this.localidadEmisor}`, 15, yPos);
            yPos += 5;
          }
          yPos += 5;
        }

        // === TABLA DE PRODUCTOS ===
        if (this.itemsPresupuesto.length > 0) {
          // Título con subrayado dorado
          doc.setTextColor(negro[0], negro[1], negro[2]);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('DETALLE DE PRODUCTOS', 15, yPos);
          doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
          doc.setLineWidth(1);
          doc.line(15, yPos + 2, 78, yPos + 2);
          yPos += 10;

          const productosData = this.itemsPresupuesto.map(item => {
            let nombre = item.producto.replace(/\*\*/g, '');
            if (nombre.length > 40) {
              nombre = nombre.substring(0, 40) + '...';
            }
            const precioUnitario = parseFloat(item.netoUSD) * this.factorGanancia;
            const totalItem = precioUnitario * item.cantidad;
            return [
              nombre,
              item.marca,
              item.cantidad.toString(),
              `$ ${precioUnitario.toFixed(2)}`,
              `$ ${totalItem.toFixed(2)}`
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: [['Producto', 'Marca', 'Cant.', 'Unitario', 'Total']],
            body: productosData,
            theme: 'plain',
            headStyles: { 
              fillColor: [245, 245, 245],
              textColor: negro,
              fontStyle: 'bold',
              fontSize: 9,
              cellPadding: 5
            },
            bodyStyles: { 
              fontSize: 9,
              cellPadding: 5
            },
            columnStyles: {
              0: { cellWidth: 65 },
              1: { cellWidth: 30 },
              2: { cellWidth: 18, halign: 'center' },
              3: { cellWidth: 28, halign: 'right' },
              4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
            },
            alternateRowStyles: { fillColor: [252, 252, 252] }
          });

          yPos = doc.lastAutoTable.finalY + 15;
        }

        // === TABLA DE MANO DE OBRA ===
        if (this.itemsManoObra.length > 0) {
          doc.setTextColor(negro[0], negro[1], negro[2]);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('SERVICIOS ADICIONALES', 15, yPos);
          doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
          doc.setLineWidth(1);
          doc.line(15, yPos + 2, 73, yPos + 2);
          yPos += 10;

          const manoObraData = this.itemsManoObra.map(item => [
            item.descripcion,
            `$ ${parseFloat(item.precioUSD).toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [['Descripción', 'Precio USD']],
            body: manoObraData,
            theme: 'plain',
            headStyles: { 
              fillColor: [245, 245, 245],
              textColor: negro,
              fontStyle: 'bold',
              fontSize: 9,
              cellPadding: 5
            },
            bodyStyles: { 
              fontSize: 9,
              cellPadding: 5
            },
            columnStyles: {
              0: { cellWidth: 120 },
              1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
            }
          });

          yPos = doc.lastAutoTable.finalY + 15;
        }

        // === OBSERVACIONES ===
        if (this.observaciones && this.observaciones.trim()) {
          doc.setTextColor(dorado[0], dorado[1], dorado[2]);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('OBSERVACIONES', 15, yPos);
          yPos += 6;

          doc.setTextColor(60, 60, 60);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const lineas = doc.splitTextToSize(this.observaciones, 120);
          doc.text(lineas, 15, yPos);
          yPos += (lineas.length * 5) + 10;
        }

        // === CUADRO DE TOTALES ===
        const totalesY = Math.max(yPos + 5, 185);
        const totalesX = pageWidth - 80;
        const totalesW = 65;

        // Fondo negro
        doc.setFillColor(negro[0], negro[1], negro[2]);
        doc.roundedRect(totalesX, totalesY, totalesW, 58, 3, 3, 'F');

        // Subtotal
        doc.setTextColor(180, 180, 180);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', totalesX + 5, totalesY + 12);
        doc.setTextColor(255, 255, 255);
        doc.text(`$ ${this.subtotalConGananciaUSD}`, totalesX + totalesW - 5, 
          totalesY + 12, { align: 'right' });

        // IVA
        doc.setTextColor(180, 180, 180);
        doc.text(`IVA ${this.ivaSeleccionado}%:`, totalesX + 5, totalesY + 22);
        doc.setTextColor(255, 255, 255);
        doc.text(`$ ${this.ivaConGananciaUSD}`, totalesX + totalesW - 5, 
          totalesY + 22, { align: 'right' });

        // Línea dorada
        doc.setDrawColor(dorado[0], dorado[1], dorado[2]);
        doc.setLineWidth(1);
        doc.line(totalesX + 5, totalesY + 28, 
          totalesX + totalesW - 5, totalesY + 28);

        // TOTAL USD
        doc.setTextColor(dorado[0], dorado[1], dorado[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL USD', totalesX + 5, totalesY + 40);
        doc.setFontSize(16);
        doc.text(`$ ${this.totalConGananciaUSD}`, totalesX + totalesW - 5, 
          totalesY + 40, { align: 'right' });

        // ARS
        doc.setTextColor(160, 160, 160);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`ARS $ ${this.totalConGananciaARS}`, totalesX + totalesW - 5, 
          totalesY + 52, { align: 'right' });

        // === FOOTER NEGRO ===
        doc.setFillColor(negro[0], negro[1], negro[2]);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

        doc.setTextColor(160, 160, 160);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          'Presupuesto válido por 7 días | ' +
          'Precios sujetos a modificación sin previo aviso',
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );

        // === NOMBRE ARCHIVO ===
        let nombreArchivo = `presupuesto_${fechaHoy.replace(/\//g, '-')}.pdf`;
        if (this.nombreClienteFinal) {
          const nombreLimpio = this.nombreClienteFinal
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase();
          nombreArchivo = `presupuesto_${nombreLimpio}_` +
            `${fechaHoy.replace(/\//g, '-')}.pdf`;
        }

        // === DESCARGAR PDF (con ganancia para cliente) ===
        doc.save(nombreArchivo);
        this.$alertify.success('PDF generado correctamente');

        // === GENERAR PDF PARA VENDEDOR (sin ganancia) ===
        const docVendedor = new jsPDF();
        const pageWidthV = docVendedor.internal.pageSize.getWidth();
        const pageHeightV = docVendedor.internal.pageSize.getHeight();

        // Header negro
        docVendedor.setFillColor(negro[0], negro[1], negro[2]);
        docVendedor.rect(0, 0, pageWidthV, 55, 'F');

        let xTextoV = 20;
        if (this.logoPreview && this.logoPreview.length > 50) {
          try {
            docVendedor.setFillColor(255, 255, 255);
            docVendedor.roundedRect(12, 8, 38, 38, 3, 3, 'F');
            docVendedor.addImage(
              this.logoPreview, 'JPEG', 14, 10, 34, 34
            );
            xTextoV = 58;
          } catch (e) {
            xTextoV = 20;
          }
        }

        docVendedor.setTextColor(255, 255, 255);
        docVendedor.setFontSize(24);
        docVendedor.setFont('helvetica', 'bold');
        docVendedor.text(nombrePDF.toUpperCase(), pageWidthV / 2, 28, 
          { align: 'center' });

        docVendedor.setDrawColor(dorado[0], dorado[1], dorado[2]);
        docVendedor.setLineWidth(2);
        docVendedor.line(pageWidthV / 2 - 35, 34, pageWidthV / 2 + 35, 34);

        docVendedor.setFillColor(255, 255, 255);
        docVendedor.roundedRect(pageWidthV - 45, 12, 35, 30, 2, 2, 'F');
        docVendedor.setTextColor(negro[0], negro[1], negro[2]);
        docVendedor.setFontSize(8);
        docVendedor.setFont('helvetica', 'bold');
        docVendedor.text('FECHA', pageWidthV - 27.5, 22, { align: 'center' });
        docVendedor.setFontSize(11);
        docVendedor.text(fechaHoy, pageWidthV - 27.5, 35, { align: 'center' });

        let yPosV = 70;

        // Datos emisor
        if (tieneDataEmisor) {
          docVendedor.setTextColor(80, 80, 80);
          docVendedor.setFontSize(9);
          docVendedor.setFont('helvetica', 'normal');
          if (this.cuitEmisor) {
            docVendedor.text(`CUIT: ${this.cuitEmisor}`, 15, yPosV);
            yPosV += 5;
          }
          if (this.domicilioEmisor) {
            docVendedor.text(`Domicilio: ${this.domicilioEmisor}`, 15, yPosV);
            yPosV += 5;
          }
          if (this.localidadEmisor) {
            docVendedor.text(`Localidad: ${this.localidadEmisor}`, 15, yPosV);
            yPosV += 5;
          }
          yPosV += 5;
        }

        // Tabla productos SIN ganancia
        if (this.itemsPresupuesto.length > 0) {
          docVendedor.setTextColor(negro[0], negro[1], negro[2]);
          docVendedor.setFontSize(12);
          docVendedor.setFont('helvetica', 'bold');
          docVendedor.text('DETALLE DE PRODUCTOS', 15, yPosV);
          docVendedor.setDrawColor(dorado[0], dorado[1], dorado[2]);
          docVendedor.setLineWidth(1);
          docVendedor.line(15, yPosV + 2, 78, yPosV + 2);
          yPosV += 10;

          const productosDataV = this.itemsPresupuesto.map(item => {
            let nombre = item.producto.replace(/\*\*/g, '');
            if (nombre.length > 40) {
              nombre = nombre.substring(0, 40) + '...';
            }
            // Precio SIN ganancia
            const precioNeto = parseFloat(item.netoUSD);
            const totalNeto = precioNeto * item.cantidad;
            return [
              nombre,
              item.marca,
              item.cantidad.toString(),
              `$ ${precioNeto.toFixed(2)}`,
              `$ ${totalNeto.toFixed(2)}`
            ];
          });

          autoTable(docVendedor, {
            startY: yPosV,
            head: [['Producto', 'Marca', 'Cant.', 'Unitario', 'Total']],
            body: productosDataV,
            theme: 'plain',
            headStyles: { 
              fillColor: [245, 245, 245],
              textColor: negro,
              fontStyle: 'bold',
              fontSize: 9,
              cellPadding: 5
            },
            bodyStyles: { fontSize: 9, cellPadding: 5 },
            columnStyles: {
              0: { cellWidth: 65 },
              1: { cellWidth: 30 },
              2: { cellWidth: 18, halign: 'center' },
              3: { cellWidth: 28, halign: 'right' },
              4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
            },
            alternateRowStyles: { fillColor: [252, 252, 252] }
          });

          yPosV = docVendedor.lastAutoTable.finalY + 15;
        }

        // Cuadro totales SIN ganancia (solo productos)
        const totalesYV = Math.max(yPosV + 5, 185);
        const totalesXV = pageWidthV - 80;
        const totalesWV = 65;

        docVendedor.setFillColor(negro[0], negro[1], negro[2]);
        docVendedor.roundedRect(
          totalesXV, totalesYV, totalesWV, 58, 3, 3, 'F'
        );

        docVendedor.setTextColor(180, 180, 180);
        docVendedor.setFontSize(9);
        docVendedor.setFont('helvetica', 'normal');
        docVendedor.text('Subtotal:', totalesXV + 5, totalesYV + 12);
        docVendedor.setTextColor(255, 255, 255);
        docVendedor.text(
          `$ ${this.subtotalProductosUSD.toFixed(2)}`, 
          totalesXV + totalesWV - 5, 
          totalesYV + 12, 
          { align: 'right' }
        );

        docVendedor.setTextColor(180, 180, 180);
        docVendedor.text('IVA:', totalesXV + 5, totalesYV + 22);
        docVendedor.setTextColor(255, 255, 255);
        docVendedor.text(
          `$ ${this.ivaProductosUSD.toFixed(2)}`, 
          totalesXV + totalesWV - 5, 
          totalesYV + 22, 
          { align: 'right' }
        );

        docVendedor.setDrawColor(dorado[0], dorado[1], dorado[2]);
        docVendedor.setLineWidth(1);
        docVendedor.line(
          totalesXV + 5, totalesYV + 28, 
          totalesXV + totalesWV - 5, totalesYV + 28
        );

        const totalProductosUSD = (
          this.subtotalProductosUSD + this.ivaProductosUSD
        ).toFixed(2);
        const totalProductosARS = (
          parseFloat(totalProductosUSD) * 1460
        ).toLocaleString('es-AR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });

        docVendedor.setTextColor(dorado[0], dorado[1], dorado[2]);
        docVendedor.setFontSize(10);
        docVendedor.setFont('helvetica', 'bold');
        docVendedor.text('TOTAL USD', totalesXV + 5, totalesYV + 40);
        docVendedor.setFontSize(16);
        docVendedor.text(
          `$ ${totalProductosUSD}`, 
          totalesXV + totalesWV - 5, 
          totalesYV + 40, 
          { align: 'right' }
        );

        docVendedor.setTextColor(160, 160, 160);
        docVendedor.setFontSize(9);
        docVendedor.setFont('helvetica', 'normal');
        docVendedor.text(
          `ARS $ ${totalProductosARS}`, 
          totalesXV + totalesWV - 5, 
          totalesYV + 52, 
          { align: 'right' }
        );

        // Footer
        docVendedor.setFillColor(negro[0], negro[1], negro[2]);
        docVendedor.rect(0, pageHeightV - 15, pageWidthV, 15, 'F');
        docVendedor.setTextColor(160, 160, 160);
        docVendedor.setFontSize(8);
        docVendedor.setFont('helvetica', 'normal');
        docVendedor.text(
          'PDF para uso interno - Precios sin margen',
          pageWidthV / 2,
          pageHeightV - 6,
          { align: 'center' }
        );

        // === ENVIAR EMAIL CON PDF SIN GANANCIA ===
        const pdfBase64 = docVendedor.output('datauristring').split(',')[1];
        fetch('/api/enviar-presupuesto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64,
            nombreCliente: this.usuarioLogueado,
            clienteFinal: this.nombreClienteFinal,
            totalUSD: this.totalUSD,
            totalARS: this.totalARS,
            emailDestino: 'pansapablo@gmail.com'
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Respuesta email:', data);
          if (data.success) {
            this.$alertify.success('Email enviado al vendedor');
          } else {
            this.$alertify.error('Email no enviado: ' + 
              (data.error || 'error desconocido'));
          }
        })
        .catch(err => {
          console.error('Error enviando email:', err);
          this.$alertify.error('Error enviando email');
        });

      } catch (error) {
        console.error('Error generando PDF:', error);
        this.$alertify.error('Error al generar el PDF: ' + error.message);
      } finally {
        this.generandoPDF = false;
      }
    }
  },

  watch: {
    nombreClienteFinal(val) {
      localStorage.setItem('nombreClienteFinal', val || '');
    },
    observaciones(val) {
      localStorage.setItem('observacionesPresupuesto', val || '');
    },
    itemsManoObra: {
      handler(val) {
        localStorage.setItem('itemsManoObra', JSON.stringify(val));
      },
      deep: true
    },
    vendedorSeleccionado(val) {
      localStorage.setItem('vendedorSeleccionado', val || '');
    },
    cuitEmisor(val) {
      localStorage.setItem('cuitEmisor', val || '');
    },
    domicilioEmisor(val) {
      localStorage.setItem('domicilioEmisor', val || '');
    },
    localidadEmisor(val) {
      localStorage.setItem('localidadEmisor', val || '');
    },
    porcentajeGanancia(val) {
      localStorage.setItem('porcentajeGanancia', val || 0);
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>