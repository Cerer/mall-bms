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
						name: '商品规格',
						pathname: 'shop_sku_list'
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
						name: '商品分类',
						pathname: 'shop_category_list'
					},
					{
						icon: 'el-icon-help',
						name: '商品规格',
						pathname: 'shop_sku_list'
					},
					{
						icon: 'el-icon-s-help',
						name: '商品类型',
						pathname: 'shop_type_list'
					},
					{
						icon: 'el-icon-s-comment',
						name: '商品评论',
						pathname: 'shop_comment_list'
					}
				]
			},
			{
				name: '订单',
				subActive: '2',
				submenu: [{
						icon: 'el-icon-s-order',
						name: '订单列表',
						pathname: 'order_order_list'
					},
					{
						icon: 'el-icon-s-check',
						name: '发票管理',
						pathname: 'order_invoice_list'
					},
					{
						icon: 'el-icon-s-opportunity',
						name: '售后服务',
						pathname: 'order_after-sale_list'
					}
				]
			},
			{
				name: '会员',
				subActive: '3',
				submenu: [{
						icon: 'el-icon-user-solid',
						name: '会员列表',
						pathname: 'user_user-list_list'
					},
					{
						icon: 'el-icon-s-data',
						name: '会员等级',
						pathname: 'user_user-level_list'
					}
				]
			},
			{
				name: '设置',
				subActive: '4',
				submenu: [{
						icon: 'el-icon-setting',
						name: '基础设置',
						pathname: 'set_base'
					},
					{
						icon: 'el-icon-s-promotion',
						name: '物流设置',
						pathname: 'set_express'
					},
					{
						icon: 'el-icon-s-custom',
						name: '管理员管理',
						pathname: 'set_manager'
					},
					{
						icon: 'el-icon-s-finance',
						name: '交易设置',
						pathname: 'set_payment'
					}
				]
			}
		]
	}

}
