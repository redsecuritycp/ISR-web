<template>
  <div class="marcas-carousel-container">
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
      
      <div class="marcas-scroll-wrapper">
        <div class="marcas-scroll">
          <div 
            v-for="(marca, index) in marcasDoble" 
            :key="index"
            class="marca-item"
            @click="buscarPorMarca(marca.nombre)"
          >
            <v-chip
              :color="marca.color"
              :text-color="marca.textColor"
              class="marca-chip font-weight-bold"
              style="cursor: pointer;"
            >
              {{ marca.nombre }}
            </v-chip>
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
        { 
          nombre: 'HIKVISION', 
          color: '#E53935', 
          textColor: 'white' 
        },
        { 
          nombre: 'DAHUA', 
          color: '#1565C0', 
          textColor: 'white' 
        },
        { 
          nombre: 'AJAX', 
          color: '#212121', 
          textColor: 'white' 
        },
        { 
          nombre: 'UBIQUITI', 
          color: '#0559C9', 
          textColor: 'white' 
        },
        { 
          nombre: 'TP-LINK', 
          color: '#4CAF50', 
          textColor: 'white' 
        },
        { 
          nombre: 'ZKTECO', 
          color: '#00897B', 
          textColor: 'white' 
        },
        { 
          nombre: 'MIKROTIK', 
          color: '#37474F', 
          textColor: 'white' 
        },
        { 
          nombre: 'EZVIZ', 
          color: '#FF6F00', 
          textColor: 'white' 
        },
        { 
          nombre: 'HONEYWELL', 
          color: '#D32F2F', 
          textColor: 'white' 
        },
        { 
          nombre: 'BOSCH', 
          color: '#C62828', 
          textColor: 'white' 
        },
        { 
          nombre: 'DSC', 
          color: '#1976D2', 
          textColor: 'white' 
        },
        { 
          nombre: 'PARADOX', 
          color: '#6A1B9A', 
          textColor: 'white' 
        },
        { 
          nombre: 'EPCOM', 
          color: '#F57C00', 
          textColor: 'white' 
        },
        { 
          nombre: 'ALEAN', 
          color: '#2E7D32', 
          textColor: 'white' 
        }
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
.marcas-carousel-container {
  margin: 8px 0;
  overflow: hidden;
}

.marcas-scroll-wrapper {
  overflow: hidden;
  width: 100%;
}

.marcas-scroll {
  display: flex;
  gap: 12px;
  animation: scroll-marcas 20s linear infinite;
  width: max-content;
}

.marcas-scroll:hover {
  animation-play-state: paused;
}

.marca-item {
  flex-shrink: 0;
}

.marca-chip {
  font-size: 0.85rem !important;
  height: 32px !important;
  padding: 0 16px !important;
  transition: all 0.3s ease;
}

.marca-chip:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

@keyframes scroll-marcas {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 600px) {
  .marca-chip {
    font-size: 0.75rem !important;
    height: 28px !important;
    padding: 0 12px !important;
  }
}
</style>
