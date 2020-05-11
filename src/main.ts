import Vue from 'vue';
import App from '@/App.vue';

// Vue Router
import router from '@/router';

// Vue Store
import store from '@/store/store';

// Vuetify
import vuetify from '@/plugins/vuetify';

// Vuelidate
import '@/plugins/vuelidate';

// VueNativeSock
import '@/plugins/vueNativeWebsocket';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  validations: {},
  render: (h) => h(App),
}).$mount('#app');
