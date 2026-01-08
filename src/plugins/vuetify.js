import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#2368BD", //"#007BFF",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        light_blue_darken_3: "#0277BD",
        blue_darken_3: "#546E7A",
        green_darken_3: "#2E7D32",
        grey_darken_2: "#616161",
        grey_darken_3: "#424242",
        grey_darken_4: "#212121",
        black: colors.black,
        navLeft: "#343A40",
      },
    },
  },
});
