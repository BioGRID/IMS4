import Vue from 'vue';
import App from '@/App.vue';

// Setup Custom Titlebar
import { Titlebar, Color } from 'custom-electron-titlebar';
const titleBar = new Titlebar({
    backgroundColor: Color.fromHex( '#222' ),
    titleHorizontalAlignment: 'center',
    icon: './favicon.png',
});

// Vue Router
import router from '@/router';

// Vue Store
import store from '@/store/store';

// Vuetify
import vuetify from '@/plugins/vuetify';

// Vuelidate
import '@/plugins/vuelidate';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  validations: {},
  render: (h) => h(App),
}).$mount('#app');
