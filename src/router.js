import Vue from "vue";
import Router from 'vue-router';
import routes from './common/config/router.js'

Vue.use(Router)


let router = new Router({
	routes
});

router.beforeEach((to, from, next) => { //to跳转到那个页面,from从那来,next放行钩子
	// 1.获取缓存的token
	let token = window.sessionStorage.getItem('token');

	// 获取缓存的用户数据
	let user = window.sessionStorage.getItem('user');

	// 2.判断是否登录，有token已登陆
	if (token) {
		// 2.2防止重复登录
		if (to.path === '/login') {
			// 2.2.1提示和跳转回上一页或者首页
			Vue.prototype.$message.error('请不要重复登录!');
			return next({
				name: from.name ? from.name : 'index'
			});
		}

		// 2.3验证页面权限
		// 2.3.1判断跳转页面是不是404
		if (to.name !== 'error_404') { //不是的话
			//超级管理员跳过验证
			if (user) {
				user = JSON.parse(user);
				if (user.super === 1) {
					return next();
				}
			}

			// 2.3.2获取校验规则数据
			let rules = window.sessionStorage.getItem('rules');
			rules = rules ? JSON.parse(rules) : [];

			// 2.3.3判断规则数据里是否有与跳转下一页面相等的数据
			let index = rules.findIndex(item => {
				return item.rule_id > 0 && item.desc === to.name;
			});

			// 2.3.4没有相等的话，就跳回上一页或者404页面
			if (index === -1) {
				Vue.prototype.$message.error('没有权限操作!');
				return next({
					name: from.name ? from.name : 'error_404'
				});
			}
		}

		// 2.4其他校验...

		// 2...直接放行
		next();
	} else {
		// 3.未登录
		// 3.1判断是否在登录页,是的话直接放行
		if (to.path === '/login') {
			return next();
		}

		// 3.2不是的话进行提示,在跳转到登录页
		Vue.prototype.$message.error('请先登录!');
		next({
			path: '/login'
		})
	}
})

export default router;
