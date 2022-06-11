<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(item, index) in tabBars" :key="index" :label="item.name">
				<button-search ref="buttonSearch" placeholder="要搜索的商品名称" @search="searchEvent">
					<!-- 左边 -->
					<template #left>
						<router-link :to="{ name: 'shop_goods_create' }">
							<el-button type="success" size="mini">发布商品</el-button>
						</router-link>
						<el-button type="warning" size="mini" class="ml-2">恢复商品</el-button>
						<el-button type="danger" size="mini">批量删除</el-button>
						<el-button size="mini">上架</el-button>
						<el-button size="mini">下架</el-button>
						<el-button size="mini">推荐</el-button>
					</template>

					<!--右边-搜索表单 -->
					<template #form>
						<el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
							<el-form-item label="商品名称" class="mb-0">
								<el-input v-model="form.name" placeholder="商品名称" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="商品编码" class="mb-0">
								<el-input v-model="form.code" placeholder="商品编码" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="商品类型" class="mb-0">
								<el-select v-model="form.type" placeholder="请选择商品类型" size="mini">
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品分类" class="mb-0">
								<el-input v-model="form.category" placeholder="商品分类" size="mini"></el-input>
							</el-form-item>
							<el-form-item class="mb-0">
								<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
								<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</button-search>

				<!-- 商品表格 -->
				<el-table :data="tableData[index].list" class="mt-2" border @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center"></el-table-column>
					<el-table-column prop="title" label="商品" width="400">
						<template slot-scope="scope">
							<div class="media">
								<img class="mr-3" :src="scope.row.cover" alt="" style="width: 60px;height: 60px;" />
								<div class="media-body">
									<p class="mt-0 mb-0 font-weight-bold">{{ scope.row.title }}</p>
									<p class="mb-0">分类：{{ scope.row.categroy }}</p>
									<p class="mb-0">时间：{{ scope.row.create_time }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="商品类型" align="center"></el-table-column>
					<el-table-column prop="sale_count" label="实际销售" align="center"></el-table-column>
					<el-table-column prop="order" label="商品排序" align="center"></el-table-column>
					<el-table-column prop="status" label="商品状态" align="center" width="150">
						<template slot-scope="scope">
							<el-button type="success" size="mini" plain @click="scope.row.ischeck = 1">审核通过</el-button>
							<el-button class="ml-0 mt-2" type="danger" size="mini" plain @click="scope.row.ischeck = 2">
								审核不通过
							</el-button>
							<!-- <el-button
								:type="scope.row.status ? 'success' : 'danger'"
								size="mini"
								plain
								@click="changeStatus(scope.row)"
							>
								{{ scope.row.status ? '上架' : '下架' }}
							</el-button> -->
						</template>
					</el-table-column>
					<el-table-column prop="stock" label="总库存" align="center"></el-table-column>
					<el-table-column prop="pprice" label="价格(元)" align="center"></el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="success" size="mini" plain>编辑</el-button>
								<el-button type="danger" size="mini" plain @click="deteleItem(scope.$index)">删除</el-button>
							</el-button-group>
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
						<!-- @size-change="handleSizeChange"
							@current-change="handleCurrentChange" -->
						<el-pagination
							:current-page="tableData[index].currentPage"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400"
						></el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 当前tabs默认选中第一个
			tabIndex: 0,

			// tabs数据
			tabBars: [
				{
					name: '审核中'
				},
				{
					name: '出售中'
				},
				{
					name: '已下架'
				},
				{
					name: '库存预警'
				},
				{
					name: '回收站'
				}
			],

			// 搜索参数
			form: {
				name: '',
				code: '',
				type: '',
				categroy: ''
			},

			// 商品表格数据
			tableData: [],

			// 表格多选数据
			multipleSelection: []
		};
	},

	created() {
		this.__getData();
	},

	methods: {
		// 获取表格数据
		__getData() {
			for (let i = 0; i < this.tabBars.length; i++) {
				this.tableData.push({
					currentPage: 1,
					list: []
				});

				for (let j = 0; j < 20; j++) {
					this.tableData[i].list.push({
						id: j,
						title: '荣耀 V10全网通 标配版 4G+64G 魅丽红' + i + '-' + j,
						cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
						create_time: '2022-06-11 18:34:14',
						categroy: '手机',
						type: '普通商品',
						sale_count: 20,
						order: 100,
						status: 1,
						stock: 200,
						pprice: 1000,
						ischeck: 1 //0未审核，1通过，2不通过
					});
				}
			}
		},

		// tabs切换获取数据
		handleClick(tab, event) {},

		// 搜索
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				return console.log('简单搜索');
			}

			//高级搜索
			console.log('高级搜索');
		},

		// 清空筛选条件
		clearSearch() {
			this.form = {
				name: '',
				code: '',
				type: '',
				categroy: ''
			};

			this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
		},

		// 商品表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		// 删除数据
		deteleItem(index) {
			this.$confirm('是否删除该条数据?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData[this.tabIndex].list.splice(index, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},

		// 上下架
		changeStatus(item) {
			item.status = item.status === 1 ? 0 : 1;
		}
	}
};
</script>

<style></style>
