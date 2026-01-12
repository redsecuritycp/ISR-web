<template>
  <v-carousel
    v-if="banners.length > 0"
    cycle
    height="120"
    hide-delimiter-background
    show-arrows-on-hover
    class="banner-carousel"
  >
    <v-carousel-item
      v-for="(banner, i) in banners"
      :key="i"
      @click="goToLink(banner.link)"
      style="cursor: pointer;"
    >
      <v-sheet
        :color="banner.bgColor || '#1976D2'"
        height="100%"
        class="d-flex align-center justify-center"
      >
        <div class="d-flex align-center justify-center text-center px-4">
          <v-icon 
            v-if="banner.icon" 
            dark 
            size="40" 
            class="mr-4"
          >
            {{ banner.icon }}
          </v-icon>
          <div>
            <h2 
              class="white--text font-weight-bold" 
              style="font-size: 1.5rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.3);"
            >
              {{ banner.titulo }}
            </h2>
            <p 
              v-if="banner.subtitulo" 
              class="white--text mb-0 mt-1" 
              style="font-size: 0.95rem;"
            >
              {{ banner.subtitulo }}
            </p>
          </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name: 'BannerCarousel',
  
  data() {
    return {
      // ========================================
      // EDITAR ACÁ PARA CAMBIAR LAS PUBLICIDADES
      // ========================================
      banners: [
        {
          titulo: '🔥 OFERTAS AJAX 20% OFF',
          subtitulo: 'Alarmas y sensores de última generación',
          link: '/productos',
          bgColor: '#E53935',
          icon: 'mdi-shield-home'
        },
        {
          titulo: '📹 CÁMARAS DAHUA',
          subtitulo: 'La mejor calidad en videovigilancia',
          link: '/productos',
          bgColor: '#1976D2',
          icon: 'mdi-cctv'
        },
        {
          titulo: '⚡ HIKVISION EN STOCK',
          subtitulo: 'Entrega inmediata - Consulte precios',
          link: '/productos',
          bgColor: '#388E3C',
          icon: 'mdi-video'
        }
      ]
    }
  },

  methods: {
    goToLink(link) {
      if (link) {
        this.$router.push(link).catch(() => {});
      }
    }
  }
}
</script>

<style scoped>
.banner-carousel {
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.banner-carousel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
