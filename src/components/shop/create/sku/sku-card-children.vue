<!-- 创建商品--商品属性--多规格--规格属性列表 -->
<template>
	<div class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center">
		<div v-if="type != 0">
			<!-- 颜色选择器 -->
			<el-color-picker v-if="type === 1" size="mini"></el-color-picker>

			<!-- 图片选择 -->
			<div v-else class="btn btn-light border"><i class="el-icon-plus"></i></div>
		</div>

		<input
			:value="item.name"
			@input="inputChange"
			class="form-control text-center border-0"
			style="width: 80px;font-size: 15px;"
		/>

		<!-- 删除 -->
		<span
			class="btn btn-light p-0 position-absolute"
			style="line-height: 1;top: -10px;right: -10px;"
			@click="delSkuValue({ cardIndex, listIndex })"
		>
			<i class="el-icon-circle-close"></i>
		</span>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	props: {
		type: {
			type: Number,
			default: 0
		},
		item: Object,
		cardIndex: Number,
		listIndex: Number
	},

	methods: {
		...mapMutations(['delSkuValue', 'updateSkuValue']),

		// 修改name值
		inputChange(e) {
			this.vModel('name', e.target.value);
		},

		vModel(key, value) {
			this.updateSkuValue({
				cardIndex: this.cardIndex,
				listIndex: this.listIndex,
				key,
				value
			});
		}
	}
};
</script>

<style></style>
