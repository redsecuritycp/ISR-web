import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    urlService: "https://seguridadrosario.com/IDSRBE",
    //urlService: "https://localhost:7039",
    usuario: localStorage.getItem("usuario")
      ? localStorage.getItem("usuario")
      : "",
    emailUsuario: localStorage.getItem("emailUsuario")
      ? localStorage.getItem("emailUsuario")
      : "",
    adminUser: localStorage.getItem("admin")
      ? localStorage.getItem("admin")
      : false,
    usuarioId: localStorage.getItem("usuarioId")
      ? localStorage.getItem("usuarioId")
      : 0,
    itemsProductos: [],
    itemsMarcasOriginal: [],
    itemsMarcas: [],
    idMarca: 0,
    itemsCategorias: [],
    idCategoria: 0,
    idOrden: 0,
    textSearch: "",
    cantUsersPR: 0,
    mensaje: "",
    itemsSucursales: [],
    idSucursal: 2,
  },

  getters: {},

  mutations: {
    setMensaje(state, payLoad) {
      state.mensaje = payLoad;
    },
    setItemsProductos(state, productos) {
      state.itemsProductos = productos;
    },
    setItemsMarcas(state, marcas) {
      state.itemsMarcas = marcas;
    },
    setItemsMarcas(state, marcas) {
      state.itemsMarcas = marcas;
    },
    setIdMarca(state, id) {
      state.idMarca = id;
    },
    setIdCategoria(state, id) {
      state.idCategoria = id;
    },
  },

  actions: {
    mensajear({ commit }, mensajito) {
      console.log(mensajito);
      alert(mensajito);
    },
  },

  modules: {},
});
