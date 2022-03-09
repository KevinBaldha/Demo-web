import 'core-js/stable';
import Vue from 'vue';
import App from './App';
import router from './router';
import CoreuiVue from '@coreui/vue';
import { iconsSet as icons } from './assets/icons/icons.js';
import store from './store';
import {ApiService} from '@/service/api.service';
import VueSweetalert2 from 'vue-sweetalert2';
 
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.performance = true;
ApiService.init();
Vue.use(CoreuiVue);
Vue.use(VueSweetalert2);
Vue.prototype.$log = console.log.bind(console);

Vue.mixin({
  methods: {
      logout() {
          if (this.$auth.isAuthenticated()) {
              this.$auth.logout()
          }
          this.$store.commit('REMOVE_USER');
          this.$router.push('/');
      },
      resolveError(err) {
          if (err.code == 'ECONNABORTED') {
              return "Request Timeout, Please try again"
          }

          if (err.response == undefined || err.response.data == undefined) {
              return "Error Connection, please try again";
          }

          const errors = err.response.data.errors;
          const type = typeof errors;

          if (type == "string") {
              return [errors];
          } else {
              return errors;
          }
      },
      makeToastError(message) {
          Vue.toasted.clear()
          Vue.toasted.error(message, {
              position: 'top-center',
              duration: 5000,
          })
      },
      formatPrice(price) {
          return numeral(price).format();
      },
      preventXSS(value) {
          let regex = /<script|<|>|document.cookie|alert\./g

          return !regex.test(value);
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
  }
});

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
