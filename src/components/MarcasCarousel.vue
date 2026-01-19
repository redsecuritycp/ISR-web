<template>
  <div class="logos-carousel-container">
    <v-sheet 
      color="grey lighten-4" 
      class="py-3 px-2"
      style="border-radius: 8px;"
    >
      <h4 
        class="text-center mb-3 font-weight-medium" 
        style="color: #1565C0; font-size: 0.95rem;"
      >
        MARCAS DESTACADAS
      </h4>
      
      <div class="logos-scroll-wrapper">
        <div class="logos-scroll">
          <div 
            v-for="(marca, index) in marcasDoble" 
            :key="index"
            class="logo-item"
            @click="buscarPorMarca(marca.nombre)"
            :title="marca.nombre"
          >
            <img 
              :src="marca.logo" 
              :alt="marca.nombre"
              class="logo-img"
            />
          </div>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import bus from '../store/bus'

export default {
  name: 'MarcasCarousel',
  
  data() {
    return {
      marcas: [
        { nombre: 'HIKVISION', logo: '/logos/hikvision.png' },
        { nombre: 'AJAX', logo: '/logos/ajax.png' },
        { nombre: 'REYEE', logo: '/logos/reyee.png' },
        { nombre: 'RUIJIE', logo: '/logos/ruijie.png' },
        { nombre: 'DAHUA', logo: '/logos/dahua.png' },
        { nombre: 'ALEAN', logo: '/logos/alean.png' },
        { nombre: 'INTELBRAS', logo: '/logos/intelbras.png' },
        { nombre: 'CYGNUS', logo: '/logos/cygnus.png' },
        { nombre: 'DSC', logo: '/logos/dsc.png' },
        { nombre: 'ZKTECO', logo: '/logos/zkteco.png' },
        { nombre: 'EZVIZ', logo: '/logos/ezviz.png' },
        { nombre: 'IMOU', logo: '/logos/imou.png' },
        { nombre: 'UBIQUITI', logo: '/logos/ubiquiti.png' },
        { nombre: 'HONEYWELL', logo: '/logos/honeywell.png' },
        { nombre: 'BOSCH', logo: '/logos/bosch.png' },
        { nombre: 'PARADOX', logo: '/logos/paradox.png' },
        { nombre: 'EPCOM', logo: '/logos/epcom.png' }
      ]
    }
  },
  
  computed: {
    marcasDoble() {
      return [...this.marcas, ...this.marcas];
    }
  },
  
  methods: {
    buscarPorMarca(nombreMarca) {
      this.$store.state.textSearch = nombreMarca;
      this.$store.state.idCategoria = 0;
      this.$store.state.idMarca = 0;
      bus.$emit('mostrarProductos');
      this.$router.push('/Productos').catch(() => {});
    }
  }
}
</script>

<style scoped>
.logos-carousel-container {
  margin: 8px 0;
  overflow: hidden;
}

.logos-scroll-wrapper {
  overflow: hidden;
  width: 100%;
}

.logos-scroll {
  display: flex;
  gap: 24px;
  animation: scroll-logos 25s linear infinite;
  width: max-content;
  align-items: center;
}

.logos-scroll:hover {
  animation-play-state: paused;
}

.logo-item {
  flex-shrink: 0;
  cursor: pointer;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  min-width: 100px;
}

.logo-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo-img {
  max-height: 45px;
  max-width: 90px;
  width: auto;
  height: auto;
  object-fit: contain;
}

@keyframes scroll-logos {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 600px) {
  .logo-item {
    height: 50px;
    min-width: 80px;
    padding: 6px 10px;
  }
  
  .logo-img {
    max-height: 35px;
    max-width: 70px;
  }
  
  .logos-scroll {
    gap: 16px;
  }
}
</style>
