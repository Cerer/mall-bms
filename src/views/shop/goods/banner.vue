<!-- 媒体设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<div class="d-flex flex-wrap pt-3">
			<div
				v-for="(item, index) in banners"
				:key="index"
				class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
				style="width: 150px;height: 150px;cursor: pointer;position: relative;"
				@click="chooesImg(index)"
			>
				<img v-if="item.src" :src="item.src" style="width: 100%;height: 100%;" />
				<i v-else class="el-icon-plus text-muted" style="font-size: 30px;"></i>
				<i
					class="el-icon-delete p-2 text-white"
					style="position: absolute;top: 0;right: 0;background-color: rgba(0, 0, 0, 0.4);"
					@click.stop="deleteImg(index)"
				></i>
			</div>
			<div
				v-if="banners.length < 9"
				class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
				style="width: 150px;height: 150px;cursor: pointer;"
				@click="chooesImg(-1)"
			>
				<i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
			</div>
		</div>

		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
export default {
	inject: ['app', 'layout'],

	data() {
		return {
			// 图片数据
			banners: [],

			// 当前选择数据id
			id: 0
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
				this.banners = data.goodsBanner.map(i => {
					i.src = i.url;
					return i;
				});
				this.layout.hideLoading();
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},

	methods: {
		// 选择商品图片
		chooesImg(index) {
			const MAX = 9;
			let count = MAX - this.banners.length;
			this.app.chooseImage(
				res => {
					let list = [];
					if (index === -1) {
						list = [...this.banners, ...res];
					} else {
						list = [...this.banners];
						list[index] = res[0];
					}
					this.banners = list;
				},
				index === -1 ? count : 1
			);
		},

		// 删除选中商品大图
		deleteImg(index) {
			this.$confirm('是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.banners.splice(index, 1);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
				.catch(() => {});
		},

		// 提交
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/banners/${this.id}`,
					{
						banners: this.banners.map(i => i.src)
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
