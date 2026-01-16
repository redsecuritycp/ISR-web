<template>

    <v-app-bar app flat>

        <!-- Menú lateral izquierdo -->
        <v-app-bar-nav-icon @click="showNavLeft()"></v-app-bar-nav-icon>

        <!-- Logo IDSR - Click selecciona sucursal Rosario -->
        <div 
            class="d-flex align-center pointer" 
            @click="cambiarSucursal(2)"
            :class="{ 'logo-activo': sucursalSeleccionada === 2 }"
            title="Insumos de Seguridad Rosario"
        >
            <v-img 
                alt="IDSR Logo" 
                src="@/assets/img/IDSRLogo.svg" 
                width="50" 
            />
            <v-img 
                alt="IDSR Texto" 
                src="@/assets/img/IDSRTexto.svg" 
                width="90" 
            />
        </div>

        <!-- Logo ISENOA - Click selecciona sucursal ISENOA -->
        <div
            class="pointer ml-6 d-flex align-center"
            @click="cambiarSucursal(1)"
            :class="{ 'logo-activo': sucursalSeleccionada === 1 }"
            title="ISENOA"
        >
            <v-img 
                alt="ISENOA" 
                src="@/assets/img/logo_isenoa.png" 
                width="150"
                contain
            />
        </div>

        <v-btn
          color="primary"
          rounded
          elevation="2"
          @click="$router.push('/')"
          class="mx-4 px-5"
          height="42"
        >
          <v-icon left size="24">mdi-home-circle</v-icon>
          <span class="font-weight-bold" style="font-size: 15px;">INICIO</span>
        </v-btn>

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

        <!-- Acceso al Presupuestador -->
        <v-btn 
          small
          color="primary"
          class="mr-3" 
          v-if="$store.state.usuario != ''" 
          @click="goTo('/presupuestador')"
        >
          <v-icon left small>mdi-cart-outline</v-icon>
          Presupuestador
          <v-chip 
            v-if="cantItemsPresupuesto > 0"
            x-small
            color="white"
            text-color="primary"
            class="ml-2 font-weight-bold"
          >{{ cantItemsPresupuesto }}</v-chip>
        </v-btn>

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
                        <v-btn block outlined rounded text @click="goTo('/manageUsers')">Administrar usuarios</v-btn>
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
        dolar: "    ",
        sucursalSeleccionada: 2
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
        },

        async cambiarSucursal(sucursalId) {
            this.$store.state.idSucursal = sucursalId;
            this.sucursalSeleccionada = sucursalId;
            
            // Refrescar productos
            bus.$emit('mostrarProductos');
            
            const usuarioId = this.$store.state.usuarioId;
            if (usuarioId && usuarioId !== 0) {
                try {
                    await fetch(`/api/cliente/${usuarioId}/sucursal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sucursalId })
                    });
                } catch (error) {
                    console.error('Error guardando sucursal:', error);
                }
            }
        },

        async cargarSucursalGuardada() {
            const usuarioId = this.$store.state.usuarioId;
            if (!usuarioId || usuarioId === 0) return;
            
            try {
                const response = await fetch(`/api/cliente/${usuarioId}`);
                const data = await response.json();
                if (data.sucursalId) {
                    this.sucursalSeleccionada = data.sucursalId;
                    this.$store.state.idSucursal = data.sucursalId;
                }
            } catch (error) {
                console.error('Error cargando sucursal:', error);
            }
        }
    },

    mounted() {
        this.consUsersPR();
        this.GetDolar();
        this.cargarSucursalGuardada();
    },

    computed: {
        isAdmin() {
            return this.$store.state.adminUser;
        },
        cantItemsPresupuesto() {
            return this.$store.state.itemsPresupuesto 
              ? this.$store.state.itemsPresupuesto.length 
              : 0;
        }
    },

    components: { Login, RegisterUser, ResetPassword }
}

</script>

<style scoped>
.logo-activo {
    opacity: 1;
    border-bottom: 3px solid #1976D2;
    padding-bottom: 4px;
}

.pointer {
    transition: opacity 0.2s ease;
}

.pointer:not(.logo-activo) {
    opacity: 0.7;
}

.pointer:hover {
    opacity: 1;
}
</style>
