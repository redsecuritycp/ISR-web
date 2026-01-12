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
                  style="overflow: hidden; border-radius: 12px; transition: all 0.3s ease; height: 100%; width: 100%;"
                >
                    <v-hover v-slot="{ hover }">
                        <v-img :src=item.imagen cover :aspect-ratio="16 / 9">

                            <div v-if="item.oferta && $store.state.usuario !== ''"
                                class="white--text text-body-2 px-1 py-1"
                                style="position: absolute; top: 0; left: 0; background-color: rgba(255, 0, 0, 0.7); z-index: 1; border-bottom-right-radius: 8px;">
                                <strong>OFERTA</strong> U$D {{ item.precioOfertaUSD }} / ARS {{ item.precioOfertaARS }}
                            </div>
                            <!-- Cartel DISPONIBLE o CONSULTAR -->
                            <v-chip
                              :color="item.disponible > 0 ? 'success' : 'warning'"
                              :text-color="item.disponible > 0 ? 'white' : 'black'"
                              small
                              class="font-weight-bold"
                              style="position: absolute; bottom: 8px; right: 8px; z-index: 1;"
                            >
                              {{ item.disponible > 0 ? 'DISPONIBLE' : 'CONSULTAR' }}
                            </v-chip>

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

                    <v-card-text class="pt-2 flex-grow-1" style="position: relative; display: flex; flex-direction: column; height: 100%;">

                        <h5 class="font-weight-bold mb-2" style="color: #0288D1; line-height: 1.3;">
                          {{ item.producto.replace(/\*\*/g, '').trim() }}
                        </h5>

                        <div style="margin-top: auto;">
                          <h5>Cód.: {{ item.codigoInterno }}</h5>

                          <h5>Marca: {{ item.marca }}</h5>

                          <h5>Cat.: {{ item.categoria }}</h5>

                          <div v-if="$store.state.usuario != ''">
                              <h5>U$D: {{ item.precioUSD | UnsignedCurrency }} Final</h5>
                              <h5>ARS: {{ item.precioARS | UnsignedCurrency }} Final</h5>
                          </div>
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
            { text: "CATEGORÍA", value: 1 },
            { text: "NOMBRE", value: 2 },
            { text: "PRECIO MENOR", value: 3 },
            { text: "PRECIO MAYOR", value: 4 },
            { text: "CON STOCK", value: 5 },
            { text: "SIN STOCK", value: 6 }
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

        normalizarBusqueda(texto) {
            if (!texto) return '';
            let normalizado = texto.toLowerCase().trim();
            
            // Quitar tildes
            normalizado = normalizado.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            
            // Quitar caracteres especiales
            normalizado = normalizado.replace(/[^a-z0-9\s]/g, '');
            
            return normalizado;
        },

        generarVariaciones(texto) {
            const variaciones = [];
            const normalizado = this.normalizarBusqueda(texto);
            
            if (!normalizado) return variaciones;
            
            // Diccionario COMPLETO de correcciones para seguridad y conectividad
            const correcciones = {
                
                // ========== ALARMAS ==========
                'alarma': 'alarma', 'alarmas': 'alarma',
                'alrma': 'alarma', 'alrmas': 'alarma',
                'alarrma': 'alarma', 'alarrmas': 'alarma',
                'alarmma': 'alarma', 'alarmmas': 'alarma',
                'aalrma': 'alarma', 'alrama': 'alarma',
                'allarma': 'alarma', 'alarmaa': 'alarma',
                'larma': 'alarma', 'alarma s': 'alarma',
                'alarms': 'alarma', 'alarm': 'alarma',
                
                // ========== CAMARAS ==========
                'camara': 'camara', 'camaras': 'camara',
                'camera': 'camara', 'cameras': 'camara',
                'cammara': 'camara', 'camarra': 'camara',
                'camaraa': 'camara', 'caamara': 'camara',
                'camra': 'camara', 'cmara': 'camara',
                'cámara': 'camara', 'cámaras': 'camara',
                'cam': 'camara', 'camar': 'camara',
                'caamras': 'camara', 'camaars': 'camara',
                'caemra': 'camara', 'camrea': 'camara',
                
                // ========== CAMARAS IP ==========
                'ip': 'ip', 'ips': 'ip',
                'camaraip': 'camara ip', 'camarasip': 'camara ip',
                'camara ip': 'camara ip', 'camaras ip': 'camara ip',
                'ipcam': 'camara ip', 'ipcamera': 'camara ip',
                
                // ========== CAMARAS ANALOGAS ==========
                'analoga': 'analoga', 'analogas': 'analoga',
                'análoga': 'analoga', 'análogas': 'analoga',
                'analogica': 'analoga', 'analogicas': 'analoga',
                'analógica': 'analoga', 'analógicas': 'analoga',
                'anaolga': 'analoga', 'anaaloga': 'analoga',
                
                // ========== DVR ==========
                'dvr': 'dvr', 'dvrs': 'dvr',
                'dvrr': 'dvr', 'dvvr': 'dvr',
                'ddr': 'dvr', 'drv': 'dvr',
                'vdr': 'dvr', 'dv': 'dvr',
                'dver': 'dvr', 'devr': 'dvr',
                
                // ========== NVR ==========
                'nvr': 'nvr', 'nvrs': 'nvr',
                'nvrr': 'nvr', 'nvvr': 'nvr',
                'nrv': 'nvr', 'vnr': 'nvr',
                'nv': 'nvr', 'nver': 'nvr',
                
                // ========== GRABADORES ==========
                'grabador': 'grabador', 'grabadores': 'grabador',
                'gravador': 'grabador', 'gravadores': 'grabador',
                'grabadro': 'grabador', 'grabdor': 'grabador',
                'grabdaor': 'grabador', 'garbador': 'grabador',
                'grabadr': 'grabador', 'grabaodr': 'grabador',
                
                // ========== DISCO / ALMACENAMIENTO ==========
                'disco': 'disco', 'discos': 'disco',
                'dico': 'disco', 'dicos': 'disco',
                'dicso': 'disco', 'discso': 'disco',
                'disoc': 'disco', 'dsico': 'disco',
                'discp': 'disco', 'discoo': 'disco',
                'diisco': 'disco', 'disko': 'disco',
                'discco': 'disco', 'idisco': 'disco',
                'rigido': 'rigido', 'rigidos': 'rigido',
                'rijido': 'rigido', 'rijidos': 'rigido',
                'rigiido': 'rigido', 'rígido': 'rigido',
                'rígidos': 'rigido', 'riigido': 'rigido',
                'hdd': 'disco', 'ssd': 'disco',
                'almacenamiento': 'almacenamiento',
                'almacenamineto': 'almacenamiento',
                'almacenmiento': 'almacenamiento',
                'almacenamient': 'almacenamiento',
                
                // ========== MEMORIA / SD ==========
                'memoria': 'memoria', 'memorias': 'memoria',
                'memori': 'memoria', 'meoria': 'memoria',
                'memoira': 'memoria', 'memria': 'memoria',
                'sd': 'memoria', 'microsd': 'memoria',
                'micro sd': 'memoria', 'tarjetasd': 'memoria',
                'tarjeta sd': 'memoria',
                
                // ========== CABLES ==========
                'cable': 'cable', 'cables': 'cable',
                'calbe': 'cable', 'cabel': 'cable',
                'cabl': 'cable', 'cablee': 'cable',
                'ccable': 'cable', 'cble': 'cable',
                'cabels': 'cable', 'cabels': 'cable',
                'utp': 'utp', 'utps': 'utp',
                'uttp': 'utp', 'uptp': 'utp',
                'coaxial': 'coaxial', 'coaxiales': 'coaxial',
                'coaxil': 'coaxial', 'coaxal': 'coaxial',
                'coaaxial': 'coaxial', 'coasial': 'coaxial',
                'hdmi': 'hdmi', 'hdmis': 'hdmi',
                'hmdi': 'hdmi', 'hdim': 'hdmi',
                'fibra': 'fibra', 'fibras': 'fibra',
                'fribra': 'fibra', 'fibr': 'fibra',
                'bobina': 'bobina', 'bobinas': 'bobina',
                'bovina': 'bobina', 'bobnia': 'bobina',
                
                // ========== CONECTORES ==========
                'conector': 'conector', 'conectores': 'conector',
                'conecotr': 'conector', 'coector': 'conector',
                'conecor': 'conector', 'conectro': 'conector',
                'coenctor': 'conector', 'connetor': 'conector',
                'rj45': 'rj45', 'rj 45': 'rj45',
                'rj-45': 'rj45', 'rjj45': 'rj45',
                'bnc': 'bnc', 'bncs': 'bnc',
                'bnc': 'bnc', 'bcn': 'bnc',
                'balun': 'balun', 'baluns': 'balun',
                'valun': 'balun', 'balunn': 'balun',
                'blun': 'balun', 'balum': 'balun',
                'jack': 'jack', 'jacks': 'jack',
                'jakc': 'jack', 'jacck': 'jack',
                
                // ========== BATERIAS Y PILAS ==========
                'bateria': 'bateria', 'baterias': 'bateria',
                'batria': 'bateria', 'bateira': 'bateria',
                'vateria': 'bateria', 'baterria': 'bateria',
                'batería': 'bateria', 'baterías': 'bateria',
                'bateri': 'bateria', 'baterai': 'bateria',
                'pila': 'pila', 'pilas': 'pila',
                'plia': 'pila', 'piila': 'pila',
                'pilaa': 'pila', 'ppila': 'pila',
                
                // ========== FUENTES / UPS ==========
                'fuente': 'fuente', 'fuentes': 'fuente',
                'feunte': 'fuente', 'fuent': 'fuente',
                'fuentee': 'fuente', 'ffuente': 'fuente',
                'fuennte': 'fuente', 'fuentte': 'fuente',
                'feuntes': 'fuente', 'feuentes': 'fuente',
                'ups': 'ups', 'upss': 'ups',
                'usp': 'ups', 'usps': 'ups',
                'upp': 'ups', 'upps': 'ups',
                'transformador': 'transformador',
                'transformadores': 'transformador',
                'trafo': 'transformador', 'trafos': 'transformador',
                'tranformador': 'transformador',
                'trasformador': 'transformador',
                
                // ========== CONECTIVIDAD / REDES ==========
                'switch': 'switch', 'switches': 'switch',
                'swich': 'switch', 'swicth': 'switch',
                'swith': 'switch', 'swithc': 'switch',
                'swtich': 'switch', 'siwtch': 'switch',
                'switche': 'switch', 'swicht': 'switch',
                'router': 'router', 'routers': 'router',
                'ruoter': 'router', 'ruter': 'router',
                'routerr': 'router', 'roter': 'router',
                'routeer': 'router', 'rotuer': 'router',
                'modem': 'modem', 'modems': 'modem',
                'moedm': 'modem', 'modme': 'modem',
                'access point': 'access point',
                'accesspoint': 'access point',
                'ap': 'access point',
                'acces point': 'access point',
                'punto acceso': 'access point',
                'poe': 'poe', 'ppoe': 'poe',
                'poee': 'poe', 'ope': 'poe',
                'inyector': 'inyector', 'inyectores': 'inyector',
                'innyector': 'inyector', 'iyector': 'inyector',
                
                // ========== CONTROL DE ACCESO ==========
                'acceso': 'acceso', 'accesos': 'acceso',
                'aceso': 'acceso', 'acesso': 'acceso',
                'accso': 'acceso', 'acseso': 'acceso',
                'accseo': 'acceso', 'accceso': 'acceso',
                'control': 'control', 'controles': 'control',
                'controls': 'control', 'contrl': 'control',
                'cotrol': 'control', 'contorl': 'control',
                'controlador': 'controlador',
                'controladores': 'controlador',
                'controaldor': 'controlador',
                'contolador': 'controlador',
                'controllador': 'controlador',
                'lector': 'lector', 'lectores': 'lector',
                'letcor': 'lector', 'lecor': 'lector',
                'lectoor': 'lector', 'lecotr': 'lector',
                'tarjeta': 'tarjeta', 'tarjetas': 'tarjeta',
                'tarjet': 'tarjeta', 'tarjta': 'tarjeta',
                'targjeta': 'tarjeta', 'tarjtea': 'tarjeta',
                'teclado': 'teclado', 'teclados': 'teclado',
                'tecaldo': 'teclado', 'telcado': 'teclado',
                'teclaod': 'teclado', 'tecldo': 'teclado',
                'biometrico': 'biometrico',
                'biometricos': 'biometrico',
                'biométrico': 'biometrico',
                'biométricos': 'biometrico',
                'biometirco': 'biometrico',
                'huella': 'huella', 'huellas': 'huella',
                'heulla': 'huella', 'huellaa': 'huella',
                'asistencia': 'asistencia',
                'asitencia': 'asistencia',
                'asistnecia': 'asistencia',
                'asistecia': 'asistencia',
                
                // ========== CERRADURAS ==========
                'cerradura': 'cerradura', 'cerraduras': 'cerradura',
                'cerradu': 'cerradura', 'ceradura': 'cerradura',
                'serradura': 'cerradura', 'cerrradura': 'cerradura',
                'cerrdura': 'cerradura', 'cerradurra': 'cerradura',
                'electroiman': 'electroiman',
                'electro iman': 'electroiman',
                'electroimán': 'electroiman',
                'electoiman': 'electroiman',
                
                // ========== SENSORES / DETECTORES ==========
                'sensor': 'sensor', 'sensores': 'sensor',
                'sensors': 'sensor', 'sennsor': 'sensor',
                'sensr': 'sensor', 'senser': 'sensor',
                'snsor': 'sensor', 'censor': 'sensor',
                'censores': 'sensor', 'sensosr': 'sensor',
                'detector': 'detector', 'detectores': 'detector',
                'detectors': 'detector', 'detecotr': 'detector',
                'dettector': 'detector', 'detecttor': 'detector',
                'detecor': 'detector', 'detetor': 'detector',
                'movimiento': 'movimiento',
                'movimientos': 'movimiento',
                'movimieto': 'movimiento',
                'movimient': 'movimiento',
                'movimeinto': 'movimiento',
                'movimineto': 'movimiento',
                'pir': 'movimiento', 'pirr': 'movimiento',
                'magnetico': 'magnetico', 'magneticos': 'magnetico',
                'manetico': 'magnetico', 'magnitico': 'magnetico',
                'magnético': 'magnetico', 'magnéticos': 'magnetico',
                'magenetico': 'magnetico',
                
                // ========== SIRENAS ==========
                'sirena': 'sirena', 'sirenas': 'sirena',
                'cirena': 'sirena', 'sirrena': 'sirena',
                'sirenna': 'sirena', 'sireena': 'sirena',
                'sirana': 'sirena', 'sirna': 'sirena',
                
                // ========== INCENDIO ==========
                'incendio': 'incendio', 'incendios': 'incendio',
                'insendio': 'incendio', 'incenido': 'incendio',
                'incedio': 'incendio', 'inncendio': 'incendio',
                'incendioo': 'incendio', 'incendi': 'incendio',
                'humo': 'humo', 'humos': 'humo',
                'umho': 'humo', 'hummo': 'humo',
                'humoo': 'humo', 'hhumo': 'humo',
                'temperatura': 'temperatura',
                'temperaturas': 'temperatura',
                'tempertura': 'temperatura',
                'tempratura': 'temperatura',
                
                // ========== CERCO ELECTRICO ==========
                'cerco': 'cerco', 'cercos': 'cerco',
                'serco': 'cerco', 'cercoo': 'cerco',
                'cerko': 'cerco', 'cerrco': 'cerco',
                'electrico': 'electrico', 'electricos': 'electrico',
                'eletrico': 'electrico', 'elctrico': 'electrico',
                'eléctrico': 'electrico', 'eléctricos': 'electrico',
                'electirco': 'electrico', 'elecrtrico': 'electrico',
                'electrificador': 'electrificador',
                'electrificadores': 'electrificador',
                'eletrificador': 'electrificador',
                
                // ========== TIPOS DE CAMARA ==========
                'domo': 'domo', 'domos': 'domo',
                'dmoo': 'domo', 'dommo': 'domo',
                'domo': 'domo', 'donmo': 'domo',
                'bullet': 'bullet', 'bullets': 'bullet',
                'bulet': 'bullet', 'bulelt': 'bullet',
                'bala': 'bullet', 'bullte': 'bullet',
                'turret': 'turret', 'turrets': 'turret',
                'turet': 'turret', 'torretta': 'turret',
                'turrte': 'turret', 'turrete': 'turret',
                'ptz': 'ptz', 'ptzs': 'ptz',
                'pzt': 'ptz', 'tpz': 'ptz',
                'pptz': 'ptz', 'pttz': 'ptz',
                'speed dome': 'ptz', 'speeddome': 'ptz',
                'infrarrojo': 'infrarrojo',
                'infrarrojos': 'infrarrojo',
                'infrarojo': 'infrarrojo',
                'infarrojo': 'infrarrojo',
                'infrarroo': 'infrarrojo',
                'ir': 'infrarrojo',
                
                // ========== MONITORES / PANTALLAS ==========
                'monitor': 'monitor', 'monitores': 'monitor',
                'montor': 'monitor', 'mointor': 'monitor',
                'monitoor': 'monitor', 'moniitor': 'monitor',
                'pantalla': 'pantalla', 'pantallas': 'pantalla',
                'pantala': 'pantalla', 'pantalal': 'pantalla',
                'patalla': 'pantalla', 'panttalla': 'pantalla',
                
                // ========== RACKS / GABINETES ==========
                'rack': 'rack', 'racks': 'rack',
                'rakc': 'rack', 'rak': 'rack',
                'rackk': 'rack', 'raack': 'rack',
                'gabinete': 'gabinete', 'gabinetes': 'gabinete',
                'gavinete': 'gabinete', 'gabiente': 'gabinete',
                'gabiinete': 'gabinete', 'gabinetee': 'gabinete',
                'bandeja': 'bandeja', 'bandejas': 'bandeja',
                'vandeja': 'bandeja', 'bandej': 'bandeja',
                
                // ========== FERRETERIA ==========
                'ferreteria': 'ferreteria',
                'ferreterias': 'ferreteria',
                'ferretría': 'ferreteria',
                'fererteria': 'ferreteria',
                'tornillo': 'tornillo', 'tornillos': 'tornillo',
                'tronillo': 'tornillo', 'tornilo': 'tornillo',
                'soporte': 'soporte', 'soportes': 'soporte',
                'sopore': 'soporte', 'soprote': 'soporte',
                'brazo': 'brazo', 'brazos': 'brazo',
                'braso': 'brazo', 'brazzo': 'brazo',
                
                // ========== ACCESORIOS ==========
                'accesorio': 'accesorio', 'accesorios': 'accesorio',
                'acesorio': 'accesorio', 'accesoiro': 'accesorio',
                'accesorioo': 'accesorio', 'accseorio': 'accesorio',
                
                // ========== MARCAS COMUNES ==========
                'hikvision': 'hikvision', 'hikvicion': 'hikvision',
                'hikvison': 'hikvision', 'hikvisión': 'hikvision',
                'hik': 'hikvision', 'hiik': 'hikvision',
                'hikivision': 'hikvision', 'hikvission': 'hikvision',
                'dahua': 'dahua', 'daua': 'dahua',
                'dauha': 'dahua', 'dahau': 'dahua',
                'daahua': 'dahua', 'dahuaa': 'dahua',
                'ajax': 'ajax', 'ajaz': 'ajax',
                'aiax': 'ajax', 'ajjax': 'ajax',
                'ubiquiti': 'ubiquiti', 'ubiquity': 'ubiquiti',
                'ubiquitti': 'ubiquiti', 'ubiquti': 'ubiquiti',
                'tplink': 'tp-link', 'tp link': 'tp-link',
                'tp-link': 'tp-link', 'tplinck': 'tp-link',
                'mikrotik': 'mikrotik', 'microtik': 'mikrotik',
                'mikrotic': 'mikrotik', 'mikrotick': 'mikrotik',
                'zkteco': 'zkteco', 'zk teco': 'zkteco',
                'zk': 'zkteco', 'zktteco': 'zkteco',
                'epcom': 'epcom', 'epcoom': 'epcom',
                'ezviz': 'ezviz', 'ezivis': 'ezviz',
                'ezvis': 'ezviz', 'ezviss': 'ezviz',
                'honeywell': 'honeywell', 'honeywel': 'honeywell',
                'honeywall': 'honeywell',
                'bosch': 'bosch', 'bosh': 'bosch',
                'bossh': 'bosch', 'boosch': 'bosch',
                'paradox': 'paradox', 'paradoxx': 'paradox',
                'paradx': 'paradox', 'paraddox': 'paradox',
                'dsc': 'dsc', 'dscc': 'dsc',
                'alonso': 'alonso', 'alonzo': 'alonso',
                
                // ========== GENERAL / OTROS ==========
                'kit': 'kit', 'kits': 'kit',
                'kitt': 'kit', 'kti': 'kit',
                'combo': 'combo', 'combos': 'combo',
                'comob': 'combo', 'comb': 'combo',
                'oferta': 'oferta', 'ofertas': 'oferta',
                'ofert': 'oferta', 'ofetra': 'oferta',
                'oferrta': 'oferta', 'ofertaa': 'oferta',
                'promocion': 'promocion', 'promociones': 'promocion',
                'promosion': 'promocion', 'promo': 'promocion'
            };
            
            // PRIORIDAD 1: Si existe corrección exacta, ponerla PRIMERO
            if (correcciones[normalizado]) {
                variaciones.unshift(correcciones[normalizado]);
            }
            
            // PRIORIDAD 2: Buscar correcciones parciales
            Object.keys(correcciones).forEach(key => {
                if (key === normalizado) return; // Ya lo agregamos arriba
                if (normalizado.includes(key) || key.includes(normalizado)) {
                    // Insertar al principio si es corrección importante
                    if (key.length >= normalizado.length - 2) {
                        variaciones.unshift(correcciones[key]);
                    } else {
                        variaciones.push(correcciones[key]);
                    }
                }
            });
            
            // PRIORIDAD 3: Texto normalizado original (si no hay corrección)
            if (!correcciones[normalizado] && !variaciones.includes(normalizado)) {
                variaciones.push(normalizado);
            }
            
            // PRIORIDAD 4: Sin 's' final (plurales)
            if (normalizado.endsWith('s') && normalizado.length > 3) {
                const sinS = normalizado.slice(0, -1);
                if (!variaciones.includes(sinS)) {
                    // Si la versión sin 's' tiene corrección, usar esa
                    if (correcciones[sinS]) {
                        variaciones.unshift(correcciones[sinS]);
                    } else {
                        variaciones.push(sinS);
                    }
                }
            }
            
            // PRIORIDAD 5: Sin 'es' final
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
            
            // PRIORIDAD 6: Agregar 's' si no termina en 's'
            if (!normalizado.endsWith('s')) {
                const conS = normalizado + 's';
                if (!variaciones.includes(conS)) {
                    variaciones.push(conS);
                }
            }
            
            // Eliminar duplicados manteniendo el orden de prioridad
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
            
            let resultado = null;
            let terminoExitoso = '';
            
            // Generar variaciones del término de búsqueda
            const variaciones = this.generarVariaciones(this.searchData);
            
            // Si no hay texto de búsqueda, buscar sin filtro
            if (variaciones.length === 0) {
                resultado = await this.ejecutarBusqueda('');
            } else {
                // Intentar con cada variación hasta encontrar resultados
                for (const variacion of variaciones) {
                    resultado = await this.ejecutarBusqueda(variacion);
                    if (resultado.producto && resultado.producto.length > 0) {
                        terminoExitoso = variacion;
                        break;
                    }
                }
                
                // Si ninguna variación funcionó, 
                // intentar búsqueda original como fallback
                if (!resultado.producto || resultado.producto.length === 0) {
                    resultado = await this.ejecutarBusqueda(this.searchData.trim());
                }
            }
            
            // Procesar resultados (código existente)
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
            
            // Ordenar por disponibilidad (frontend)
            if (this.selectedOrder === 5) {
                this.itemsProductos.sort((a, b) => {
                    if (a.disponible > 0 && b.disponible <= 0) return -1;
                    if (a.disponible <= 0 && b.disponible > 0) return 1;
                    return 0;
                });
            } else if (this.selectedOrder === 6) {
                this.itemsProductos.sort((a, b) => {
                    if (a.disponible <= 0 && b.disponible > 0) return -1;
                    if (a.disponible > 0 && b.disponible <= 0) return 1;
                    return 0;
                });
            }
            
            this.$store.commit('setItemsProductos', this.itemsProductos);

            // Marcas
            if (this.selectedMarca == 0) {
                this.itemsMarcas = [];
                resultado.marca.forEach(element => {
                    this.itemsMarcas.push({ id: element.cianboxId, marca: element.marca })
                });
                this.itemsMarcasTemp = [];
                this.itemsMarcasTemp.push({ id: 0, marca: "TODAS" });
                this.itemsMarcas.forEach(element => { 
                    this.itemsMarcasTemp.push({ 
                        id: element.id, 
                        marca: element.marca 
                    }) 
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

<style scoped>
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.v-card__text h5, 
.v-card__text h6 {
  word-break: break-word;
}

.v-flex.d-flex {
  align-items: stretch;
}

.product-card {
  min-height: 350px;
}

.product-card .v-image {
  flex-shrink: 0;
}

.product-card h6 a:hover {
  text-decoration: underline;
}
</style>