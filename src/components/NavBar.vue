<template>

    <v-app-bar app>

        <!-- Menú lateral izquierdo -->
        <v-app-bar-nav-icon @click="showNavLeft()"></v-app-bar-nav-icon>

        <!-- Logo -->
        <div class="d-flex align-center pointer" @click="goTo('/')">
            <v-img alt="Vuetify Name" src="@/assets/img/IDSRLogo.svg" width="50" />
            <v-img alt="Vuetify Name" src="@/assets/img/IDSRTexto.svg" width="90" />
        </div>

        <v-spacer></v-spacer>

        <!-- Opción Registrarse si la ventana es md-->
        <RegisterUser class="hidden-sm-and-down" v-if="$store.state.usuario == ''">
        </RegisterUser>

        <!-- Opción Login si la pantalla es md -->
        <Login class="hidden-sm-and-down ma-2" v-if="$store.state.usuario == ''"></Login>

        <!-- Opciones Registrarse y Login si la ventana es sm -->
        <div v-if="$store.state.usuario == ''">
            <v-menu offset-y :close-on-click="true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon large class="hidden-md-and-up">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                </template>
                <v-list class="hidden-md-and-up">
                    <v-list-item class="hidden-md-and-up">
                        <RegisterUser> </RegisterUser>
                    </v-list-item>
                    <v-list-item class="hidden-md-and-up">
                        <Login></Login>
                    </v-list-item>
                </v-list>

            </v-menu>
        </div>

        <!-- Valor del dólar oficial -->
        <div class="pe-4" v-if="$store.state.usuario != ''">Dólar oficial: <b>{{ dolar }}</b></div>

        <!-- Opciones si el usuario está logueado -->
        <div>
            <v-menu offset-y :close-on-click="true" v-if="$store.state.usuario != ''" max-width="400">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon large>
                        <v-badge v-if="isAdmin" color="error" :content="$store.state.cantUsersPR" overlap>
                            <v-icon>mdi-account-outline</v-icon>
                        </v-badge>
                        <v-icon v-else>mdi-account-outline</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{ $store.state.usuario }}</v-list-item-title>
                            <v-list-item-subtitle>{{ $store.state.emailUsuario }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item>
                        <ResetPassword></ResetPassword>
                    </v-list-item>
                    <v-list-item v-if="isAdmin">
                        <v-btn block outlined rounded text @click="goTo('/ManageUsers')">Administrar usuaros</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn block outlined rounded text @click="logout()">Cerrar sesion</v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- Carro de compras -->
        <!-- <v-btn @click="goTo('/ShoppingCart')" icon v-if="$store.state.usuario != ''">
            <v-badge color="error" overlap content="0" :content="$store.state.cantProductsInOpenCart">
                <v-icon>mdi-cart-outline</v-icon>
            </v-badge>
        </v-btn> -->

    </v-app-bar>

</template>

<script>

import bus from '../store/bus'
import Login from '../components/Login.vue'
import RegisterUser from '../components/RegisterUser.vue'
import ResetPassword from '../components/ResetPassword.vue'
import { addYears } from 'date-fns'

export default {
    name: 'NavBarComponent',

    data: () => ({
        dolar: "    "
    }),

    methods: {
        showNavLeft() {
            bus.$emit('showNavLeft');
        },

        goTo(ruta) {
            this.$router.push(ruta).catch(() => { });
        },

        async logout() {
            this.$store.state.usuario = '';
            this.$store.state.emailUsuario = '';
            this.$store.state.adminUser = '';
            this.$store.state.usuarioId = 0;
            localStorage.removeItem('usuario');
            localStorage.removeItem('emailUsuario');
            localStorage.removeItem('admin');
            localStorage.removeItem('usuarioId');
            if (this.$route.path !== '/') {
                this.$router.push('/');
            }
        },

        // Se repite en Login. Unificar en un js solo.
        async consUsersPR() {
            this.overlay = true;
            try {
                this.Items = [];
                const setting = { method: "GET" };
                const url = this.$store.state.urlService + "/Usuarios/ConsUsuariosPR";
                const data = await fetch(url, setting);
                const json = await data.json();
                this.Items = json;
                this.$store.state.cantUsersPR = this.Items.length == 0 ? '0' : this.Items.length;
            } catch (err) {
                console.log(err);
            }
            this.overlay = false;
        },

        async GetDolar() {
            const setting = { method: "GET" };
            const url = "https://dolarapi.com/v1/dolares/oficial";
            try {
                const response = await fetch(url, setting);
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                const data = await response.json();
                this.dolar = parseFloat(data.venta).toFixed(2).replace('.', ',');
            }
            catch (error) {
                console.error("Error al obtener el valor del dólar:", error.message);
            }
        }
    },

    mounted() {
        this.consUsersPR();
        this.GetDolar();
    },

    computed: {
        isAdmin() {
            return this.$store.state.adminUser;
        }
    },

    components: { Login, RegisterUser, ResetPassword }
}

</script>
