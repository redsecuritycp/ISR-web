<template>
  <div class="banner-carousel-container">
    <v-carousel
      cycle
      hide-delimiter-background
      show-arrows-on-hover
      :interval="5000"
      class="banner-carousel"
      height="220"
    >
      <v-carousel-item
        v-for="(banner, i) in banners"
        :key="i"
      >
        <v-img
          :src="banner.imagen"
          height="220"
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
      banners: [
        { imagen: '/banners/1.png' },
        { imagen: '/banners/2.png' }
      ]
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

@media (max-width: 600px) {
  .banner-carousel-container {
    height: 150px;
  }
  
  .banner-carousel {
    height: 150px !important;
  }
}
</style>
