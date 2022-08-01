<!-- 创建商品 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<el-form ref="form" label-position="right" label-width="90px" class="pt-3">
			<el-form-item label="商品名称">
				<el-input v-model="form.title" placeholder="请输入商品名称,不能超过60个字符" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="封面">
				<div v-if="!form.cover" class="btn btn-light border" @click="chooesImg"><i class="el-icon-plus"></i></div>

				<img
					v-else
					:src="form.cover"
					alt=""
					class="rounded"
					style="width: 45px;height: 45px;cursor: pointer;"
					@click="chooesImg"
				/>
			</el-form-item>
			<el-form-item label="商品分类">
				<el-select v-model="form.category_id" placeholder="请选择商品分类">
					<el-option v-for="(item, index) in cates" :key="index" :label="item | dealName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品描述">
				<el-input
					v-model="form.desc"
					type="textarea"
					class="w-50"
					placeholder="选填,商品卖点简述,例如:此款商品美观大方 性价比高 不容错过"
				></el-input>
			</el-form-item>
			<el-form-item label="商品单位">
				<el-input v-model="form.unit" placeholder="请输入商品单位" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="总库存">
				<el-input v-model="form.stock" type="number" placeholder="" class="w-25">
					<template slot="append">
						件
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存预警">
				<el-input v-model="form.min_stock" type="number" placeholder="" class="w-25">
					<template slot="append">
						件
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低销售价">
				<el-input v-model="form.min_price" type="number" placeholder="" class="w-25">
					<template slot="append">
						元
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低原价">
				<el-input v-model="form.min_oprice" type="number" placeholder="" class="w-25">
					<template slot="append">
						元
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存显示">
				<el-radio-group v-model="form.stock_display">
					<el-radio :label="1" border>是</el-radio>
					<el-radio :label="0" border>否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否上架">
				<el-radio-group v-model="form.status">
					<el-radio :label="0" border>放入仓库</el-radio>
					<el-radio :label="1" border>立即上架</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="运费模板">
				<el-select v-model="form.express_id" placeholder="请选择运费模板">
					<el-option v-for="(item, index) in express" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
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

			// 表单数据
			form: {
				title: '', //商品名称
				category_id: '', //商品分类
				cover: '', //商品封面
				desc: '', //商品描述
				unit: '', //商品单位
				stock: '', //总库存
				min_stock: '', //库存预警
				ischeck: '', //是否审核（0待处理，1通过，2拒绝）
				status: 0, //是否上架（0仓库，1上架）
				stock_display: 0, //库存显示（0隐藏，1禁用）
				express_id: '', //运费模板
				min_price: '', //最低销售价
				min_oprice: '' //最低原价
			},

			// 商品分类下拉数据
			cates: [],

			// 运费模板下拉数据
			express: []
		};
	},

	filters: {
		dealName(item) {
			if (item.level == 0) {
				return item.name;
			}
			let str = '';
			for (let i = 0; i < item.level; i++) {
				str += i == 0 ? '|--' : '--';
			}
			return str + ' ' + item.name;
		}
	},

	created() {
		this.id = this.$route.params.id;
		if (this.id) {
			// 获取之前商品详情
			this.layout.showLoading();
			this.axios
				.get(`/admin/goods/read/${this.id}`, {
					token: true
				})
				.then(res => {
					let data = res.data.data;
					this.form = data;
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		}

		// 获取商品分类运费模板下拉数据
		this.axios
			.get(`/admin/goods/create`, {
				token: true
			})
			.then(res => {
				let data = res.data.data;
				this.cates = data.cates;
				this.express = data.express.list;
			});
	},

	methods: {
		// 选择封面
		chooesImg() {
			this.app.chooseImage(res => {
				this.form.cover = res[0].src;
			}, 1);
		},

		// 提交数据
		submit() {
			this.layout.showLoading();
			let url = '/admin/goods';
			if (this.id) {
				url = '/admin/goods/' + this.id;
			} else {
				this.form.ischeck = '0';
				url = '/admin/goods';
			}

			this.axios
				.post(url, this.form, {
					token: true
				})
				.then(() => {
					this.$message({
						type: 'success',
						message: this.id ? '修改成功' : '发布成功'
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
