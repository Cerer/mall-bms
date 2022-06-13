<!-- 创建商品--商品属性--统一规格 -->
<template>
	<div>
		<el-form label-position="right" label-width="80px">
			<el-form-item label="市场价格">
				<el-input :value="oprice" @input="vModel('oprice', $event)" type="number" placeholder="" class="w-25">
					<template slot="append">
						件
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="销售价格">
				<el-input :value="pprice" @input="vModel('pprice', $event)" type="number" placeholder="" class="w-25">
					<template slot="append">
						件
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="成本价格">
				<el-input :value="cprice" @input="vModel('cprice', $event)" type="number" placeholder="" class="w-25">
					<template slot="append">
						件
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="商品重量">
				<el-input :value="weight" @input="vModel('weight', $event)" type="number" placeholder="" class="w-25">
					<template slot="append">
						公斤
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="商品体积">
				<el-input :value="volume" @input="vModel('volume', $event)" type="number" placeholder="" class="w-25">
					<template slot="append">
						立方米
					</template>
				</el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {};
	},

	computed: {
		...mapState({
			oprice: state => state.goods_create.oprice,
			pprice: state => state.goods_create.pprice,
			cprice: state => state.goods_create.cprice,
			weight: state => state.goods_create.weight,
			volume: state => state.goods_create.volume
		})
	},

	methods: {
		...mapMutations(['vModelState']),

		// 修改state
		vModel(key, value) {
			this.vModelState({ key, value });
		}
	}
};
</script>

<style></style>
