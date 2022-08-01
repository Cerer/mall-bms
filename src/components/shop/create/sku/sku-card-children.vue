<!-- 创建商品--商品规格--多规格--添加规格值 -->
<template>
	<div class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center">
		<div v-if="type != 0">
			<!-- 颜色选择器 -->
			<el-color-picker v-if="type === 1" :value="item.color" size="mini" @change="onColorChange"></el-color-picker>

			<!-- 图片选择 -->
			<template v-else>
				<div v-if="!item.image" class="btn btn-light border" @click="chooesImg"><i class="el-icon-plus"></i></div>

				<img
					v-else
					:src="item.image"
					alt=""
					class="rounded"
					style="width: 45px;height: 45px;cursor: pointer;"
					@click="chooesImg"
				/>
			</template>
		</div>

		<input
			v-if="type === 0"
			:value="item.text"
			@input="inputChange"
			class="form-control text-center border-0"
			style="width: 80px;font-size: 15px;"
		/>

		<!-- 删除 -->
		<span
			class="btn btn-light p-0 position-absolute"
			style="line-height: 1;top: -10px;right: -10px;"
			@click="delSkuValueEvent"
		>
			<i class="el-icon-circle-close"></i>
		</span>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	inject: ['app', 'layout'],

	props: {
		type: {
			type: Number,
			default: 0
		},
		item: Object,
		cardIndex: Number,
		listIndex: Number
	},

	watch: {
		type(newVal, oldVal) {
			let keys = ['text', 'color', 'image'];
			let defauleVal = ['属性值', '#FFFFFF', '/favicon.ico'];
			this.item.value = this.item[keys[newVal]] ? this.item[keys[newVal]] : defauleVal[newVal];

			this.updateSkuValueEvent();
		}
	},

	methods: {
		...mapMutations(['delSkuValue', 'updateSkuValue']),

		// 修改规格属性值
		updateSkuValueEvent() {
			let keys = ['text', 'color', 'image'];
			this.item.value = this.item[keys[this.type]];
			this.axios.post(`/admin/goods_skus_card_value/${this.item.id}`, this.item, { token: true });
		},

		// 删除规格属性值
		delSkuValueEvent() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card_value/${this.item.id}/delete`,
					{},
					{
						token: true
					}
				)
				.then(() => {
					this.delSkuValue({ cardIndex: this.cardIndex, listIndex: this.listIndex });
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 修改name值
		inputChange(e) {
			this.vModel('text', e.target.value);
		},

		// 修改函数
		vModel(key, value) {
			this.updateSkuValue({
				cardIndex: this.cardIndex,
				listIndex: this.listIndex,
				key,
				value
			});
		},

		// 选择图片
		chooesImg() {
			this.app.chooseImage(res => {
				this.vModel('image', res[0].src);
			}, 1);
		},

		// 修改颜色
		onColorChange(e) {
			this.vModel('color', e);
		}
	}
};
</script>

<style></style>
