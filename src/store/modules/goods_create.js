// 创建商品
import $Util from '@/common/util.js'; // 引入工具库

export default {
	state: {
		title: '', //商品名称
		category: [], //商品分类
		desc: '', //描述
		unit: '', //单位
		stock: 0, //总库存
		min_stock: 0, //库存预警
		display_stock: 0, //库存显示0隐藏，2显示
		status: 0, //是否上架0仓库，1上架
		express: '', //运费模板

		skus_type: 0, // 商品规格类型(0单规格，1多规格)
		oprice: 0, //市场价格
		pprice: 0, //销售价格
		cprice: 0, //成本价格
		weight: 0, //重量
		volume: 0, //体积

		// 规格卡片
		sku_card: [{
			name: '颜色', //规格名称
			type: 0, //规格类型0无，1颜色，2图片
			list: [{
					name: '黄色',
					image: '',
					color: ''
				},
				{
					name: '红色',
					image: '',
					color: ''
				}
			]

		}]

	},

	getter: {},

	mutations: {
		// 修改state
		vModelState(state, {
			key,
			value
		}) {
			state[key] = value;
		},

		// 增加规格卡片
		addSkuCard(state) {
			state.sku_card.push({
				name: '规格名称',
				type: 0,
				list: []
			});
		},

		// 删除规格卡片
		delSkuCard(state, index) {
			state.sku_card.splice(index, 1);
		},

		// 修改规格卡片
		vModelSkuCard(state, {
			key,
			value,
			index
		}) {
			state.sku_card[index][key] = value;
		},

		// 规格卡片排序
		sortSkuCard(state, {
			action,
			index
		}) {
			$Util[action](state.sku_card, index);
		},

		// 增加指定规格卡片的规格属性
		addSkuValue(state, index) {
			state.sku_card[index].list.push({
				name: '规格名称',
				image: '',
				color: ''
			});
		},

		// 删除指定规格卡片的规格属性
		delSkuValue(state, {
			cardIndex,
			listIndex
		}) {
			state.sku_card[cardIndex].list.splice(listIndex, 1);
		},

		// 修改指定规格卡片的规格属性
		updateSkuValue(state, {
			cardIndex,
			listIndex,
			key,
			value
		}) {
			state.sku_card[cardIndex].list[listIndex][key] = value;
		}
	},

	actions: {}
}
