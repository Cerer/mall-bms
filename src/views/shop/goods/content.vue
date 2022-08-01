<!-- 商品详情 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 200px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<tinymce
			v-model="content"
			class="py-3"
			ref="tinymceEditor"
			toolbar="bold italic underline strikethrough | fontsizeselect | formatselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | undo redo | link unlink code lists table | removeformat | fullscreen preview | imageUpload"
			@onClick="onClick"
		></tinymce>

		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
import tinymce from '@/components/common/tinymce.vue';
export default {
	inject: ['layout'],

	components: {
		tinymce
	},

	data() {
		return {
			content: '',

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
				this.content = data.content;
				this.layout.hideLoading();
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},

	methods: {
		// 富文本点击
		onClick(e, editor) {
			console.log('click');
			console.log(e);
			console.log(editor);
		},

		// 提交
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/${this.id}`,
					{
						content: this.content
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
