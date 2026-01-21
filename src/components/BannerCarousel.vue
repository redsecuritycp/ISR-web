<template>
  <div class="banner-carousel-container">
    <v-carousel
      cycle
      hide-delimiter-background
      show-arrows-on-hover
      :interval="5000"
      class="banner-carousel"
      :height="carouselHeight"
    >
      <v-carousel-item
        v-for="(banner, i) in banners"
        :key="i"
      >
        <v-img
          :src="banner.imagen"
          :height="carouselHeight"
          cover
          class="banner-img"
        ></v-img>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'BannerCarousel',
  
  data() {
    return {
      bannersDesktop: [
        { imagen: '/banners/1.png' },
        { imagen: '/banners/2.png' },
        { imagen: '/banners/3.png' }
      ],
      bannersMobile: [
        { imagen: '/banners/1m.png' },
        { imagen: '/banners/2m.png' },
        { imagen: '/banners/3m.png' }
      ],
      isMobile: false
    }
  },
  
  computed: {
    banners() {
      return this.isMobile ? this.bannersMobile : this.bannersDesktop;
    },
    carouselHeight() {
      return this.isMobile ? 180 : 300;
    }
  },
  
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 600;
    }
  }
}
</script>

<style scoped>
.banner-carousel-container {
  width: 100%;
  background: #1a1a2e;
}

.banner-carousel {
  border-radius: 0;
}

.banner-img {
  background: #1a1a2e;
}
</style>
