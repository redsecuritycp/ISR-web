<template>
    <v-container>
        <Overlay :show="overlay" />

        <v-card :loading="overlay">
            <v-card-title>Usuarios pendientes de registrar</v-card-title>

            <v-data-table :headers="headers" :items="Items" class="elevation-1" :items-per-page="10" dense>
                <template v-slot:item.fecha="{ item }">
                    {{ formatDate(item.fecha) }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2" color="success" tile @click="accept(item)">Aceptar</v-btn>
                    <v-btn x-small class="mr-2" color="error" tile @click="reject(item)">Rechazar</v-btn>
                </template>
            </v-data-table>
        </v-card>

    </v-container>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import Overlay from './Overlay.vue';

export default {
    namespaced: true,

    name: 'ManageUsersComponent',

    props: ['items'],

    data: () => ({
        overlay: true,
        headers: [
            { text: 'Id', value: 'id', align: ' d-none' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'E-mail', value: 'email' },
            { text: 'Teléfono', value: 'telefono' },
            { text: 'CUIT', value: 'cuit' },
            { text: 'Fecha', value: 'fecha' },
            { text: '', value: 'actions', sortable: false },

        ],
        editedIndex: -1,
        editedItem: {
            nombre: '',
            email: '',
            telefono: '',
            cuit: '',
            fecha: '',
        },
        Items: [],
    }),

    created() {
        this.consUsuariosPR();
    },

    methods: {

        accept(value) {
            this.$alertify.confirmWithTitle('Atención',
                '¿Desea aceptar la solicitud de <strong>' + value.nombre + '</strong>?',
                () => {
                    this.acceptUser(value.email);
                },
            );
        },

        reject(value) {
            this.$alertify.confirmWithTitle('Atención',
                '¿Desea rechazar la solicitud de <strong>' + value.nombre + '</strong>?',
                () => {
                    this.rejectUser(value.id);
                },
            );
        },

        formatDate: function (value) {
            if (!value) return '';

            const moment = require('moment');
            return moment(value).format('DD/MM/yyyy HH:mm:ss');
        },

        consUsuariosPR: async function () {
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

        async acceptUser(value) {
            this.overlay = true;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: value })
            };
            const result = await (fetch(this.$store.state.urlService + "/Usuarios/AcceptUser", requestOptions)
                .then(response => response.json()));
            if (result.messages.length > 0) {
                this.messageError = result.messages[0].text;
            }
            else {
                this.consUsuariosPR();
                this.$alertify.success('Solicitud aceptada')
            }
            this.overlay = false;
        },

        async rejectUser(value) {
            this.overlay = true;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id: value })
            };
            const result = await (fetch(this.$store.state.urlService + "/Usuarios/RejectUser", requestOptions)
                .then(response => response.json()));
            if (result.messages.length > 0) {
                this.messageError = result.messages[0].text;
            }
            else {
                this.consUsuariosPR();
                this.$alertify.error('Solicitud rechazada ')
            }
            this.overlay = false;
        }



    },

    comments: {
        ...mapGetters('usuarios', ['Items'])
    },
    components: { Overlay }
}
</script>