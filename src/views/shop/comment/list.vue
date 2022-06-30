<!-- 商品评论 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search ref="buttonSearch" class="py-2 border-bottom" placeholder="要搜索的商品名称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button type="danger" size="mini" @click="deteleAll">批量删除</el-button>
			</template>

			<!--右边-搜索表单 -->
			<template #form>
				<el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
					<el-form-item label="评价用户" class="mb-0">
						<el-input v-model="form.username" placeholder="评价用户" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="评价类型" class="mb-0">
						<el-select v-model="form.type" placeholder="请选择评价类型" size="mini">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
							v-model="form.time"
							type="daterange"
							size="small"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column type="expand">
				<template slot-scope="props">
					<div class="media">
						<img
							src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF"
							class="mr-3 rounded-circle"
							alt=""
							style="width: 70px;height: 70px;"
						/>
						<div class="media-body">
							<h6 class="mt-0 d-flex align-items-center">
								用户名1
								<small class="ml-1">2022-06-30 12:00:00</small>
								<el-button class="ml-auto mr-2" type="danger" size="mini">删除</el-button>
							</h6>
							<p>评论内容</p>

							<div class="media mt-3">
								<a class="mr-3" href="#">
									<img
										class="rounded-circle"
										src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF"
										alt=""
										style="width: 70px;height: 70px;"
									/>
								</a>
								<div class="media-body">
									<h6 class="mt-0 d-flex align-items-center">
										客服一
										<small class="ml-1">2022-06-30 12:00:00</small>
										<el-button-group class="ml-auto mr-2">
											<el-button type="primary" size="mini">修改</el-button>
											<el-button type="danger" size="mini">删除</el-button>
										</el-button-group>
									</h6>
									<p>回复内容</p>
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="ID" prop="id" align="center" width="70"></el-table-column>
			<el-table-column prop="title" label="商品" width="400">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" :src="scope.row.goods.cover" alt="" style="width: 60px;height: 60px;" />
						<div class="media-body">
							<p class="mt-0 mb-0 font-weight-bold">{{ scope.row.goods.title }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价信息" width="220">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<p>用户名：{{ scope.row.username }}</p>
						<div class="d-flex align-items-center">
							评分：
							<el-rate
								v-model="scope.row.star"
								disabled
								show-score
								text-color="#ff9900"
								score-template="{value}"
							></el-rate>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价时间" prop="create_time" align="center" width="180"></el-table-column>
			<el-table-column label="是否显示" prop="status" align="center" width="150">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status"></el-switch>
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
			// 商品表格数据
			tableData: [
				{
					id: 1,
					goods: {
						title: '荣耀 V10全网通 标配版 4G+64G 魅丽红',
						cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg'
					},
					username: '用户名称',
					star: 5,
					create_time: '2022-06-30 12:00:00',
					status: 1
				}
			],

			// 分页当前页码
			currentPage: 1,

			// 表格多选数据
			multipleSelection: [],

			// 高级搜索参数
			form: {
				username: '',
				type: '',
				time: ''
			}
		};
	},

	created() {
		this.__getData();
	},

	methods: {
		// 高级搜索
		searchEvent(e) {},

		// 清空筛选条件
		clearSearch() {},

		// 获取表格数据
		__getData() {},

		// 商品表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		//批量删除规格数据
		deteleAll() {
			this.$confirm('是否确认批量删除规格?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.multipleSelection.forEach(v => {
						let index = this.tableData.findIndex(i => i.id === v.id);

						if (index != -1) {
							this.tableData.splice(index, 1);
						}
					});
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.multipleSelection = [];
				})
				.catch(() => {});
		}
	}
};
</script>

<style></style>
