import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Productos from "../views/Productos.vue";
import ManageUsers from "../views/ManageUsers.vue";
import PoliticaPrivacidad from "@/views/PoliticaPrivacidad.vue";
import TerminosCondiciones from "@/views/TerminosCondiciones.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/productos",
    name: "productos",
    component: Productos,
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/manageUsers",
    name: "manageUsers",
    component: ManageUsers,
  },
  {
    path: "/privacidad",
    name: "privacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/terminos",
    name: "terminos",
    component: TerminosCondiciones,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
