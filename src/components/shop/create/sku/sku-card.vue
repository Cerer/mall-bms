<!-- 创建商品--商品属性--多规格--规格卡片 -->
<template>
	<div>
		<div class="card mb-3" style="line-height: 1.2;">
			<div class="card-header d-flex align-items-center">
				规格项：
				<el-input :value="item.name" @input="vModel('name', $event, index)" size="mini" style="width: 200px;">
					<el-button slot="append" icon="el-icon-more"></el-button>
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
				<el-button type="text" size="mini" @click="delSkuCard(index)">删除</el-button>
			</div>
			<div class="card-body">
				<!-- 规格属性列表 -->
				<div class="d-flex align-items-center flex-wrap">
					<sku-card-children
						v-for="(item2, index2) in item.list"
						:key="index2"
						:type="item.type"
						:item="item2"
						:cardIndex="index"
						:listIndex="index2"
					></sku-card-children>
				</div>

				<!-- 增加规格属性 -->
				<div class="mt-2">
					<el-button type="text" size="mini" icon="el-icon-plus" @click="addSkuValue(index)">增加规格值</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import skuCardChildren from './sku-card-children.vue';
import { mapMutations } from 'vuex';
export default {
	props: {
		item: Object,
		index: Number,
		total: Number
	},

	components: {
		skuCardChildren
	},

	data() {
		return {};
	},

	computed: {
		skuCardTotal() {
			return this.sku_card.length;
		}
	},

	methods: {
		...mapMutations(['delSkuCard', 'vModelSkuCard', 'sortSkuCard', 'addSkuValue']),

		// 修改卡片
		vModel(key, value, index) {
			this.vModelSkuCard({ key, value, index });
		},

		// 卡片排序
		sortCard(action, index) {
			this.sortSkuCard({ action, index });
		}
	}
};
</script>

<style></style>
