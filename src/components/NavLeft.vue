<template>
    <div>
        <v-navigation-drawer app v-model="drawer" color="navLeft">
            <div class="ma-3">
                <v-text-field hide-details="auto" label="Buscar producto" solo dense append-icon="mdi-magnify"
                    v-model="producto" @click:append="buscarProducto()"
                    v-on:keyup.enter="buscarProducto()"></v-text-field>
            </div>
            <v-divider color="grey"></v-divider>
            <v-list dense nav class="mt-1 pa-0">
              <v-list-item
                v-for="(item, i) in filtrarCategorias($store.state.itemsCategorias)"
                :key="item.id"
                @click="buscarProductosPorCategoria(item.id)"
                :class="{ 'categoria-activa': $store.state.idCategoria === item.id }"
                class="categoria-item"
              >
                <v-list-item-icon class="mr-3 my-auto">
                  <v-icon color="white" size="20">
                    {{ getIcono(item.categoria) }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title 
                    class="white--text text-uppercase" 
                    style="font-size: 0.85rem;"
                  >
                    {{ item.categoria }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import bus from '../store/bus'

export default {

    name: "NavLeftComponent",

    data: () => ({
        drawer: true,
        itemsCategoriasTemp: [],
        itemsCategorias: [],
        producto: '',
        itemsSucursales: []
    }),

    created() {
        bus.$on('showNavLeft', () => this.showNavLeft());
    },

    methods: {

        // Mostrar / Ocultar menú lateral.
        showNavLeft() {
            this.drawer = !this.drawer;
        },

        // Obtener todas la categorias.
        async getCategorias() {
            const url = this.$store.state.urlService + "/categorias/conscategorias";
            const result = await (await fetch(url)).json();
            this.itemsCategoriasMenu = [];
            this.itemsCategorias = [];
            result.forEach(element => { this.itemsCategorias.push({ id: element.cianboxId, categoria: element.categoria }) });
            this.itemsCategoriasTemp = [];
            this.itemsCategoriasTemp.push({ id: 0, categoria: "TODAS" });
            this.itemsCategorias.forEach(element => { this.itemsCategoriasTemp.push({ id: element.id, categoria: element.categoria }) });
            this.itemsCategorias = this.itemsCategoriasTemp;
            this.$store.state.itemsCategorias = this.itemsCategorias;
        },

        // Excluye la categoría "TODAS" para el menú lateral.
        filtrarCategorias: function (items) {
            return items.filter(function (item) {
                return item.id != 0;
            })
        },

        // Buscar productos.
        buscarProducto() {
            this.$store.state.idCategoria = 0;
            this.mostrarProductos();
        },

        // Buscar porductos por catetoría.
        buscarProductosPorCategoria(id) {
            this.$store.state.idCategoria = id;
            this.mostrarProductos();
        },

        // Ir a la vista prodcutos.
        mostrarProductos() {
            this.$store.state.textSearch = this.producto.trim();
            this.$store.state.idMarca = 0;
            this.$store.state.idOrden = 2;
            this.producto = '';
            bus.$emit('mostrarProductos');
            this.goTo('/Productos');
        },

        goTo(ruta) {
            this.$router.push(ruta).catch(() => { });
        },

        // Obtener todas la categorias.
        async getSucursales() {
            const url = this.$store.state.urlService + "/sucursales/conssucursales";
            const result = await (await fetch(url)).json();
            this.itemsSucursales = [];
            result.forEach(element => { this.itemsSucursales.push({ id: element.id, sucursal: element.sucursal }) });
            this.itemsSucursales.push({ id: 0, sucursal: "TODAS" });
            this.$store.state.itemsSucursales = this.itemsSucursales;
        },

        getIcono(categoria) {
          const iconos = {
            'OFERTA': 'mdi-tag-multiple',
            'ACCESORIOS': 'mdi-puzzle',
            'ALARMAS': 'mdi-bell-ring',
            'ALMACENAMIENTO': 'mdi-harddisk',
            'BATERIAS Y PILAS': 'mdi-battery-high',
            'CABLES': 'mdi-cable-data',
            'CAMARAS ANALOGAS': 'mdi-camera',
            'CAMARAS IP': 'mdi-cctv',
            'CERCO ELECTRICO': 'mdi-flash-alert',
            'CONECTIVIDAD': 'mdi-wifi',
            'CONTROL DE ACCESO / ASISTENCIA': 'mdi-card-account-details',
            'FERRETERIA': 'mdi-tools',
            'FUENTES - UPS': 'mdi-power-plug',
            'GENERAL': 'mdi-package-variant',
            'GESTION & LICENCIAS': 'mdi-license',
            'GRABADORES': 'mdi-video-box',
            'INCENDIO': 'mdi-fire',
            'LICENCIAS': 'mdi-key',
            'OUTLET': 'mdi-sale',
            'PORTERIA': 'mdi-door',
            'SOLUCIONES': 'mdi-lightbulb'
          };
          return iconos[categoria.toUpperCase()] || 'mdi-folder';
        },
    },

    mounted() {
        this.getCategorias();
        this.getSucursales();
    },

}
</script>

<style scoped>
.categoria-item {
  min-height: 40px;
  border-radius: 4px;
  margin: 2px 8px;
  transition: all 0.2s ease;
}

.categoria-item:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.categoria-activa {
  background-color: rgba(33, 150, 243, 0.4) !important;
  border-left: 3px solid #2196F3;
}

.categoria-activa:hover {
  background-color: rgba(33, 150, 243, 0.5) !important;
}

.v-list-item__title {
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>