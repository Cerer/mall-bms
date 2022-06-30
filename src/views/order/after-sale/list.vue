<!-- 售后管理 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search class="py-2 border-bottom">
			<template #right>
				<div class="d-flex align-items-center">
					<el-date-picker
						v-model="search.time"
						type="daterange"
						size="mini"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 350px;"
					></el-date-picker>
					<el-input
						v-model="search.keyword"
						size="mini"
						placeholder="请输入订单号"
						class="mx-2"
						style="width: 200px;"
					></el-input>
					<el-button type="info" size="mini">搜索</el-button>
				</div>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column label="商品信息" prop="name"></el-table-column>
			<el-table-column label="商品清单" prop="username" align="center"></el-table-column>
			<el-table-column label="订单金额" prop="price" align="center"></el-table-column>
			<el-table-column label="收货信息" prop="price" align="center"></el-table-column>
			<el-table-column label="买家" prop="content" align="center"></el-table-column>
			<el-table-column label="交易状态" prop="code" align="center"></el-table-column>
			<el-table-column label="创建时间" prop="create_time" align="center"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button-group>
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
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				></el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
export default {
	data() {
		return {
			//搜索参数
			search: {
				time: '',
				keyword: ''
			},

			// 商品表格数据
			tableData: [],

			// 分页当前页码
			currentPage: 1,

			// 表格多选数据
			multipleSelection: []
		};
	},

	created() {
		this.__getData();
	},

	methods: {
		// 获取表格数据
		__getData() {},

		// 商品表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		// 删除类型
		deteleItem(index) {
			this.$confirm('是否确认删除类型?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.tableData.splice(index, 1);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style>
/* 默认隐藏删除图片 */
.sku-list-item > i {
	display: none;
	cursor: pointer;
}

.sku-list-item:hover {
	background-color: #f4f4f4;
}

/* 鼠标移上去隐藏文字 */
.sku-list-item:hover > font {
	display: none;
}

/* 鼠标移上去显示删除图片 */
.sku-list-item:hover > i {
	display: inline-block;
}
</style>
