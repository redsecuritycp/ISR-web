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
    idOrden: 5,
    textSearch: "",
    cantUsersPR: 0,
    mensaje: "",
    itemsSucursales: [],
    idSucursal: 2,
    itemsPresupuesto: JSON.parse(
      localStorage.getItem("itemsPresupuesto") || "[]"
    ),
    logoCliente: localStorage.getItem("logoCliente") || "",
    vendedorSeleccionado: localStorage.getItem("vendedorSeleccionado") || "",
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
    addItemPresupuesto(state, item) {
      const existe = state.itemsPresupuesto.find(
        (i) => i.id === item.id
      );
      if (existe) {
        existe.cantidad++;
      } else {
        state.itemsPresupuesto.push({ ...item, cantidad: 1 });
      }
      localStorage.setItem(
        "itemsPresupuesto",
        JSON.stringify(state.itemsPresupuesto)
      );
    },
    removeItemPresupuesto(state, id) {
      state.itemsPresupuesto = state.itemsPresupuesto.filter(
        (i) => i.id !== id
      );
      localStorage.setItem(
        "itemsPresupuesto",
        JSON.stringify(state.itemsPresupuesto)
      );
    },
    updateCantidadPresupuesto(state, { id, cantidad }) {
      const item = state.itemsPresupuesto.find((i) => i.id === id);
      if (item) {
        item.cantidad = cantidad;
        localStorage.setItem(
          "itemsPresupuesto",
          JSON.stringify(state.itemsPresupuesto)
        );
      }
    },
    clearPresupuesto(state) {
      state.itemsPresupuesto = [];
      localStorage.removeItem("itemsPresupuesto");
    },
    setLogoCliente(state, logo) {
      state.logoCliente = logo;
      localStorage.setItem("logoCliente", logo);
    },
    setVendedorSeleccionado(state, vendedor) {
      state.vendedorSeleccionado = vendedor;
      localStorage.setItem("vendedorSeleccionado", vendedor);
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
