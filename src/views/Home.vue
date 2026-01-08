<template>
  <Home />
  <!-- <MaintenancePage></MaintenancePage> -->
</template>

<script>
import Home from '@/components/Home.vue';
import MaintenancePage from '@/components/MaintenancePage.vue';

export default {
  name: 'HomeView',

  data: () => ({}),

  components: { Home, MaintenancePage }
}

</script>
