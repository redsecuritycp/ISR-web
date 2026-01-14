<template>

  <v-app>

    <NavBar></NavBar>

    <NavLeft></NavLeft>

    <v-main>
      <BannerCarousel />
      <MarcasCarousel />
      <router-view />
    </v-main>

    <v-footer 
      padless 
      class="mt-6" 
      style="background: transparent !important; box-shadow: none;"
    >
      <div 
        class="footer-center-content"
        :style="{ marginLeft: footerOffset + 'px' }"
      >
        <small>
          © 2025 Grupo SER. Todos los derechos reservados.
        </small>
        <small>
          Website operado por SER ELECTRONICA Y COMUNICACIONES 
          S.A.S. - CUIT: 30-71854571-0
        </small>
        <small>
          <a href="/privacidad">Política de Privacidad</a>
          &nbsp;|&nbsp;
          <a href="/terminos">Términos y Condiciones</a>
        </small>
        <div class="footer-social">
          <a href="https://instagram.com" target="_blank">
            <v-icon color="#E1306C" size="20">
              mdi-instagram
            </v-icon>
          </a>
          <a href="https://facebook.com" target="_blank">
            <v-icon color="#1877F2" size="20">
              mdi-facebook
            </v-icon>
          </a>
        </div>
      </div>
    </v-footer>

  </v-app>

</template>

<script>

import NavBar from '@/components/NavBar.vue'
import NavLeft from '@/components/NavLeft.vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import MarcasCarousel from '@/components/MarcasCarousel.vue'

export default {
  name: 'App',

  data: () => ({ 
    drawer: true,
    footerOffset: 0
  }),

  mounted() {
    this.calcularFooterOffset();
    window.addEventListener('resize', this.calcularFooterOffset);
    
    // Observar cambios en el drawer
    const observer = new MutationObserver(() => {
      this.calcularFooterOffset();
    });
    
    this.$nextTick(() => {
      const drawer = document.querySelector('.v-navigation-drawer');
      if (drawer) {
        observer.observe(drawer, { 
          attributes: true, 
          attributeFilter: ['class', 'style'] 
        });
      }
    });
  },

  methods: {
    calcularFooterOffset() {
      const drawer = document.querySelector('.v-navigation-drawer');
      if (drawer) {
        const drawerWidth = drawer.offsetWidth;
        const isOpen = !drawer.classList.contains('v-navigation-drawer--close');
        this.footerOffset = isOpen ? drawerWidth / 2 : 0;
      }
    }
  },

  components: { NavBar, NavLeft, BannerCarousel, MarcasCarousel },
};

</script>

<style>
.footer-center-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 4px;
  transition: margin-left 0.2s ease;
}

.footer-center-content small {
  font-size: 0.8rem;
  text-align: center;
}

.footer-center-content a {
  text-decoration: none;
  color: inherit;
}

.footer-center-content a:hover {
  text-decoration: underline;
}

.footer-social {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>
