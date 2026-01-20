<template>
    <v-container class="py-8">
        <v-row justify="center" class="text-center">
            <v-col cols="12">
                <v-img 
                    :src="logoSucursal" 
                    class="mx-auto mb-4" 
                    contain 
                    max-height="160"
                    max-width="160"
                />
                <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
                    Bienvenido a
                </h1>
                <h1 
                    class="text-h4 text-md-h3 font-weight-bold 
                           primary--text mb-8"
                >
                    {{ nombreSucursal }}
                </h1>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" sm="6" lg="4">
                <v-card 
                    class="info-card fill-height" 
                    elevation="3"
                    rounded="xl"
                >
                    <v-card-text class="text-center pa-6">
                        <v-avatar 
                            color="primary" 
                            size="64" 
                            class="mb-4"
                        >
                            <v-icon dark size="32">
                                mdi-map-marker
                            </v-icon>
                        </v-avatar>
                        <h3 class="text-h6 font-weight-bold mb-4">
                            Ubicación
                        </h3>
                        <p class="text-body-1 mb-1">
                            {{ datosSucursal.direccion }}
                        </p>
                        <p 
                            v-if="datosSucursal.direccion2"
                            class="text-body-2 grey--text mb-1"
                        >
                            {{ datosSucursal.direccion2 }}
                        </p>
                        <p class="text-body-1 mb-1">
                            {{ datosSucursal.ciudad }}
                        </p>
                        <p class="text-body-1 mb-3">
                            República Argentina
                        </p>
                        <v-chip 
                            small 
                            color="grey lighten-2"
                            class="font-weight-medium"
                        >
                            <v-icon small left>mdi-mailbox</v-icon>
                            CP: {{ datosSucursal.cp }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" lg="4">
                <v-card 
                    class="info-card fill-height" 
                    elevation="3"
                    rounded="xl"
                >
                    <v-card-text class="text-center pa-6">
                        <v-avatar 
                            color="success" 
                            size="64" 
                            class="mb-4"
                        >
                            <v-icon dark size="32">
                                mdi-clock-outline
                            </v-icon>
                        </v-avatar>
                        <h3 class="text-h6 font-weight-bold mb-4">
                            Horario de Atención
                        </h3>
                        <p class="text-body-1 mb-4">
                            {{ datosSucursal.diasAtencion }}
                        </p>
                        <v-chip 
                            color="success" 
                            dark
                            class="font-weight-bold px-4"
                        >
                            <v-icon small left>mdi-clock</v-icon>
                            {{ datosSucursal.horario }}
                        </v-chip>
                        <p class="text-body-2 grey--text mt-4 mb-0">
                            {{ datosSucursal.diasCerrado }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="12" lg="4">
                <v-card 
                    class="info-card fill-height" 
                    elevation="3"
                    rounded="xl"
                >
                    <v-card-text class="text-center pa-6">
                        <v-avatar 
                            color="info" 
                            size="64" 
                            class="mb-4"
                        >
                            <v-icon dark size="32">
                                mdi-phone
                            </v-icon>
                        </v-avatar>
                        <h3 class="text-h6 font-weight-bold mb-4">
                            Teléfonos
                        </h3>
                        <div class="phone-list">
                            <a 
                                v-for="(tel, idx) in datosSucursal.telefonos"
                                :key="idx"
                                :href="getWhatsAppLink(tel.numero)"
                                target="_blank"
                                class="phone-item"
                            >
                                <v-icon 
                                    color="green darken-1" 
                                    small 
                                    class="mr-2"
                                >
                                    mdi-whatsapp
                                </v-icon>
                                <span class="phone-text">
                                    {{ tel.display }}
                                </span>
                                <span 
                                    v-if="tel.nombre"
                                    class="phone-name"
                                >
                                    {{ tel.nombre }}
                                </span>
                            </a>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'HomeComponent',
    
    data: () => ({
        sucursales: {
            2: {
                nombre: 'Insumos de Seguridad Rosario',
                logo: require('../assets/img/IDSRLogo.svg'),
                direccion: 'Omar Carrasco 2773',
                direccion2: '(ex Richieri)',
                ciudad: 'Rosario, Santa Fe',
                cp: 'S2000QDP',
                diasAtencion: 'Lunes a Viernes',
                horario: '08:00 - 17:00 hs',
                diasCerrado: 'Sábados, Domingos y Feriados: Cerrado',
                telefonos: [
                    { 
                        numero: '5493417077180', 
                        display: '+54 9 3417 07-7180',
                        nombre: 'Agustina'
                    },
                    { 
                        numero: '5493417479394', 
                        display: '+54 9 3417 47-9394',
                        nombre: ''
                    },
                    { 
                        numero: '5493413566461', 
                        display: '+54 9 341 356-6461',
                        nombre: ''
                    },
                    { 
                        numero: '5493413389611', 
                        display: '+54 9 341 338-9611',
                        nombre: ''
                    },
                    { 
                        numero: '5493415520646', 
                        display: '+54 9 341 552-0646',
                        nombre: ''
                    },
                    { 
                        numero: '5493417544843', 
                        display: '+54 9 341 754-4843',
                        nombre: ''
                    }
                ]
            },
            1: {
                nombre: 'ISENOA',
                logo: require('../assets/img/logo_isenoa.png'),
                direccion: 'Consultar dirección',
                direccion2: '',
                ciudad: 'Tucumán',
                cp: '4000',
                diasAtencion: 'Lunes a Viernes',
                horario: '08:00 - 17:00 hs',
                diasCerrado: 'Sábados, Domingos y Feriados: Cerrado',
                telefonos: [
                    { 
                        numero: '5493813387990', 
                        display: '+54 9 3813 38-7990',
                        nombre: 'Ventas'
                    },
                    { 
                        numero: '5493816073997', 
                        display: '+54 9 3816 07-3997',
                        nombre: 'Milesi German'
                    }
                ]
            }
        }
    }),

    computed: {
        sucursalActual() {
            return this.$store.state.idSucursal || 2;
        },
        datosSucursal() {
            return this.sucursales[this.sucursalActual] 
                || this.sucursales[2];
        },
        nombreSucursal() {
            return this.datosSucursal.nombre;
        },
        logoSucursal() {
            return this.datosSucursal.logo;
        }
    },

    methods: {
        getWhatsAppLink(numero) {
            return `https://wa.me/${numero}`;
        }
    }
}
</script>

<style scoped>
.info-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05);
}

.info-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
}

.phone-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.phone-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px 16px;
    text-decoration: none;
    color: #37474F;
    background: #F5F5F5;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.2s ease;
    gap: 4px;
}

.phone-item:hover {
    background: #E8F5E9;
    color: #2E7D32;
    transform: scale(1.02);
}

.phone-text {
    font-weight: 600;
}

.phone-name {
    font-size: 0.85em;
    color: #666;
    width: 100%;
    text-align: center;
}
</style>
