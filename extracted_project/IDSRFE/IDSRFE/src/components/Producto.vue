<template>

    <v-container grid-list-md>

        <!-- Mensaje de cargando... -->
        <Loading :show="overlay" />

        <!-- Filtrar productos -->
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="font-weight-medium">Filtrar productos</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row justify="space-around" dense>
                        <v-col cols="12" md="3" class="py-0 my-0">
                            <b-form-group id="fieldset-1" label="Buscar" label-for="Buscar">
                                <input v-model="searchData" class="text" v-on:keyup.enter="buscarProductos"
                                    style="width: 100%; font-size:small; height: 28px;">
                            </b-form-group>
                        </v-col>
                        <v-col cols="12" md="3" class="py-0 my-0">
                            <b-form-group id="fieldset-1" label="Categoría" label-for="Categoria">
                                <select v-model="selectedCategoria" class="select-css"
                                    style="height: 28px; font-size: small;">
                                    <option v-for="option in this.$store.state.itemsCategorias"
                                        v-bind:value="option.id">
                                        {{ option.categoria }}
                                    </option>
                                </select>
                            </b-form-group>
                        </v-col>
                        <v-col cols="12" md="3" class="py-0 my-0">
                            <b-form-group id="fieldset-1" label="Marca" label-for="Marca">
                                <select v-model="selectedMarca" class="select-css">
                                    <option v-for="option in this.$store.state.itemsMarcas" v-bind:value="option.id">
                                        {{ option.marca }}
                                    </option>
                                </select>
                            </b-form-group>
                        </v-col>
                        <v-col cols="12" md="3" class="py-0 my-0">
                            <b-form-group id="fieldset-1" label="Ordenar por" label-for="Orden">
                                <select v-model="selectedOrder" class="select-css">
                                    <option v-for="option in orderOptions" v-bind:value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </b-form-group>
                        </v-col>
                    </v-row>

                    <v-row justify="space-around" dense>

                        <v-col cols="12" md="3">
                            <b-form-group id="fieldset-1" label="Sucursal" label-for="Sucursal">
                                <select v-model="selectedSucursal" class="select-css">
                                    <option v-for="option in this.$store.state.itemsSucursales"
                                        v-bind:value="option.id">
                                        {{ option.sucursal }}
                                    </option>
                                </select>
                            </b-form-group>
                        </v-col>

                        <v-col cols="12" md="3" class="d-flex align-center">
                            <v-checkbox v-model="chkVerSoloOfertas" label="Ver únicamente ofertas" hide-details dense
                                class="mt-4"></v-checkbox>
                        </v-col>

                        <v-col cols="12" md="6" class="d-flex align-center justify-end" style="padding-top: 25px;">
                            <v-btn color="primary" dark @click="buscarProductos">
                                Buscar
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <!-- Listado de productos -->
        <v-layout row wrap class="mt-1">

            <v-flex xs12 sm3 v-for="(item, index) in this.$store.state.itemsProductos" :key="index">

                <v-card class="mx-auto" max-width="600" height="420" outlined>
                    <v-hover v-slot="{ hover }">
                        <v-img :src=item.imagen cover :aspect-ratio="16 / 9">

                            <div v-if="item.oferta && $store.state.usuario !== ''"
                                class="white--text text-body-2 px-1 py-1"
                                style="position: absolute; top: 0; left: 0; background-color: rgba(255, 0, 0, 0.7); z-index: 1; border-bottom-right-radius: 8px;">
                                <strong>OFERTA</strong> U$D {{ item.precioOfertaUSD }} / ARS {{ item.precioOfertaARS }}
                            </div>
                            <!-- Cartel DISPONIBLE o CONSULTAR -->
                            <div :class="item.disponible > 0 ? '#155724' : '#721C24'" class="text-body-2 px-2 py-1"
                                :style="{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    backgroundColor: item.disponible > 0 ? '#D4EDDA' : '#F7D6D9',
                                    zIndex: 1,
                                    borderTopLeftRadius: '8px'
                                }">
                                <strong>{{ item.disponible > 0 ? 'Disponible' : 'Consultar' }}</strong>
                            </div>

                            <v-expand-transition>
                                <div v-if="hover && item.descripcion.length > 0"
                                    class="d-flex transition-fast-in-fast-out v-card--reveal" :style="{
                                        height: '100%',
                                        backgroundColor: '#FFF3CD',
                                        color: '#826204',
                                        fontSize: 'small'
                                    }">

                                    <div :class="['mx-2', 'my-1', item.oferta ? 'mt-7' : '']">
                                        {{ item.descripcion }}
                                    </div>

                                </div>
                            </v-expand-transition>

                        </v-img>
                    </v-hover>

                    <v-divider></v-divider>

                    <v-card-text class="pt-2" style="position: relative;">

                        <h5 class="blue--text text--darken-2">{{ item.producto }}</h5>

                        <h5>Cód.: {{ item.codigoInterno }}</h5>

                        <h5>Marca: {{ item.marca }}</h5>

                        <h5>Cat.: {{ item.categoria }}</h5>

                        <div v-if="$store.state.usuario != ''">
                            <h5>U$D: {{ item.precioUSD | UnsignedCurrency }} Final</h5>
                            <h5>ARS: {{ item.precioARS | UnsignedCurrency }} Final</h5>
                        </div>

                    </v-card-text>

                </v-card>

            </v-flex>

        </v-layout>

        <!-- Mensaje de producto no encontrado -->
        <v-alert v-model="showNoProducts" border="top" color="red lighten-2" dark class="mt-4 text-center">
            Lo lamentamos, no hay productos para esta selección.
        </v-alert>

    </v-container>
</template>

<script>

import bus from '../store/bus'
import Loading from './Loading.vue';
import { mapActions } from 'vuex'

export default {
    name: 'ProductoComponent',
    data: () => ({
        overlay: true,
        showNoProducts: false,
        orderOptions: [
            { text: "Categoría", value: 1 },
            { text: "Nombre", value: 2 },
            { text: "Precio menor", value: 3 },
            { text: "Precio mayor", value: 4 }
        ],
        searchData: '',
        selectedOrder: 3,
        selectedCategoria: 0,
        selectedMarca: 0,
        itemsProductos: [],
        itemsMarcas: [],
        selectedSucursal: 0,
        chkVerSoloOfertas: false
    }),

    created() {
        this.searchData = this.$store.state.textSearch;
        this.selectedCategoria = this.$store.state.idCategoria;
        this.selectedMarca = this.$store.state.idMarca;
        this.selectedOrder = this.$store.state.idOrden;
        this.selectedSucursal = this.$store.state.idSucursal;
        // Bus de evento que permite ser llamado desde otro componente.
        bus.$on('mostrarProductos', () => this.mostrarProductos());
        this.buscarProductos();
    },

    methods: {

        ...mapActions(['mensajear']),

        mostrarProductos() {
            this.searchData = this.$store.state.textSearch;
            this.selectedCategoria = this.$store.state.idCategoria;
            this.selectedMarca = this.$store.state.idMarca;
            this.selectedOrder = this.$store.state.idOrden;
            this.selectedSucursal = this.$store.state.idSucursal;
            this.buscarProductos();
        },

        async buscarProductos() {
            this.overlay = true;
            // Productos.
            const url = this.$store.state.urlService + "/Productos/ConsProductos?Producto=" + this.searchData.trim() +
                "&CategoriaId=" + this.selectedCategoria + "&MarcaId=" + this.selectedMarca + "&OrdenId=" + this.selectedOrder + "&SucursalId=" + this.selectedSucursal + "&Oferta=" + this.chkVerSoloOfertas;
            const resultado = await (await fetch(url)).json();
            this.itemsProductos = [];
            resultado.producto.forEach(element => {
                this.itemsProductos.push({
                    id: element.id,
                    codigoInterno: element.codigoInterno,
                    producto: element.producto,
                    descripcion: element.descripcion,
                    netoUSD: parseFloat(element.netoUSD).toFixed(2).replace('.', ','),
                    netoUSD: element.netoUSD,
                    precioUSD: parseFloat(element.precioUSD).toFixed(2).replace('.', ','),
                    netoARS: parseFloat(element.netoARS).toFixed(2).replace('.', ','),
                    netoARS: element.netoARS,
                    precioARS: parseFloat(element.precioARS).toFixed(2).replace('.', ','),
                    imagen: element.imagenes != null ? element.imagenes[0] : '',
                    idMarca: element.marcaId,
                    marca: element.marca,
                    idCategoria: element.categoriaId,
                    categoria: element.categoria,
                    stockTotal: element.stockTotal,
                    oferta: element.oferta,
                    precioOfertaUSD: parseFloat(element.precioOfertaUSD).toFixed(2),
                    precioOfertaARS: parseFloat(element.precioOfertaARS).toFixed(2),
                    disponible: element.disponible
                });
            });
            this.$store.commit('setItemsProductos', this.itemsProductos);

            // Marcas.
            if (this.selectedMarca == 0) {
                this.itemsMarcas = [];
                resultado.marca.forEach(element => {
                    this.itemsMarcas.push({ id: element.cianboxId, marca: element.marca })
                });
                this.itemsMarcasTemp = [];
                this.itemsMarcasTemp.push({ id: 0, marca: "TODAS" });
                this.itemsMarcas.forEach(element => { this.itemsMarcasTemp.push({ id: element.id, marca: element.marca }) });
                this.itemsMarcas = this.itemsMarcasTemp;
                this.$store.commit('setItemsMarcas', this.itemsMarcas);
                this.$store.commit('setIdMarca', 0);
            }

            if (this.$store.state.itemsProductos.length > 0) {
                this.mostrarMensajeProductosNoEncontrados(false);
            }
            else {
                this.mostrarMensajeProductosNoEncontrados(true);
            }

            this.overlay = false;
        },

        mostrarMensajeProductosNoEncontrados(mostrar) {
            this.showNoProducts = mostrar;
        },

        async consMarcasPorCategoria(id) {
            this.overlay = true;
            this.$store.commit('setIdCategoria', id);
            const url = this.$store.state.urlService + "/Marcas/ConsMarcasPorCategoria?CategoriaId=" + id;
            const resultado = await (await fetch(url)).json();
            this.itemsMarcas = [];
            resultado.forEach(element => {
                this.itemsMarcas.push({ id: element.cianboxId, marca: element.marca })
            });
            this.itemsMarcasTemp = [];
            this.itemsMarcasTemp.push({ id: 0, marca: "TODAS" });
            this.itemsMarcas.forEach(element => { this.itemsMarcasTemp.push({ id: element.id, marca: element.marca }) });
            this.itemsMarcas = this.itemsMarcasTemp;
            this.$store.commit('setItemsMarcas', this.itemsMarcas);
            this.$store.commit('setIdMarca', 0);
            this.overlay = false;
        },

        async agregarProducto(item) {
            this.overlay = true;
            try {

                if (this.$store.state.carroId == 0) {
                    const setting = { method: "POST" };
                    const url = this.$store.state.urlService + "/Carro/InsertCarro?UsuarioId=" + this.$store.state.usuarioId;
                    const data = await fetch(url, setting);
                    const json = await data.json();
                    this.$store.state.carroId = json;
                }
            }
            catch (err) {
                console.log(err);
            };
            this.overlay = false;
        },
    },

    watch: {
        selectedCategoria: function () {
            if (this.$store.state.idCategoria != this.selectedCategoria) {
                this.consMarcasPorCategoria(this.selectedCategoria);
                this.selectedMarca = 0;
            }
        }
    },

    components: { Loading }
}
</script>