<!-- 商品属性 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<div class="pt-3 pb-3">
			<el-form ref="form" label-width="80px">
				<el-form-item label="商品类型">
					<el-select v-model="goods_type_id" placeholder="请选择商品类型" @change="change">
						<el-option
							v-for="(item, index) in typeOptions"
							:key="index"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-card class="box-card">
				<div slot="header" class="clearfix"><span>商品属性</span></div>
				<el-form ref="form" label-width="80px">
					<el-form-item v-for="(item, index) in goods_type_values" :key="index" :label="item.name">
						<el-input v-if="item.type === 'input'" v-model="item.value"></el-input>
						<el-radio-group v-else-if="item.type === 'radio'" v-model="item.value">
							<el-radio v-for="(item2, index2) in item.default" :key="index2" :label="item2">{{ item2 }}</el-radio>
						</el-radio-group>
						
						<!-- 有问题，会一起选中 -->
						<el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="item.value">
							<el-checkbox v-for="(item2, index2) in item.default" :key="index2" :label="item2"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-card>
		</div>

		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
export default {
	inject: ['app', 'layout'],

	data() {
		return {
			// 商品类型
			goods_type_id: '',

			//商品类型下拉数据
			typeOptions: [],

			// 商品属性值
			goods_type_values: []
		};
	},

	created() {
		this.id = this.$route.params.id;
		if (!this.id) {
			this.$message({
				type: 'error',
				message: '非法参数'
			});
			return this.$router.push({
				name: 'shop_goods_list'
			});
		}

		// 获取之前商品详情
		this.layout.showLoading();
		this.axios
			.get(`/admin/goods/read/${this.id}`, {
				token: true
			})
			.then(res => {
				let data = res.data.data;
				this.typeOptions = data.types;
				this.goods_type_values = data.goodsAttrs.map(i => {
					if (i.type !== 'input') {
						i.default = i.default.split(',');
					}
					return i;
				});
				this.layout.hideLoading();
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},

	methods: {
		//下拉选择改变
		change(id) {
			let index = this.typeOptions.findIndex(i => i.id === id);
			if (index === -1) {
				return (this.goods_type_values = []);
			}

			let options = this.typeOptions[index].goods_type_values;
			this.goods_type_values = options.map(item => {
				let defaultVal = [];
				if (item.type != 'input') {
					defaultVal = item.default ? item.default.split(',') : [];
				}
				return {
					goods_id: this.id,
					value: '',
					name: item.name,
					default: defaultVal,
					type: item.type
				};
			});
		},

		// 提交数据
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/attrs/${this.id}`,
					{
						goods_attrs: this.goods_type_values.map(i => {
							if (i.type !== 'input') {
								i.default = i.default.join(',');
							}
							return i;
						})
					},
					{
						token: true
					}
				)
				.then(() => {
					this.$message({
						type: 'success',
						message: '提交成功'
					});
					this.$router.push({
						name: 'shop_goods_list'
					});
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		}
	}
};
</script>

<style></style>
