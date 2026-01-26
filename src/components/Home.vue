<template>
    <v-container class="py-8">
        <v-row justify="center" class="text-center">
            <v-col cols="12">
                <v-img 
                    :src="logoSucursal" 
                    class="mx-auto mb-4" 
                    contain 
                    max-height="180"
                    max-width="400"
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

        <v-row justify="center" align="stretch">
            <v-col cols="12" sm="6" lg="5">
                <v-card 
                    class="horario-card fill-height" 
                    elevation="3"
                    rounded="xl"
                >
                    <div class="card-bg"></div>
                    <v-card-text class="text-center pa-6 horario-content">
                        <!-- Reloj 3D azul -->
                        <div class="clock-wrapper mb-4">
                            <div class="clock-3d">
                                <div class="clock-body">
                                    <div class="clock-face">
                                        <div class="tick" v-for="n in 12" :key="n" :style="{ transform: `rotate(${n * 30}deg)` }"></div>
                                        <div class="hand hour"></div>
                                        <div class="hand minute"></div>
                                        <div class="center-dot"></div>
                                    </div>
                                </div>
                                <div class="clock-shadow"></div>
                            </div>
                        </div>
                        
                        <v-chip 
                            color="primary" 
                            dark
                            class="font-weight-bold px-6 mb-4 chip-horario"
                            large
                        >
                            HORARIO
                        </v-chip>
                        
                        <div class="info-box">
                            <p class="text-body-1 font-weight-medium mb-1">
                                {{ datosSucursal.diasAtencion }}
                            </p>
                            <p class="text-h5 font-weight-bold primary--text mb-2">
                                {{ datosSucursal.horario }}
                            </p>
                            <p class="text-body-2 grey--text text--darken-1 mb-4">
                                {{ datosSucursal.diasCerrado }}
                            </p>
                            <v-divider class="mb-4"></v-divider>
                            <p class="text-body-1 font-weight-medium mb-1">
                                <v-icon small color="primary" class="mr-1">mdi-map-marker</v-icon>
                                {{ datosSucursal.direccion }}
                            </p>
                            <p class="text-body-2 grey--text mb-3">
                                {{ datosSucursal.ciudad }} - Argentina
                            </p>
                            <v-btn
                                color="primary"
                                rounded
                                :href="datosSucursal.mapsUrl"
                                target="_blank"
                            >
                                <v-icon left>mdi-directions</v-icon>
                                Cómo llegar
                            </v-btn>
                        </div>
                        
                        <v-img
                            :src="logoSucursal"
                            contain
                            max-height="45"
                            max-width="140"
                            class="mx-auto mt-5"
                        ></v-img>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" lg="5">
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
                                <v-avatar 
                                    size="36" 
                                    class="mr-2"
                                >
                                    <v-img 
                                        v-if="tel.foto" 
                                        :src="tel.foto"
                                    />
                                    <span v-else style="font-size: 20px;">
                                        🐸
                                    </span>
                                </v-avatar>
                                <div class="phone-info">
                                    <span class="phone-name">
                                        {{ tel.nombre }}
                                    </span>
                                    <span class="phone-text">
                                        <v-icon 
                                            color="green darken-1" 
                                            x-small 
                                            class="mr-1"
                                        >
                                            mdi-whatsapp
                                        </v-icon>
                                        {{ tel.display }}
                                    </span>
                                </div>
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
                mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Omar+Carrasco+2773+Rosario+Santa+Fe+Argentina',
                diasAtencion: 'Lunes a Viernes',
                horario: '08:00 - 17:00 hs',
                diasCerrado: 'Sábados, Domingos y Feriados: Cerrado',
                telefonos: [
                    { 
                        numero: '5493417077180', 
                        display: '+54 9 3417 07-7180',
                        nombre: 'Agustina Mur',
                        foto: '/vendedores/Agustina Mur.jpeg'
                    },
                    { 
                        numero: '5493417479394', 
                        display: '+54 9 3417 47-9394',
                        nombre: 'Mario Facundo Szemruch',
                        foto: '/vendedores/Mario Szemruch.jpeg'
                    },
                    { 
                        numero: '5493413566461', 
                        display: '+54 9 341 356-6461',
                        nombre: 'Maximiliano Puebla',
                        foto: '/vendedores/Maxi.jpeg'
                    },
                    { 
                        numero: '5493413389611', 
                        display: '+54 9 341 338-9611',
                        nombre: 'Estefania Albisu Enseñat',
                        foto: '/vendedores/Estefania.jpeg'
                    },
                    { 
                        numero: '5493415520646', 
                        display: '+54 9 341 552-0646',
                        nombre: 'Luciano Balonchard',
                        foto: '/vendedores/Luciano.jpeg'
                    },
                    { 
                        numero: '5493417544843', 
                        display: '+54 9 341 754-4843',
                        nombre: 'Facundo Galeano',
                        foto: '/vendedores/Facundo.jpeg'
                    }
                ]
            },
            1: {
                nombre: 'ISENOA',
                logo: '/logos/Isenoa.png',
                direccion: 'Batalla de Suipacha 748',
                direccion2: '',
                ciudad: 'Tucumán',
                cp: '4000',
                mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Batalla+de+Suipacha+748+Tucuman+Argentina',
                diasAtencion: 'Lunes a Viernes',
                horario: '8:00 a 18:00',
                diasCerrado: 'Sábados: 9:00 a 13:00 | Domingos: Cerrado',
                telefonos: [
                    { 
                        numero: '5493813387990', 
                        display: '+54 9 3813 38-7990',
                        nombre: 'Ventas ISENOA',
                        foto: '/vendedores/ventas isenoa.jpeg'
                    },
                    { 
                        numero: '5493816073997', 
                        display: '+54 9 3816 07-3997',
                        nombre: 'Germán Milesi',
                        foto: ''
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
    background: white;
}

.info-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
}

/* Tarjeta Horario */
.horario-card {
    position: relative;
    overflow: hidden;
    background: white;
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05);
}

.horario-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
}

.card-bg {
    display: none;
}

.horario-content {
    position: relative;
    z-index: 1;
}

/* Reloj Lujoso */
.clock-wrapper {
    display: flex;
    justify-content: center;
    perspective: 800px;
}

.clock-frame {
    width: 150px;
    height: 150px;
    position: relative;
    transition: transform 0.3s ease;
}

.clock-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(145deg, #D4A574 0%, #B8860B 30%, #DAA520 50%, #B8860B 70%, #8B7355 100%);
    padding: 8px;
    box-shadow: 
        0 10px 30px rgba(0,0,0,0.3),
        inset 0 2px 4px rgba(255,255,255,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.2);
}

.clock-ring::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 50%;
    background: linear-gradient(145deg, #C4956A, #8B7355);
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
}

.clock-face-luxury {
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    background: #f8f8f8;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
}

.marble-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        linear-gradient(135deg, transparent 40%, rgba(200,200,200,0.1) 50%, transparent 60%),
        linear-gradient(45deg, transparent 40%, rgba(180,180,180,0.08) 50%, transparent 60%),
        radial-gradient(ellipse at 20% 80%, rgba(150,150,150,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(150,150,150,0.05) 0%, transparent 50%);
    background-color: #fafafa;
}

.hour-marks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.hour-mark {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
}

.mark-inner {
    display: block;
    width: 3px;
    height: 12px;
    background: linear-gradient(180deg, #B8860B, #8B7355);
    margin: 6px auto 0;
    border-radius: 2px;
}

.hour-mark:nth-child(3n) .mark-inner {
    width: 4px;
    height: 16px;
    margin-top: 4px;
}

.clock-hands {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
}

.hand-luxury {
    position: absolute;
    left: 50%;
    bottom: 50%;
    transform-origin: bottom center;
    background: linear-gradient(180deg, #B8860B, #8B7355);
    border-radius: 3px;
}

.hour-lux {
    width: 4px;
    height: 35px;
    margin-left: -2px;
    transform: rotate(-30deg);
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

.minute-lux {
    width: 3px;
    height: 48px;
    margin-left: -1.5px;
    transform: rotate(60deg);
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

.center-pin {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    margin: -6px 0 0 -6px;
    background: linear-gradient(145deg, #DAA520, #B8860B);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.chip-horario {
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
    font-size: 14px;
    letter-spacing: 1px;
}

.info-box {
    background: #F5F5F5;
    border-radius: 20px;
    padding: 24px;
}

/* Teléfonos */
/* Teléfonos */
.phone-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 280px;
    margin: 0 auto;
}

.phone-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 16px;
    text-decoration: none;
    color: #37474F;
    background: #F5F5F5;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.2s ease;
    gap: 12px;
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

.phone-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.phone-item .phone-name {
    font-weight: 600;
    font-size: 0.95em;
    color: #333;
    width: auto;
}

.phone-item .phone-text {
    font-size: 0.85em;
    color: #666;
    display: flex;
    align-items: center;
}

/* Reloj 3D azul */
.clock-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.clock-3d {
    position: relative;
    transform: perspective(500px) rotateX(10deg) rotateY(-5deg);
    transition: transform 0.3s ease;
}

.horario-card:hover .clock-3d {
    transform: perspective(500px) rotateX(5deg) rotateY(0deg) scale(1.05);
}

.clock-body {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(145deg, #1E88E5 0%, #1565C0 50%, #0D47A1 100%);
    padding: 8px;
    box-shadow: 
        -8px 8px 20px rgba(0,0,0,0.4),
        inset -4px 4px 10px rgba(255,255,255,0.2),
        inset 4px -4px 10px rgba(0,0,0,0.2),
        0 0 0 8px linear-gradient(145deg, #1976D2, #0D47A1);
    border: 8px solid #1565C0;
    box-sizing: border-box;
}

.clock-face {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(180deg, #2196F3 0%, #1976D2 40%, #1565C0 100%);
    position: relative;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
}

.tick {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
}

.tick::before {
    content: '';
    display: block;
    width: 3px;
    height: 10px;
    background: rgba(255,255,255,0.7);
    margin: 6px auto 0;
    border-radius: 2px;
}

.tick:nth-child(3n)::before {
    width: 4px;
    height: 14px;
    margin-top: 4px;
    background: rgba(255,255,255,0.9);
}

.hand {
    position: absolute;
    left: 50%;
    bottom: 50%;
    background: white;
    border-radius: 4px;
    transform-origin: bottom center;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}

.hand.hour {
    width: 5px;
    height: 35px;
    margin-left: -2.5px;
    transform: rotate(-45deg);
}

.hand.minute {
    width: 4px;
    height: 50px;
    margin-left: -2px;
    transform: rotate(70deg);
}

.center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.clock-shadow {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 20px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%);
    border-radius: 50%;
}
</style>
