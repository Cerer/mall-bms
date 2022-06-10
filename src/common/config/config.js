export default {
	logo: '商城后台管理系统',

	navBar: {
		active: '0',
		list: [{
				name: '首页',
				subActive: '0',
				submenu: [{
						icon: 'el-icon-s-home',
						name: '后台首页',
						pathname: 'index'
					},
					{
						icon: 'el-icon-picture',
						name: '相册管理',
						pathname: 'image'
					},
					{
						icon: 'el-icon-s-order',
						name: '商品列表',
						pathname: 'shop_goods_list'
					},
					{
						icon: 'el-icon-help',
						name: '商品规格'
					}
				]
			},
			{
				name: '商品',
				subActive: '1',
				submenu: [{
						icon: 'el-icon-s-order',
						name: '商品列表',
						pathname: 'shop_goods_list'
					},
					{
						icon: 'el-icon-menu',
						name: '商品分类'
					},
					{
						icon: 'el-icon-help',
						name: '商品规格'
					},
					{
						icon: 'el-icon-s-help',
						name: '商品类型'
					},
					{
						icon: 'el-icon-s-comment',
						name: '商品评论'
					}
				]
			},
			{
				name: '订单',
				subActive: '2',
				submenu: [{
						icon: 'el-icon-s-order',
						name: '订单列表'
					},
					{
						icon: 'el-icon-s-check',
						name: '发票管理'
					},
					{
						icon: 'el-icon-s-opportunity',
						name: '售后服务'
					}
				]
			},
			{
				name: '会员',
				subActive: '3',
				submenu: [{
						icon: 'el-icon-user-solid',
						name: '会员列表'
					},
					{
						icon: 'el-icon-s-data',
						name: '会员等级'
					}
				]
			},
			{
				name: '设置',
				subActive: '4',
				submenu: []
			}
		]
	}

}
