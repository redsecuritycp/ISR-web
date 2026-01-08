<template>
    <div>
        <!-- Registrarme -->
        <v-dialog v-model="dialog" persistent max-width="450">

            <template v-slot:activator="{ on }">
                <v-btn v-on="on" outlined rounded text>
                    Registrarme
                </v-btn>
            </template>

            <v-card :loading="loading">

                <v-card-title class="text-h5 justify-center">Registrarme</v-card-title>

                <v-card-subtitle class="mt-1 text-center">Completá el formulario para poder operar con nosotros. Al
                    finalizar, recibirás un correo electrónico con los pasos a seguir.
                </v-card-subtitle>

                <v-form ref="form">
                    <v-card-text>
                        <v-text-field ref="email" label="Email" v-model="email" :rules="[rules.required, rules.email]"
                            outlined counter="50" maxlength="50" dense></v-text-field>
                        <v-text-field ref="nombre" label="Nombre y Apellido o Razón Social" v-model="nombre" outlined
                            dense counter="50" maxlength="50" :rules="[rules.required, rules.minLength]">
                        </v-text-field>
                        <v-text-field ref="telefono" label="Teléfono" v-model="telefono" outlined dense counter="20"
                            maxlength="20" :rules="[rules.required, rules.number, rules.minLength]">
                        </v-text-field>
                        <v-text-field ref="cuit" label="CUIT" v-model="cuit" outlined dense counter="11" maxlength="11"
                            :rules="[rules.required, rules.number, rules.minCUITLength]">
                        </v-text-field>
                        <v-alert v-if="this.messageError.length > 0" type="error" class="mt-4">
                            {{ this.messageError }}
                        </v-alert>
                    </v-card-text>
                </v-form>

                <v-card-actions class="mt-4">
                    <v-btn outlined rounded text color="primary" @click="registerUser()" :disabled="disabledBtnAceptar">
                        Aceptar
                    </v-btn>
                    <v-btn outlined rounded text color="secundary" @click="closeDialog()"
                        :disabled="disabledBtnCancelar">
                        Cancelar
                    </v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>

        <!-- Mensaje -->
        <v-dialog v-model="dialog2" persistent width="500">
            <v-card>
                <v-card-title class="text-h4">
                    ¡Gracias por elegirnos!
                </v-card-title>

                <v-card-text>
                    A la brevedad recibirá un correo electrónico con los pasos a seguir.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined rounded text color="primary" @click="dialog2 = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
export default {

    name: "RegisterUserComponent",

    data: () => ({
        dialog: false,
        dialog2: false,
        loading: false,
        email: '',
        nombre: '',
        apellido: '',
        telefono: '',
        cuit: '',
        messageError: '',
        disabledBtnAceptar: false,
        disabledBtnCancelar: false,
        rules: {
            required: value => !!value || 'Campo obligatorio',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Correo electrónico no válido'
            },
            number: value => {
                const pattern = /^[0-9]+$/
                return pattern.test(value) || 'Solo números'
            },
            minCUITLength: v => (v && v.length == 11) || 'Debe tener 11 caracteres',
            minLength: v => (v && v.length > 3) || 'Debe tener más de 3 caracteres',
        },
    }),

    methods: {

        closeDialog() {
            this.$refs.form.reset();
            this.messageError = '';
            this.loading = false;
            this.dialog = false;
        },

        closeDialogRegister() {
            this.$refs.form.reset();
            this.messageError = '';
            this.loading = false;
            this.dialog2 = false;
        },


        // Meótod para usar de la siguiente manera: <v-text-field ....  @keypress="isNumber($event)"</v-text-field>
        isNumber: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },

        async registerUser() {
            if (this.$refs.form.validate()) {
                this.disabledBtnAceptar = true;
                this.disabledBtnCancelar = true;
                this.loading = true;
                this.messageError = '';
                let tel = this.telefono.replace(/^0+/, '');
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email: this.email, Nombre: this.nombre, Telefono: tel, CUIT: this.cuit })
                };
                const result = await fetch(this.$store.state.urlService + "/Usuarios/RegisterUser", requestOptions)
                    .then(response => response.json());
                if (result.messages.length > 0) {
                    this.messageError = result.messages[0].text;
                }
                else {
                    this.dialog2 = true;
                    this.closeDialog();
                }
                this.disabledBtnAceptar = false;
                this.disabledBtnCancelar = false;
                this.loading = false;
            }

        }
    }
}
</script>