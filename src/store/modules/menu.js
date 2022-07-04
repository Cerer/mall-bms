// 菜单信息
export default {
	state: {
		navBar: {
			active: '0',
			list: []
		}
	},

	getters: {
		// 首页
		adminIndex(state) {
			// 如果没有菜单数据，返回404页面
			if (state.navBar.list.length === 0) {
				return 'erroe_404';
			}

			// 否则判断第一个list有没有子菜单，有的话返回子菜单第一个路径
			let item = state.navBar.list[0].submenu[0];
			if (item) {
				return item.pathname;
			}
		}
	},

	mutations: {
		// 创建菜单
		createNavBar(state, menus) {
			let list = menus.map(item => {
				let submenu = item.child.map(v => {
					return {
						icon: v.icon,
						name: v.name,
						pathname: v.desc
					}
				});

				return {
					name: item.name,
					subActive: '0',
					submenu: submenu
				}
			});

			state.navBar.list = list;

			// 存到本地存储
			window.sessionStorage.setItem('navBar', JSON.stringify(state.navBar));
		},

		//初始化菜单
		initNavBar(state) {
			let navBar = window.sessionStorage.getItem('navBar');

			navBar = navBar ? JSON.parse(navBar) : {
				active: '0',
				list: []
			}

			state.navBar = navBar;
		}
	},

	actions: {}
}
