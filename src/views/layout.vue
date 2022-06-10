<template>
	<div>
		<el-container style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;overflow: hidden;">
			<el-header style="background: #545c64;" class="d-flex align-items-center">
				<a class="h5 text-light mb-0 mr-auto">{{ $conf.logo }}</a>
				<el-menu
					:default-active="navBar.active"
					mode="horizontal"
					@select="handleSelect"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<el-menu-item v-for="(item, index) in navBar.list" :key="index" :index="index | numToString">
						{{ item.name }}
					</el-menu-item>
					<el-submenu index="100">
						<template slot="title">
							<el-avatar
								size="small"
								src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
							></el-avatar>
							Summer
						</template>
						<el-menu-item index="100-1">修改</el-menu-item>
						<el-menu-item index="100-2">退出</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-header>

			<el-container style="height: 100%;">
				<!-- 侧边导航 -->
				<el-aside width="200px">
					<el-menu :default-active="sildeMenuActive" @select="sildeSelect" style="height: 100%;">
						<el-menu-item :index="index | numToString" v-for="(item, index) in sildeMenus" :key="index">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-aside>

				<!-- 主布局 -->
				<el-main class="bg-light" style="padding-bottom: 60px;position: relative;">
					<!-- 面包屑导航 -->
					<div
						v-if="bran.length > 0"
						class="border-bottom accordion mb-3 bg-white"
						style="padding: 20px;margin: -20px;"
					>
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item v-for="(item, index) in bran" :key="index" :to="{ path: item.path }">
								{{ item.title }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>

					<!-- 主内容 -->
					<router-view></router-view>

					<!-- 回到顶部 -->
					<el-backtop target=".el-main" :bottom="100"><div class="backtopStyle">UP</div></el-backtop>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	mixins: [common],

	data() {
		return {
			// 侧边导航数据
			navBar: [],

			// 面包屑数据
			bran: []
		};
	},

	computed: {
		sildeMenuActive: {
			get() {
				return this.navBar.list[this.navBar.active].subActive || '0';
			},

			set(val) {
				this.navBar.list[this.navBar.active].subActive = val;
			}
		},

		sildeMenus() {
			return this.navBar.list[this.navBar.active].submenu || [];
		}
	},

	watch: {
		$route(to, from) {
			// 本地存储
			localStorage.setItem(
				'navActive',
				JSON.stringify({
					top: this.navBar.active,
					left: this.sildeMenuActive
				})
			);

			this.getRouterBran();
		}
	},

	created() {
		this.navBar = this.$conf.navBar;

		// 获取面包屑导航数据
		this.getRouterBran();

		//初始化选中菜单
		this.__initNavBar();
	},

	methods: {
		//初始化选中菜单
		__initNavBar() {
			let list = localStorage.getItem('navActive');
			if (list) {
				list = JSON.parse(list);
				this.navBar.active = list.top;
				this.sildeMenuActive = list.left;
			}
		},

		// 获取面包屑导航数据
		getRouterBran() {
			let routerList = this.$route.matched.filter(v => v.name);
			let arr = [];
			routerList.forEach((v, k) => {
				if (v.name === 'index' || v.name === 'layout') return;
				arr.push({
					name: v.name,
					path: v.path,
					title: v.meta.title
				});
			});
			if (arr.length > 0) {
				arr.unshift({ name: 'index', path: '/index', title: '后台首页' });
			}
			this.bran = arr;
		},

		//顶部导航点击
		handleSelect(key, keyPath) {
			if (key === '100-1') {
				return console.log('修改资料');
			}
			
			if (key === '100-2') {
				return console.log('退出');
			}
			
			this.navBar.active = key;

			// 默认选中跳转到当前激活
			this.sildeMenuActive = '0';
			if (this.sildeMenus.length > 0) {
				this.$router.push({
					name: this.sildeMenus[this.sildeMenuActive].pathname
				});
			}
		},

		// 侧边导航点击
		sildeSelect(key, keyPath) {
			this.sildeMenuActive = key;

			// 跳转到指定页面
			this.$router.push({
				name: this.sildeMenus[key].pathname
			});
		}
	}
};
</script>

<style>
.backtopStyle {
	height: 100%;
	width: 100%;
	background-color: #f2f5f6;
	box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
	text-align: center;
	line-height: 40px;
	color: #1989fa;
}
</style>
