import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'

import $conf from './common/config/config.js'
Vue.prototype.$conf = $conf;


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
