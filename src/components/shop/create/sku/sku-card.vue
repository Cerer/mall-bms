<!-- 创建商品--商品规格--多规格--添加规格 -->
<template>
	<div>
		<div class="card mb-3" style="line-height: 1.2;">
			<div class="card-header d-flex align-items-center">
				规格项：
				<el-input :value="item.name" @input="vModel('name', $event, index)" size="mini" style="width: 200px;">
					<el-button slot="append" icon="el-icon-more" @click="chooseSkus"></el-button>
				</el-input>
				<el-radio-group
					:value="item.type"
					@input="vModel('type', $event, index)"
					size="mini"
					style="margin-top: 10px;"
					class="ml-2"
				>
					<el-radio :label="0">无</el-radio>
					<el-radio :label="1">颜色</el-radio>
					<el-radio :label="2">图片</el-radio>
				</el-radio-group>

				<!-- 上移 -->
				<el-button
					class="ml-auto"
					size="mini"
					icon="el-icon-top"
					@click="sortCard('moveUp', index)"
					:disabled="index === 0"
				></el-button>

				<!-- 下移 -->
				<el-button
					size="mini"
					icon="el-icon-bottom"
					@click="sortCard('moveDown', index)"
					:disabled="total === index + 1"
				></el-button>

				<!-- 删除 -->
				<el-button type="text" size="mini" @click="delSkuCardEvent">删除</el-button>
			</div>
			<div class="card-body">
				<!-- 规格属性列表 -->
				<div class="d-flex align-items-center flex-wrap">
					<sku-card-children
						v-for="(item2, index2) in list"
						:key="index2"
						:type="item.type"
						:item="item2"
						:cardIndex="index"
						:listIndex="index2"
						v-dragging="{ item: item2, list: list, group: `skuItem${index}` }"
					></sku-card-children>
				</div>

				<!-- 增加规格属性 -->
				<div class="mt-2">
					<el-button type="text" size="mini" icon="el-icon-plus" @click="addSkuValueEvent">增加规格值</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import skuCardChildren from './sku-card-children.vue';
import { mapState, mapMutations } from 'vuex';
let defauleVal = ['属性值', '#FFFFFF', '/favicon.ico'];
export default {
	inject: ['app', 'layout'],

	props: {
		item: Object,
		index: Number,
		total: Number
	},

	components: {
		skuCardChildren
	},

	data() {
		return {
			list: this.item.list
		};
	},

	computed: {
		...mapState({
			sku_card: state => state.goods_create.sku_card
		})
	},

	mounted() {
		this.$watch('item.list', (newValue, oldValue) => {
			this.list = newValue;
		});

		// 监听拖拽过程
		// this.$dragging.$on('dragged', ({value}) => {
		// 	console.log(value);
		// });

		// 监听拖拽结束
		this.$dragging.$on('dragend', e => {
			if (e.group === 'skuItem' + this.index) {
				this.sortSkuValue({
					index: this.index,
					list: this.list
				});
				this.axios.post(
					`/admin/goods_skus_card_value/sort`,
					{
						sortdata: this.list.map((item, index) => {
							return {
								id: item.id,
								order: index + 1
							};
						})
					},
					{
						token: true
					}
				);
			}
		});
	},

	methods: {
		...mapMutations(['delSkuCard', 'vModelSkuCard', 'sortSkuCard', 'addSkuValue', 'sortSkuValue']),

		// 添加规格属性值
		addSkuValueEvent(value = false) {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card_value`,
					{
						goods_skus_card_id: this.item.id,
						name: this.item.name,
						order: 50,
						value: typeof value === 'string' ? value : defauleVal[this.item.type]
					},
					{
						token: true
					}
				)
				.then(res => {
					let data = res.data.data;
					data.text = this.item.type === 0 ? data.value : defauleVal[0];
					data.color = this.item.type === 1 ? data.value : defauleVal[1];
					data.image = this.item.type === 2 ? data.value : defauleVal[2];
					this.addSkuValue({ index: this.index, data });
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 删除规格
		delSkuCardEvent() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card/${this.item.id}/delete`,
					{},
					{
						token: true
					}
				)
				.then(() => {
					this.delSkuCard(this.index);
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 修改规格值
		updateSkuCard() {
			this.axios.post(`/admin/goods_skus_card/${this.item.id}`, this.item, { token: true });
		},

		// 修改卡片
		vModel(key, value, index) {
			this.vModelSkuCard({ key, value, index });
			this.updateSkuCard();
		},

		// 卡片排序
		sortCard(action, index) {
			this.sortSkuCard({ action, index });
			this.axios.post(
				`/admin/goods_skus_card/sort`,
				{
					sortdata: this.sku_card.map((item, index) => {
						return {
							id: item.id,
							order: index + 1
						};
					})
				},
				{
					token: true
				}
			);
		},

		// 选中规格
		chooseSkus() {
			this.app.chooseSkus(res => {
				this.vModel('name', res.name, this.index);
				this.vModel('type', res.type, this.index);
				res.list.forEach(i => {
					this.addSkuValueEvent(i.name);
				});
			});
		}
	}
};
</script>

<style></style>
