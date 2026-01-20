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
        <v-layout row wrap class="mt-1" style="display: flex; flex-wrap: wrap;">

            <v-flex xs12 sm6 md4 lg3 class="pa-2 d-flex" style="display: flex;" v-for="(item, index) in this.$store.state.itemsProductos" :key="index">

                <v-card 
                  class="mx-auto d-flex flex-column product-card" 
                  max-width="600"
                  elevation="2"
                  style="overflow: hidden; border-radius: 12px; 
                         transition: all 0.3s ease; height: 100%; width: 100%;"
                >
                    <v-hover v-slot="{ hover }">
                        <v-img :src=item.imagen cover :aspect-ratio="16 / 9">
                            <div v-if="item.oferta && $store.state.usuario !== ''"
                                class="white--text text-body-2 px-1 py-1"
                                style="position: absolute; top: 0; left: 0; background-color: rgba(255, 0, 0, 0.7); z-index: 1; border-bottom-right-radius: 8px;">
                                <strong>OFERTA</strong> U$D {{ item.precioOfertaUSD }} / ARS {{ item.precioOfertaARS }}
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

                    <div class="d-flex flex-wrap mx-3 mt-2" style="gap: 8px;">
                      <v-chip
                        color="primary"
                        text-color="white"
                        x-small
                        class="font-weight-bold"
                      >
                        {{ item.categoria }}
                      </v-chip>
                      <v-chip
                        :color="item.disponible > 0 ? 'success' : 'amber darken-1'"
                        text-color="white"
                        x-small
                        class="font-weight-bold"
                      >
                        <v-icon x-small left>
                          {{ item.disponible > 0 ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                        </v-icon>
                        {{ item.disponible > 0 ? 'DISPONIBLE' : 'CONSULTAR' }}
                      </v-chip>
                    </div>

                    <v-divider></v-divider>

                    <v-card-text class="pt-2 flex-grow-1" style="position: relative; display: flex; flex-direction: column; height: 100%;">

                        <v-tooltip bottom max-width="300">
                          <template v-slot:activator="{ on, attrs }">
                            <h6 
                              v-bind="attrs"
                              v-on="on"
                              class="font-weight-bold mb-1 product-title" 
                              style="color: #0288D1; font-size: 0.9rem; line-height: 1.3;"
                            >
                              <router-link 
                                :to="'/producto/' + item.id" 
                                style="text-decoration: none; color: inherit;"
                              >
                                {{ item.producto.replace(/\*\*/g, '').trim() }}
                              </router-link>
                            </h6>
                          </template>
                          <span>{{ item.producto.replace(/\*\*/g, '').trim() }}</span>
                        </v-tooltip>

                        <div style="margin-top: auto;">
                          <p class="mb-1 grey--text text--darken-1" style="font-size: 0.8rem;">
                            Cód.: {{ item.codigoInterno }}
                          </p>

                          <p class="mb-1 font-weight-bold" style="color: #1565C0; font-size: 0.85rem;">
                            {{ item.marca }}
                          </p>

                          <p class="mb-1 grey--text" style="font-size: 0.75rem;">
                            {{ item.categoria }}
                          </p>

                          <!-- Barras de stock -->
                          <div class="d-flex align-center mt-1">
                            <span style="font-size: 0.7rem; color: #666; margin-right: 4px;">Stock:</span>
                            <div class="d-flex">
                              <div 
                                v-for="n in 4" 
                                :key="n"
                                :style="{
                                  width: '6px',
                                  height: '14px',
                                  marginRight: '2px',
                                  borderRadius: '2px',
                                  backgroundColor: n <= calcularBarrasStock(item.stockTotal).barras 
                                    ? calcularBarrasStock(item.stockTotal).color 
                                    : '#e0e0e0'
                                }"
                              ></div>
                            </div>
                          </div>

                          <div v-if="$store.state.usuario != ''" class="mt-2 pt-2" 
                               style="border-top: 1px solid #eee;">
                              <p class="mb-0 font-weight-medium" 
                                 style="color: #2E7D32; font-size: 0.9rem;">
                                U$D {{ item.precioUSD | UnsignedCurrency }} Final
                              </p>
                              <p class="mb-0 font-weight-bold" 
                                 style="color: #1565C0; font-size: 1rem;">
                                ARS {{ item.precioARS | UnsignedCurrency }} Final
                              </p>
                          </div>
                        </div>

                    </v-card-text>

                    <v-card-actions v-if="$store.state.usuario != ''" class="pa-2">
                        <v-btn 
                            x-small 
                            color="primary" 
                            block
                            @click="agregarAlPresupuesto(item)"
                        >
                            <v-icon left x-small>mdi-plus</v-icon>
                            Agregar al presupuesto
                        </v-btn>
                    </v-card-actions>

                </v-card>

            </v-flex>

        </v-layout>

        <!-- Mensaje de producto no encontrado -->
        <v-alert v-model="showNoProducts" border="top" color="red lighten-2" dark class="mt-4 text-center">
            Lo lamentamos, no hay productos para esta selección.
        </v-alert>

        <v-snackbar 
            v-model="snackbar" 
            :timeout="2000" 
            color="success"
            top
            right
        >
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn 
                    text 
                    v-bind="attrs" 
                    @click="snackbar = false"
                >
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>

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
            { text: "CATEGORÍA", value: 1 },
            { text: "NOMBRE", value: 2 },
            { text: "PRECIO MENOR", value: 3 },
            { text: "PRECIO MAYOR", value: 4 },
            { text: "CON STOCK", value: 5 },
            { text: "SIN STOCK", value: 6 }
        ],
        searchData: '',
        selectedOrder: 5,
        selectedCategoria: 0,
        selectedMarca: 0,
        itemsProductos: [],
        itemsMarcas: [],
        itemsMarcasTemp: [],
        selectedSucursal: 0,
        chkVerSoloOfertas: false,
        snackbar: false,
        snackbarText: ''
    }),

    created() {
        this.searchData = this.$store.state.textSearch;
        this.selectedCategoria = this.$store.state.idCategoria;
        this.selectedMarca = this.$store.state.idMarca;
        this.selectedOrder = 5;
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
            this.selectedOrder = 5;
            this.selectedSucursal = this.$store.state.idSucursal;
            this.buscarProductos();
        },

        normalizarBusqueda(texto) {
            if (!texto) return '';
            let normalizado = texto.toLowerCase().trim();
            normalizado = normalizado.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            normalizado = normalizado.replace(/[^a-z0-9\s]/g, '');
            return normalizado;
        },

        generarVariaciones(texto) {
            const variaciones = [];
            const normalizado = this.normalizarBusqueda(texto);
            
            if (!normalizado) return variaciones;
            
            const correcciones = {
                'alarma': 'alarma', 'alarmas': 'alarma', 
                'alarrma': 'alarma', 'alarmma': 'alarma', 
                'alarmmas': 'alarma', 'alarrmas': 'alarma',
                'alrma': 'alarma', 'alrmas': 'alarma',
                
                'camara': 'camara', 'camaras': 'camara', 
                'camera': 'camara', 'cameras': 'camara',
                'cammara': 'camara', 'camra': 'camara',
                
                'dvr': 'dvr', 'dvrs': 'dvr', 
                'nvr': 'nvr', 'nvrs': 'nvr',
                'grabador': 'grabador', 'grabadores': 'grabador',
                'grabdor': 'grabador',
                
                'disco': 'disco', 'discos': 'disco', 
                'dicso': 'disco', 'dicsco': 'disco', 
                'discso': 'disco', 'disko': 'disco',
                'rigido': 'rigido', 'rijido': 'rigido',
                'hdd': 'disco', 'ssd': 'disco',
                
                'cable': 'cable', 'cables': 'cable', 
                'cabel': 'cable', 'calbe': 'cable',
                'utp': 'utp', 'utps': 'utp', 
                'coaxial': 'coaxial', 'coaxil': 'coaxial',
                
                'conector': 'conector', 'conectores': 'conector',
                'conetor': 'conector', 'conetores': 'conector',
                'rj45': 'rj45', 'bnc': 'bnc', 
                'balun': 'balun', 'balunes': 'balun',
                
                'fuente': 'fuente', 'fuentes': 'fuente', 
                'feunte': 'fuente',
                'ups': 'ups', 'upss': 'ups',
                'transformador': 'transformador', 
                'trafo': 'transformador',
                
                'sensor': 'sensor', 'sensores': 'sensor', 
                'senso': 'sensor', 'sesnor': 'sensor',
                'detector': 'detector', 'detectores': 'detector',
                'detetor': 'detector',
                'pir': 'pir', 'magnetico': 'magnetico',
                
                'switch': 'switch', 'switches': 'switch', 
                'swich': 'switch', 'swicth': 'switch', 
                'suich': 'switch', 'switche': 'switch',
                'router': 'router', 'routers': 'router', 
                'ruoter': 'router', 'ruter': 'router',
                'poe': 'poe', 'ppoe': 'poe',
                
                'control': 'control', 'controles': 'control',
                'acceso': 'acceso', 'aceso': 'acceso',
                'lector': 'lector', 'lectores': 'lector',
                'tarjeta': 'tarjeta', 'tarjetas': 'tarjeta',
                'biometrico': 'biometrico',
                'huella': 'huella', 'huellas': 'huella',
                
                'cerradura': 'cerradura', 'cerraduras': 'cerradura',
                'electroiman': 'electroiman',
                
                'sirena': 'sirena', 'sirenas': 'sirena', 
                'cirena': 'sirena',
                
                'incendio': 'incendio', 'insendio': 'incendio',
                'humo': 'humo',
                
                'domo': 'domo', 'domos': 'domo',
                'bullet': 'bullet', 'bullets': 'bullet', 
                'bulet': 'bullet',
                'turret': 'turret', 'turrets': 'turret',
                'ptz': 'ptz', 'ptzs': 'ptz', 'pzt': 'ptz',
                
                'hikvision': 'hikvision', 'hikvisión': 'hikvision',
                'hikvicion': 'hikvision', 'hik': 'hikvision',
                'dahua': 'dahua', 'daua': 'dahua',
                'ajax': 'ajax', 'ajaz': 'ajax',
                'ubiquiti': 'ubiquiti', 'ubiquity': 'ubiquiti',
                'zkteco': 'zkteco', 'zk': 'zkteco',
                'mikrotik': 'mikrotik', 'microtik': 'mikrotik',
                
                'bateria': 'bateria', 'baterias': 'bateria',
                'pila': 'bateria', 'pilas': 'bateria',
                'monitor': 'monitor', 'monitores': 'monitor',
                'pantalla': 'pantalla', 'pantallas': 'pantalla',
                'rack': 'rack', 'racks': 'rack',
                'gabinete': 'gabinete', 'gabinetes': 'gabinete'
            };
            
            if (correcciones[normalizado]) {
                variaciones.unshift(correcciones[normalizado]);
            }
            
            Object.keys(correcciones).forEach(key => {
                if (key === normalizado) return;
                if (normalizado.includes(key) || key.includes(normalizado)) {
                    if (key.length >= normalizado.length - 2) {
                        variaciones.unshift(correcciones[key]);
                    } else {
                        variaciones.push(correcciones[key]);
                    }
                }
            });
            
            if (!correcciones[normalizado] && 
                !variaciones.includes(normalizado)) {
                variaciones.push(normalizado);
            }
            
            if (normalizado.endsWith('s') && normalizado.length > 3) {
                const sinS = normalizado.slice(0, -1);
                if (!variaciones.includes(sinS)) {
                    if (correcciones[sinS]) {
                        variaciones.unshift(correcciones[sinS]);
                    } else {
                        variaciones.push(sinS);
                    }
                }
            }
            
            if (normalizado.endsWith('es') && normalizado.length > 4) {
                const sinEs = normalizado.slice(0, -2);
                if (!variaciones.includes(sinEs)) {
                    if (correcciones[sinEs]) {
                        variaciones.unshift(correcciones[sinEs]);
                    } else {
                        variaciones.push(sinEs);
                    }
                }
            }
            
            return [...new Set(variaciones)];
        },

        async ejecutarBusqueda(termino) {
            const url = this.$store.state.urlService + 
                "/Productos/ConsProductos?Producto=" + termino.trim() +
                "&CategoriaId=" + this.selectedCategoria + 
                "&MarcaId=" + this.selectedMarca + 
                "&OrdenId=" + this.selectedOrder + 
                "&SucursalId=" + this.selectedSucursal + 
                "&Oferta=" + this.chkVerSoloOfertas;
            const resultado = await (await fetch(url)).json();
            return resultado;
        },

        async buscarProductos() {
            this.overlay = true;
            const url = this.$store.state.urlService + 
                "/Productos/ConsProductos?Producto=" + 
                this.searchData.trim() +
                "&CategoriaId=" + this.selectedCategoria + 
                "&MarcaId=" + this.selectedMarca + 
                "&OrdenId=" + this.selectedOrder + 
                "&SucursalId=" + this.selectedSucursal + 
                "&Oferta=" + this.chkVerSoloOfertas;
            const resultado = await (await fetch(url)).json();
            
            this.itemsProductos = [];
            resultado.producto.forEach(element => {
                this.itemsProductos.push({
                    id: element.id,
                    codigoInterno: element.codigoInterno,
                    producto: element.producto,
                    descripcion: element.descripcion,
                    netoUSD: element.netoUSD,
                    precioUSD: parseFloat(element.precioUSD)
                        .toFixed(2).replace('.', ','),
                    netoARS: element.netoARS,
                    precioARS: parseFloat(element.precioARS)
                        .toFixed(2).replace('.', ','),
                    imagen: element.imagenes != null 
                        ? element.imagenes[0] : '',
                    idMarca: element.marcaId,
                    marca: element.marca,
                    idCategoria: element.categoriaId,
                    categoria: element.categoria,
                    stockTotal: element.stockTotal,
                    oferta: element.oferta,
                    precioOfertaUSD: parseFloat(element.precioOfertaUSD)
                        .toFixed(2),
                    precioOfertaARS: parseFloat(element.precioOfertaARS)
                        .toFixed(2),
                    disponible: element.disponible
                });
            });
            // Ordenar: primero los que tienen stock > 0
            if (this.selectedOrder === 5) {
              this.itemsProductos.sort((a, b) => {
                if (a.stockTotal > 0 && b.stockTotal <= 0) return -1;
                if (a.stockTotal <= 0 && b.stockTotal > 0) return 1;
                return b.stockTotal - a.stockTotal;
              });
            }
            this.$store.commit('setItemsProductos', this.itemsProductos);

            // Marcas.
            if (this.selectedMarca == 0) {
                this.itemsMarcas = [];
                resultado.marca.forEach(element => {
                    this.itemsMarcas.push({ 
                        id: element.cianboxId, 
                        marca: element.marca 
                    });
                });
                this.itemsMarcasTemp = [];
                this.itemsMarcasTemp.push({ id: 0, marca: "TODAS" });
                this.itemsMarcas.forEach(element => { 
                    this.itemsMarcasTemp.push({ 
                        id: element.id, 
                        marca: element.marca 
                    }); 
                });
                this.itemsMarcas = this.itemsMarcasTemp;
                this.$store.commit('setItemsMarcas', this.itemsMarcas);
                this.$store.commit('setIdMarca', 0);
            }

            if (this.$store.state.itemsProductos.length > 0) {
                this.mostrarMensajeProductosNoEncontrados(false);
            } else {
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

        calcularBarrasStock(stockTotal) {
          if (!stockTotal || stockTotal <= 0) return { barras: 0, color: '#ef5350' };
          const porcentaje = (stockTotal / this.maxStockVisible) * 100;
          
          if (porcentaje <= 25) return { barras: 1, color: '#ef5350' };
          if (porcentaje <= 50) return { barras: 2, color: '#ffa726' };
          if (porcentaje <= 75) return { barras: 3, color: '#66bb6a' };
          return { barras: 4, color: '#43a047' };
        },

        agregarAlPresupuesto(item) {
            this.$store.commit('addItemPresupuesto', {
                id: item.id,
                codigoInterno: item.codigoInterno,
                producto: item.producto,
                marca: item.marca,
                categoria: item.categoria,
                netoUSD: item.netoUSD,
                netoARS: item.netoARS,
                precioUSD: item.precioUSD,
                precioARS: item.precioARS,
                imagen: item.imagen
            });
            this.snackbarText = `${item.producto} agregado al presupuesto`;
            this.snackbar = true;
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

    computed: {
      maxStockVisible() {
        const productos = this.$store.state.itemsProductos;
        if (!productos || productos.length === 0) return 1;
        const max = Math.max(...productos.map(p => p.stockTotal || 0));
        return max > 0 ? max : 1;
      }
    },

    components: { Loading }
}
</script>

<style scoped>
.v-flex.d-flex {
  align-items: stretch;
}

.product-card {
  min-height: 380px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18) !important;
}

.product-card:hover .v-image {
  filter: brightness(1.05);
}

.product-card .v-image {
  flex-shrink: 0;
}

.v-card__text h5, 
.v-card__text h6 {
  word-break: break-word;
}

.product-title {
  word-break: break-word;
  hyphens: auto;
}
</style>