<template>
    <v-dialog v-model="dialog" max-width="400" persistent>
        <template v-slot:activator="{ on }">

            <v-btn v-on="on" outlined rounded text block>
                Cambiar contraseña
            </v-btn>

        </template>

        <v-card tile>

            <v-card-title class="text-h5 justify-center">Cambiar contraseña</v-card-title>

            <v-form ref="form">

                <v-card-text class="pb-0">
                    <v-text-field label="Contraseña actual" v-model="password" :rules="[rules.required]" outlined
                        counter="10" maxlength="10" :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword" dense></v-text-field>
                </v-card-text>

                <v-card-text class="pt-0">
                    <v-text-field label="Nueva contraseña" v-model="newPassword"
                        :rules="[rules.required, rules.validateCharacter, rules.minPasswordLength, rules.passwordFormat]"
                        outlined counter="10" maxlength="10" :type="showNewPassword ? 'text' : 'password'"
                        :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showNewPassword = !showNewPassword" dense></v-text-field>

                    <v-text-field label="Confirmar contraseña" v-model="confirmPassword"
                        :rules="[rules.required, rules.validateCharacter, rules.minPasswordLength, rules.passwordFormat]"
                        outlined counter="10" maxlength="10" :type="showRepeatNewPassword ? 'text' : 'password'"
                        :append-icon="showRepeatNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showRepeatNewPassword = !showRepeatNewPassword" dense>
                    </v-text-field>

                    <v-alert v-if="this.messageError.length > 0" :type="messageType">
                        {{ this.messageError }}
                    </v-alert>

                    <v-alert text color="info" dense class="mt-4 text-sm-body-2 font-weight-regular" outlined
                        border="right">
                        <span>
                            La contraseña debe tener entre 4 y 10 caracteres, al menos uno debe ser una letra en
                            minúscula o
                            mayúscula, o un número y puede contener alguno de los siguientes caracteres especiales
                            @#!$%&*?_- <br>Ejemplos:<strong>4HB0Ls@3x#</strong> / <strong>s7LuPS0Cb5</strong>
                        </span>
                    </v-alert>

                </v-card-text>

            </v-form>

            <v-card-actions>
                <v-btn outlined rounded text color="primary" :loading="loading" @click="aceptar()">
                    Aceptar
                </v-btn>
                <v-btn outlined rounded text color="secundary" @click="cancelar()">
                    Cancelar
                </v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>

</template>

<script>

export default {

    name: "ResetPasswordComponent",

    data: () => ({
        dialog: false,
        loading: false,
        password: '',
        newPassword: '',
        confirmPassword: '',
        showPassword: false,
        showNewPassword: false,
        showRepeatNewPassword: false,
        messageError: '',
        messageType: '',
        rules: {
            required: value => !!value || '*Campo obligatorio.',
            minPasswordLength: value => (value && value.length >= 4) || '*Contraseña debe tener más de 4 caracteres.',
            passwordFormat: value => {
                const pattern = /^(((?=.*[a-z])|(?=.*[A-Z]))|(?=.*\d))(?!\s)[a-zA-Z\d@#!$%&*?_\-ñÑ]{4,10}$/
                return pattern.test(value) || 'Formato de contraseña no válido.'
            },
            validateCharacter: value => {
                const pattern = /^[0-9A-Za-z@#!$%&*?_\-ñÑ]+$/;
                return pattern.test(value) || '*Caracter no permitido.';
            },
        }
    }),

    methods: {
        async aceptar() {
            if (this.$refs.form.validate()) {
                try {
                    this.loading = true;
                    this.messageError = '';
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: localStorage.getItem('emailUsuario'), password: this.password, newPassword: this.newPassword, confirmPassword: this.confirmPassword })
                    };
                    const result = await fetch(this.$store.state.urlService + "/Usuarios/UpdatePassword", requestOptions)
                        .then(response => response.json());

                    if (result.messages.length > 0) {
                        this.messageError = result.messages[0].text;
                        this.messageType = result.messages[0].statusDescription;
                    }
                    else {
                        this.dialog = false;
                        this.goTo('/');
                    }
                }
                catch (error) {
                    console.log(error);
                }
                this.loading = false;
            }
        },

        cancelar() {
            this.$refs.form.reset();
            this.loading = false;
            this.dialog = false;
        },

        // Método para usar de la siguiente manera: <v-text-field ....  @keypress="isNumber($event)"</v-text-field>
        // isNumber: function (evt) {
        //     evt = (evt) ? evt : window.event;
        //     var charCode = (evt.which) ? evt.which : evt.keyCode;
        //     console.log(evt.key + ' ' + this.password);
        //     if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        //         evt.preventDefault();;
        //     } else {
        //         return true;
        //     }
        // },

        goTo(ruta) {
            this.$router.push(ruta).catch(() => { });
        },
    },

    computed: {
        comparePasswords() {
            if (this.newPassword != this.confirmPassword) {
                return 'Las contraseñas deben coincidir.'
            }
            return true
        },
    }
}

</script>