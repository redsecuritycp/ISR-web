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
      // Por ahora solo un alert, después implementamos jsPDF
      alert('Generando PDF... (próximo paso)');
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
