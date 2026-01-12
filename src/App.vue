<template>

  <v-app>

    <NavBar></NavBar>

    <NavLeft></NavLeft>

    <v-main>
      <BannerCarousel />
      <router-view />
    </v-main>

    <v-footer padless style="background: transparent !important; box-shadow: none !important;">
      <v-container class="text-center py-4">

        <small style="font-size: 0.8rem; display: block;">
          © 2025 Grupo SER. Todos los derechos reservados.
        </small>

        <small style="font-size: 0.8rem; display: block; margin-top: 4px;">
          Website operado por SER ELECTRONICA Y COMUNICACIONES S.A.S. - CUIT: 30-71854571-0
        </small>

        <small style="font-size: 0.8rem; display: block; margin-top: 4px;">
          <a href="/privacidad" style="text-decoration: none; color: inherit;">
            Política de Privacidad
          </a>
          &nbsp;|&nbsp;
          <a href="/terminos" style="text-decoration: none; color: inherit;">
            Términos y Condiciones
          </a>
        </small>

        <div style="margin-top: 12px;">
          <a 
            href="https://www.instagram.com/grupo.ser_" 
            target="_blank" 
            rel="noopener noreferrer"
            style="margin: 0 8px;"
          >
            <v-icon size="24" color="#E1306C">mdi-instagram</v-icon>
          </a>
          <a 
            href="https://www.facebook.com/profile.php?id=61572534653447" 
            target="_blank" 
            rel="noopener noreferrer"
            style="margin: 0 8px;"
          >
            <v-icon size="24" color="#1877F2">mdi-facebook</v-icon>
          </a>
        </div>

      </v-container>
    </v-footer>

  </v-app>

</template>

<script>

import NavBar from '@/components/NavBar.vue'
import NavLeft from '@/components/NavLeft.vue'
import BannerCarousel from '@/components/BannerCarousel.vue'

export default {
  name: 'App',

  data: () => ({ drawer: true }),

  components: { NavBar, NavLeft, BannerCarousel },
};

</script>
