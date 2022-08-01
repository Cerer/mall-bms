<!-- 商品列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="tabIndex" @tab-click="__getData">
			<el-tab-pane v-for="(item, index) in tabBars" :key="index" :label="item.name"></el-tab-pane>
		</el-tabs>

		<button-search ref="buttonSearch" placeholder="要搜索的商品名称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<router-link :to="{ name: 'shop_goods_create' }">
					<el-button type="success" size="mini" class="mr-2">发布商品</el-button>
				</router-link>
				<el-button v-if="tab === 'delete'" type="warning" size="mini" @click="doEvent('restore')">恢复商品</el-button>
				<el-button v-if="tab === 'delete'" type="danger" size="mini" @click="doEvent('destroy')">彻底删除</el-button>
				<el-button v-if="tab !== 'delete'" type="danger" size="mini" @click="deteleAll">批量删除</el-button>
				<el-button v-if="tab === 'all' || tab === 'off'" size="mini" @click="changeStatus(1)">上架</el-button>
				<el-button v-if="tab === 'all' || tab === 'saling'" size="mini" @click="changeStatus(0)">下架</el-button>
			</template>

			<!--右边-搜索表单 -->
			<template #form>
				<el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
					<el-form-item label="商品名称" class="mb-0">
						<el-input v-model="form.title" placeholder="商品名称" size="mini" clearable></el-input>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select v-model="form.category_id" placeholder="请选择商品分类" size="mini" clearable filterable>
							<el-option
								v-for="(item, index) in cateOptions"
								:key="index"
								:label="item | dealName"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>

		<!-- 商品表格 -->
		<el-table :data="tableData" class="mt-2" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column prop="title" label="商品" width="350">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" :src="scope.row.cover" alt="" style="width: 60px;height: 60px;" />
						<div class="media-body">
							<p class="mt-0 mb-0 font-weight-bold">{{ scope.row.title }}</p>
							<p class="mb-0">分类：{{ scope.row.category.name }}</p>
							<p class="mb-0">时间：{{ scope.row.create_time }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sale_count" label="实际销量" align="center"></el-table-column>
			<el-table-column prop="status" label="商品状态" align="center" width="100">
				<template slot-scope="scope">
					<span class="badge" :class="scope.row.status ? 'badge-success' : 'badge-danger'">
						{{ scope.row.status ? '上架' : '仓库' }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="审核状态" align="center" width="150">
				<template slot-scope="scope">
					<div v-if="!scope.row.ischeck">
						<el-button type="success" size="mini" plain @click="checkGoods(scope.row, 1)">审核通过</el-button>
						<el-button class="ml-0 mt-2" type="danger" size="mini" plain @click="checkGoods(scope.row, 2)">
							审核拒绝
						</el-button>
					</div>
					<span v-else>{{ scope.row.ischeck === 1 ? '通过' : '拒绝' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" align="center" width="70"></el-table-column>
			<el-table-column prop="pprice" label="价格(元)" align="center" width="150">
				<template slot-scope="scope">
					<span class="text-danger">￥{{ scope.row.min_price }}</span>
					<span>/</span>
					<span class="text-muted">￥{{ scope.row.min_oprice }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="300" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="navigate('shop_goods_create', scope.row.id)">基础设置</el-button>
					<el-button
						type="text"
						size="mini"
						:class="
							(scope.row.sku_type === 0 && !scope.row.sku_value) ||
							(scope.row.sku_type === 1 && !scope.row.goods_skus.length)
								? 'text-danger'
								: ''
						"
						@click="navigate('shop_goods_sku', scope.row.id)"
					>
						商品规格
					</el-button>
					<el-button
						type="text"
						size="mini"
						:class="scope.row.goods_attrs.length === 0 ? 'text-danger' : ''"
						@click="navigate('shop_goods_attr', scope.row.id)"
					>
						商品属性
					</el-button>
					<el-button
						type="text"
						size="mini"
						:class="scope.row.goods_banner.length === 0 ? 'text-danger' : ''"
						@click="navigate('shop_goods_banner', scope.row.id)"
					>
						媒体设置
					</el-button>
					<el-button
						type="text"
						size="mini"
						:class="!scope.row.content ? 'text-danger' : ''"
						@click="navigate('shop_goods_content', scope.row.id)"
					>
						商品详情
					</el-button>
					<el-button
						type="text"
						size="mini"
						:class="!scope.row.discount ? 'text-danger' : ''"
						@click="navigate('shop_goods_discount', scope.row.id)"
					>
						折扣设置
					</el-button>
					<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除商品</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div style="height: 65px;"></div>

		<!-- 分页 -->
		<el-footer
			class="border-top d-flex align-items-center px-0 position-fixed bg-white"
			style="bottom: 0;left: 200px;right: 0;z-index: 100;"
		>
			<div style="flex: 1;" class="px-2">
				<el-pagination
					:current-page="page.current"
					:page-sizes="page.sizes"
					:page-size="page.size"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				></el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],

	mixins: [common],

	data() {
		return {
			// 接口标识
			preUrl: 'goods',

			// 当前tabs默认选中第一个
			tabIndex: 0,

			// tabs数据
			tabBars: [
				{
					name: '全部',
					key: 'all'
				},
				{
					name: '审核中',
					key: 'checking'
				},
				{
					name: '出售中',
					key: 'saling'
				},
				{
					name: '已下架',
					key: 'off'
				},
				{
					name: '库存预警',
					key: 'min_stoke'
				},
				{
					name: '回收站',
					key: 'delete'
				}
			],

			// 搜索参数
			form: {
				title: '',
				category_id: ''
			},

			// 商品表格数据
			tableData: [],

			// 商品分类下拉数据
			cateOptions: []
		};
	},

	computed: {
		//处理tab值
		tab() {
			return this.tabBars[this.tabIndex].key;
		},

		// 处理接口参数值
		params() {
			let str = '';
			for (let key in this.form) {
				let val = this.form[key];
				if (val) {
					str += `&${key}=${this.form[key]}`;
				}
			}
			return str;
		}
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

	methods: {
		//获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`;
		},

		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
			this.cateOptions = data.cates;
		},

		// 搜索
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				this.form.title = e;
			}

			//高级搜索
			this.__getData();
		},

		// 清空筛选条件
		clearSearch() {
			this.form = {
				title: '',
				category_id: ''
			};
		},

		// 上下架
		changeStatus(status) {
			if (this.ids.length === 0) {
				return this.$message({
					type: 'error',
					message: '请先选择要操作的商品'
				});
			}

			this.showLoading();
			this.axios
				.post(
					`/admin/goods/changeStatus`,
					{
						ids: this.ids,
						status
					},
					{
						token: true
					}
				)
				.then(() => {
					this.$message({
						type: 'success',
						message: '操作成功'
					});
					this.__getData();
					this.hideLoading();
				})
				.catch(() => {
					this.hideLoading();
				});
		},

		// 恢复商品
		doEvent(key) {
			if (this.ids.length === 0) {
				return this.$message({
					type: 'error',
					message: '请先选择要操作的商品'
				});
			}
			this.showLoading();
			this.axios
				.post(
					`/admin/goods/${key}`,
					{
						ids: this.ids
					},
					{
						token: true
					}
				)
				.then(() => {
					this.$message({
						type: 'success',
						message: '操作成功'
					});
					this.__getData();
					this.hideLoading();
				})
				.catch(() => {
					this.hideLoading();
				});
		},

		// 跳转商品详情
		navigate(name, id) {
			this.$router.push({
				name,
				params: { id }
			});
		},

		// 审核商品
		checkGoods(item, ischeck) {
			this.showLoading();
			this.axios
				.post(
					`/admin/goods/${item.id}/check`,
					{
						ischeck
					},
					{
						token: true
					}
				)
				.then(() => {
					this.$message({
						type: 'success',
						message: '操作成功'
					});
					this.__getData();
					this.hideLoading();
				})
				.catch(() => {
					this.hideLoading();
				});
		}
	}
};
</script>

<style></style>
