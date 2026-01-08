<template>
    <div>
        <v-navigation-drawer app v-model="drawer" color="navLeft">
            <div class="ma-3">
                <v-text-field hide-details="auto" label="Buscar producto" solo dense append-icon="mdi-magnify"
                    v-model="producto" @click:append="buscarProducto()"
                    v-on:keyup.enter="buscarProducto()"></v-text-field>
            </div>
            <v-divider color="grey"></v-divider>
            <ul class="menu  mt-1">
                <li v-for="(item, i) in filtrarCategorias(this.$store.state.itemsCategorias)" :key="item.id"
                    @click="buscarProductosPorCategoria(item.id)">
                    <a href="#">{{ item.categoria }} </a>
                </li>
            </ul>
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
    },

    mounted() {
        this.getCategorias();
        this.getSucursales();
    },

}
</script>