<template>

  <v-app>

    <NavBar></NavBar>

    <NavLeft></NavLeft>

    <v-main>
      <router-view />
    </v-main>

    <v-footer padless class="d-flex justify-center mt-6" style="background: transparent !important; box-shadow:none;">
      <v-container class="text-center py-4">

        <small style="font-size: 0.8rem; display:block;">
          © 2025 Grupo SER. Todos los derechos reservados.
        </small>

        <small style="font-size: 0.8rem; display:block; margin-top:4px;">
          Website operado por SER ELECTRONICA Y COMUNICACIONES S.A.S. - CUIT: 30-71854571-0
        </small>

        <small style="font-size: 0.8rem; display:block; margin-top:4px;">
          <a href="/privacidad" style="text-decoration: none; color: inherit">
            Política de Privacidad
          </a>
          &nbsp;|&nbsp;
          <a href="/terminos" style="text-decoration: none; color: inherit">
            Términos y Condiciones
          </a>
        </small>

      </v-container>
    </v-footer>

  </v-app>

</template>

<script>

import NavBar from '@/components/NavBar.vue'
import NavLeft from '@/components/NavLeft.vue'

export default {
  name: 'App',

  data: () => ({ drawer: true }),

  components: { NavBar, NavLeft },
};

</script>
