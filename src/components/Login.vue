<template>
    <div>
        <!-- Login -->
        <v-dialog v-model="dialog" persistent max-width="400">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" outlined rounded text>
                    Iniciar sesion
                </v-btn>
            </template>
            <v-card :loading="loading">
                <v-card-title class="text-h5 justify-center">Iniciar sesión</v-card-title>
                <v-form ref="form">
                    <v-card-text class="pb-0">

                        <v-text-field class="pb-2" label="E-mail" v-model="email" :rules="[rules.required, rules.email]"
                            outlined counter="50" maxlength="50" dense>
                        </v-text-field>
                        <v-text-field label="Contraseña" v-model="password" :rules="[rules.required]" outlined
                            counter="20" maxlength="20" :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword" dense>
                        </v-text-field>

                        <v-row class="pt-2">
                            <v-col class="text-lg-left">
                                <!-- <a href="#" class="text-decoration-none font-weight-bold black--text">REGISTRARME</a> -->
                            </v-col>
                            <v-col class="text-lg-right">
                                <v-btn text rounded class="text-none font-weight-regular" @click="showResetPassword()">
                                    Olvidé mi contraseña
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-alert v-if="this.messageError.length > 0" type="error" class="mt-4">
                            {{ this.messageError }}
                        </v-alert>
                    </v-card-text>
                </v-form>
                <v-card-actions class="mt-8">
                    <v-btn outlined rounded text color="primary" @click="login()">
                        Ingresar
                    </v-btn>
                    <v-btn outlined rounded text color="secundary" @click="closeDialog()">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Restablecer contraseña -->
        <v-dialog v-model="dialogResetPass" persistent max-width="400">
            <v-card :loading="loading">
                <v-card-title class="text-h5 justify-center">¿Olvidaste tu contraseña?</v-card-title>
                <v-card-subtitle class="mt-1 text-center"> Ingresa el e-mail con el que te registraste para
                    restablecerla.
                </v-card-subtitle>
                <v-form ref="formResetPassword">
                    <v-card-text class="pb-0">
                        <v-text-field ref="email" label="E-mail" v-model="emailResetPassword"
                            :rules="[rules.required, rules.emailResetPassword]" outlined counter="50" maxlength="50"
                            dense>
                        </v-text-field>
                        <v-alert v-if="this.messageError.length > 0" type="error" class="mt-4">
                            {{ this.messageError }}
                        </v-alert>
                    </v-card-text>
                </v-form>
                <v-card-actions class="mt-4">
                    <v-btn outlined rounded text color="primary" @click="resetPassword()"
                        :disabled="btnResetPasswordDisabled">
                        Enviar
                    </v-btn>
                    <v-btn outlined rounded text olor="secundary" @click="closeDialogResetPassword()">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Mensaje contraseña restablecida -->
        <v-dialog v-model="dialogResetPassResult" persistent width="500">
            <v-card>
                <v-card-title class="text-h5">
                    Resestablecer contraseña
                </v-card-title>

                <v-card-text>
                    A la brevedad recibirás un correo electrónico con con tu nueva contraseña.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined rounded text color="primary" @click="dialogResetPassResult = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

export default {
    name: 'LoginComponent',

    data: () => ({
        showPassword: false,
        loading: false,
        email: '',
        emailResetPassword: '',
        password: '',
        messageError: '',
        dialog: false,
        rules: {
            required: value => !!value || 'Campo obligatorio.',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Correo electrónico no válido.'
            },
            emailResetPassword: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Correo electrónico no válido.'
            },
        },
        dialogResetPass: false,
        btnResetPasswordDisabled: false,
        dialogResetPassResult: false
    }),

    methods: {
        closeDialog() {
            this.$refs.form.reset();
            this.messageError = '';
            this.loading = false;
            this.dialog = false;
        },

        async login() {
            if (this.$refs.form.validate()) {
                this.loading = true;
                this.messageError = '';
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password })
                };
                const result = await fetch(this.$store.state.urlService + "/Usuarios/Login", requestOptions)
                    .then(response => response.json());
                if (result.messages.length > 0) {
                    this.messageError = result.messages[0].text;
                }
                else {
                    this.$store.state.usuario = result.nombre;
                    localStorage.setItem('usuario', result.nombre)
                    this.$store.state.emailUsuario = result.email;
                    localStorage.setItem('emailUsuario', result.email)
                    if (result.admin == true) {
                        this.$store.state.adminUser = "s";
                        localStorage.setItem('admin', "s")
                    }
                    else {
                        this.$store.state.adminUser = "";
                        localStorage.setItem('admin', "")
                    }
                    this.$store.state.usuarioId = result.id;
                    localStorage.setItem('usuarioId', result.id)
                    this.consUsersPR();
                    this.closeDialog();
                    this.goTo('/');
                }
                this.loading = false;
            }
        },

        goTo(ruta) {
            this.$router.push(ruta).catch(() => { });
        },

        showResetPassword() {
            this.messageError = '';
            this.dialogResetPass = true;
            this.dialog = false;
        },

        closeDialogResetPassword() {
            this.messageError = '';
            this.loading = false;
            this.dialog = false;
            this.$refs.formResetPassword.reset();
            this.dialogResetPass = false;
        },

        async resetPassword() {
            if (this.emailResetPassword.length > 0) {
                this.loading = true;
                this.btnResetPasswordDisabled = true;
                this.messageError = '';
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.emailResetPassword })
                };
                const result = await fetch(this.$store.state.urlService + "/Usuarios/ResetPassword", requestOptions)
                    .then(response => response.json());
                if (result.messages.length > 0) {
                    this.messageError = result.messages[0].text;
                }
                else {
                    this.dialogResetPassResult = true;
                    this.closeDialogResetPassword();
                    this.goTo('/');
                }
                this.btnResetPasswordDisabled = false;
                this.loading = false;
            }
        },

        // Se repite en NavBar. Unificar en un js solo.
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
    },
}
</script>