<!-- 订单列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(item, index) in tabBars" :key="index" :label="item.name">
				<button-search ref="buttonSearch" placeholder="要搜索的订单编号" @search="searchEvent">
					<!-- 左边 -->
					<template #left>
						<el-button type="success" size="mini" class="ml-2">导出数据</el-button>
						<el-button type="danger" size="mini">批量删除</el-button>
					</template>

					<!--右边-搜索表单 -->
					<template #form>
						<el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
							<el-form-item label="订单编号" class="mb-0">
								<el-input v-model="form.code" placeholder="订单编号" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="订单状态" class="mb-0">
								<el-select v-model="form.type" placeholder="请选择订单状态" size="mini">
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="下单时间" class="mb-0">
								<el-date-picker
									v-model="form.time"
									type="daterange"
									size="mini"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="收货人" class="mb-0">
								<el-input v-model="form.username" placeholder="收货人" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="手机号" class="mb-0">
								<el-input v-model="form.phone" placeholder="手机号" size="mini"></el-input>
							</el-form-item>
							<el-form-item class="mb-0">
								<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
								<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</button-search>

				<!-- 订单表格 -->
				<el-table :data="tableData[index].list" class="mt-2" border @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center"></el-table-column>
					<el-table-column label="商品信息" width="380">
						<template slot-scope="scope">
							<div class="d-flex">
								<div style="flex: 1;">
									<p class="mb-0">订单编号：</p>
									<p class="mb-1"><small class="font-weight-bold">2022025896899</small></p>
								</div>
								<div style="flex: 1;">
									<p class="mb-0">下单时间：</p>
									<p class="mb-1"><small class="font-weight-bold">2022-02-25 14:56:24</small></p>
								</div>
							</div>
							<div class="media">
								<img class="mr-3" :src="scope.row.cover" alt="" style="width: 60px;height: 60px;" />
								<div class="media-body">
									<p class="mt-0 mb-0 font-weight-bold">
										<a class="text-primary">{{ scope.row.title }}</a>
									</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="实付款" align="center" width="110">
						<template slot-scope="scope">
							<span>￥20</span>
							<p><small>(含运费:￥0.00)</small></p>
						</template>
					</el-table-column>
					<el-table-column label="买家" align="center" width="110">
						<template slot-scope="scope">
							<span>用户名</span>
							<p><small>(用户id:11)</small></p>
						</template>
					</el-table-column>
					<el-table-column label="支付方式" prop="status" align="center" width="120">
						<template slot-scope="scope">
							<span class="badge badge-success">微信支付</span>
						</template>
					</el-table-column>
					<el-table-column label="配送方式" prop="stock" align="center"></el-table-column>
					<el-table-column label="交易状态" prop="pprice" align="center" width="170">
						<template slot-scope="scope">
							<div>
								付款状态:
								<span class="badge badge-success">已付款</span>
							</div>
							<div>
								发货状态:
								<span class="badge badge-success">待发货</span>
							</div>
							<div>
								收货状态:
								<span class="badge badge-success">待发货</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="120" align="center">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" plain>订单详情</el-button>
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
					name: '全部'
				},
				{
					name: '待付款'
				},
				{
					name: '待发货'
				},
				{
					name: '已发货'
				},
				{
					name: '已收货'
				},
				{
					name: '已完成'
				},
				{
					name: '已关闭'
				},
				{
					name: '退款中'
				}
			],

			// 搜索参数
			form: {
				code: '',
				type: '',
				time: '',
				username: '',
				phone: ''
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
				code: '',
				type: '',
				time: '',
				username: '',
				phone: ''
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
		}
	}
};
</script>

<style></style>
