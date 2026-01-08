import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueAlertify from "vue-alertify";
import VueMoment from "vue-moment";

import "vuetify/dist/vuetify.min.css";
import "./assets/css/select.css";
import "./assets/css/site.css";
import "./assets/css/alertify.css";

// Bootstrap para VUE ===============================================

// Solo habilito <b-form-group> --------------
// import { BFormGroup } from "bootstrap-vue";
// Vue.component("b-form-group", BFormGroup);
// -------------------------------------------

// Habilito bootstrap para vue.
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// ==================================================================

Vue.use(VueAlertify);
Vue.use(VueMoment);

Vue.config.productionTip = false;

// Filter formato de importe con signo adelante.
Vue.filter("CurrencyWithSign", function (value) {
  if (!value) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
});

// Filter formato de importe sin signo adelante.
Vue.filter("UnsignedCurrency", function (valor) {
  if (!valor) return "";
  return valor.toLocaleString("es-AR", { minimumFractionDigits: 2 });
});

// Bus de evento que permite ser llamado desde otro componente.
export const eventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
