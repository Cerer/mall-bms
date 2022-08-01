<!-- 折扣设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<el-form ref="form" label-width="80px" inline class="pt-3">
			<el-form-item label="会员价">
				<el-input v-model="discount">
					<template slot="append">
						%
					</template>
				</el-input>
			</el-form-item>
		</el-form>

		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
export default {
	inject: ['app', 'layout'],

	data() {
		return {
			id: 0,

			// 折扣数据
			discount: 0
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
				this.discount = data.discount;
				this.layout.hideLoading();
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},

	methods: {
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/${this.id}`,
					{
						discount: this.discount
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
