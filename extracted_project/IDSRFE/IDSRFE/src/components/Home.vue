<template>

    <v-container>
        <v-row class="text-center">

            <v-col cols="12">
                <v-img :src="require('../assets/img/IDSRLogo.svg')" class="my-3" contain height="200" />
            </v-col>

            <v-col class="mb-4">
                <h1 class="display-2 font-weight-bold mb-3">
                    Bienvenido a
                </h1>
                <h1 class="display-2 font-weight-bold mb-3">Insumos de Seguridad Rosario</h1>

                <p class="subheading font-weight-regular">
                    Omar carrasco 2773 ( ex Richieri), Rosario, Santa Fe, República Argentina
                    <br>Código Postal: S2000QDP
                    <br>
                    <br><strong>Horario de atención:</strong> Lunes a Viernes de 08:00 hs a 17:00 hs.
                    <br>
                    <br><strong>Teléfonos</strong>
                    <br>341 356-6461
                    <br>341 338-9611
                    <br>341 552-0646
                    <br>341 754-4843
                </p>
            </v-col>

        </v-row>

    </v-container>

</template>

<script>

export default {
    name: 'HomeComponent',

    data: () => ({
    }),
}

</script>