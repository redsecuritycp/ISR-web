<template>
    <v-container class="py-8">
        <v-row justify="center" class="text-center">
            <v-col cols="12">
                <v-img 
                    :src="require('../assets/img/IDSRLogo.svg')" 
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
                    Insumos de Seguridad Rosario
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
                            Omar Carrasco 2773
                        </p>
                        <p class="text-body-2 grey--text mb-1">
                            (ex Richieri)
                        </p>
                        <p class="text-body-1 mb-1">
                            Rosario, Santa Fe
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
                            CP: S2000QDP
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
                            Lunes a Viernes
                        </p>
                        <v-chip 
                            color="success" 
                            dark
                            class="font-weight-bold px-4"
                        >
                            <v-icon small left>mdi-clock</v-icon>
                            08:00 - 17:00 hs
                        </v-chip>
                        <p class="text-body-2 grey--text mt-4 mb-0">
                            Sábados, Domingos y Feriados: Cerrado
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
                                href="tel:+5493417479394" 
                                class="phone-item"
                            >
                                <v-icon color="info" small class="mr-2">
                                    mdi-phone
                                </v-icon>
                                +54 9 3417 47-9394
                            </a>
                            <a 
                                href="tel:+5493413566461" 
                                class="phone-item"
                            >
                                <v-icon color="info" small class="mr-2">
                                    mdi-phone
                                </v-icon>
                                +54 9 341 356-6461
                            </a>
                            <a 
                                href="tel:+5493413389611" 
                                class="phone-item"
                            >
                                <v-icon color="info" small class="mr-2">
                                    mdi-phone
                                </v-icon>
                                +54 9 341 338-9611
                            </a>
                            <a 
                                href="tel:+5493415520646" 
                                class="phone-item"
                            >
                                <v-icon color="info" small class="mr-2">
                                    mdi-phone
                                </v-icon>
                                +54 9 341 552-0646
                            </a>
                            <a 
                                href="tel:+5493417544843" 
                                class="phone-item"
                            >
                                <v-icon color="info" small class="mr-2">
                                    mdi-phone
                                </v-icon>
                                +54 9 341 754-4843
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
    data: () => ({}),
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
    padding: 10px 16px;
    text-decoration: none;
    color: #37474F;
    background: #F5F5F5;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.phone-item:hover {
    background: #E3F2FD;
    color: #1976D2;
    transform: scale(1.02);
}
</style>
