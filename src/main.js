import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'

// 配置文件
import $conf from './common/config/config.js'
Vue.prototype.$conf = $conf;

// 引入Vuex
import store from './store'

// 全局组件
import ButtonSearch from '@/components/common/button-search.vue' //搜索按钮组件
Vue.component('ButtonSearch', ButtonSearch)


Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
