import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'

// 配置文件
import $conf from './common/config/config.js'
Vue.prototype.$conf = $conf;

// 引入Vuex
import store from './store'

// 引入拖曳排序组件
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// 全局组件
import ButtonSearch from '@/components/common/button-search.vue' //搜索按钮组件
Vue.component('ButtonSearch', ButtonSearch)

// 注册一个全局自定义指令 `v-auth`
Vue.directive('auth', {
	// 当被绑定的元素插入到 DOM 中时……
	inserted: (el, binding, vnode, oldVnode) => {
		// 1.先获取规则权限角色数据
		let user = window.sessionStorage.getItem('user');
		user = user ? JSON.parse(user) : {};

		// 2.判断是否是超级管理员，超级管理员不需要校验(等于1为超级管理员)
		if (!user.super) {
			let rules = user.ruleNames ? user.ruleNames : [];

			// 2.1查找当前绑定指令的按钮名称是否存在权限角色数据中
			let index = rules.find(item => item === binding.value)

			// 2.2.不存在的话，就移除节点
			if (!index) {
				el.parentNode.removeChild(el);
			}
		}
	}
})

//引入消息弹框组件
import {
	Message
} from 'element-ui'

// 全局配置loading
let loading = null;
// 防止多次点击
let requesCount = 0;
// 显示loading
function showLoading() {
	// 第一次点击时才出现加载中
	if (requesCount === 0) {
		loading = Message({
			message: '加载中...',
			duration: 0
		});
	}
	requesCount++;
}

// 隐藏loading
function hideLoading() {
	// 不是第一次点击就--
	if (requesCount > 0) {
		requesCount--;
	}

	if (loading && requesCount === 0) {
		loading.close();
	}
}

// 添加请求拦截器
axios.interceptors.request.use((config) => {
	// 添加headers头的token
	let token = window.sessionStorage.getItem('token');

	if (config.token === true) {
		config.headers['token'] = token;
	}

	if (config.loading === true) {
		// 显示loading
		showLoading();
	}

	return config;
}, (error) => {
	// 对请求错误做些什么

	// 隐藏loading
	hideLoading();

	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use((response) => {
	// 对响应数据做点什么

	// 隐藏loading
	hideLoading();

	return response;
}, (err) => {
	// 全局错误提示
	if (err.response && err.response.data && err.response.data.errorCode) {
		Message.error(err.response.data.msg);
	}

	// 隐藏loading
	hideLoading();

	return Promise.reject(err);
});

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
