import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
      themes: {
        light: {
            primary: '#003366',
            secondary: '#C0C0C0',
            tertiary: '#FFCC66',
            highlight: '#3399FF',
            info: '#5B7290',
            warning: '#FF6600',
        },
      },
      options: {
          customProperties: true,
      },
  },
});
