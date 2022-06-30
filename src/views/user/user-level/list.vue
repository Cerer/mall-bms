<!-- 会员等级 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search class="py-2 border-bottom">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加等级</el-button>
			</template>

			<template #right>
				<div>
					<small class="mr-2">选择升级标准：</small>
					<el-radio-group v-model="level" size="mini">
						<el-radio-button :label="0">累计消费</el-radio-button>
						<el-radio-button :label="1">累计次数</el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border>
			<el-table-column label="等级名称" prop="name"></el-table-column>
			<el-table-column label="升级条件" align="center">
				<template slot-scope="scope">
					{{ getLevel.name + ':' + scope.row[getLevel.value] }}
				</template>
			</el-table-column>
			<el-table-column label="折扣率(%)" prop="discont" align="center"></el-table-column>
			<el-table-column label="等级序号" prop="level" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="150">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini" @click="deteleItem(scope.$index)">删除</el-button>
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

		<!-- 新增/修改弹框 -->
		<el-dialog title="添加等级" :visible.sync="createModel" top="5vh" width="55%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入等级名称" size="mini"></el-input>
					<small class="text-secondary d-block">设置会员等级名称</small>
				</el-form-item>
				<el-form-item label="等级权重" prop="level">
					<el-input-number v-model="form.level" :min="1" label="请输入等级权重" size="mini"></el-input-number>
					<small class="text-secondary d-block">
						设置会员等级排序（此参数决定等级的高低，排序越大等级越高，请谨慎选择）
					</small>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="升级条件">
					<div class="d-flex align-items-center">
						<small class="mr-2">累计消费满</small>
						<el-input
							v-model="form.consume"
							type="number"
							:min="0"
							placeholder="请输入内容"
							size="small"
							style="width: 200px;"
						>
							<template slot="append">
								元
							</template>
						</el-input>
						<small class="ml-2">设置会员等级所需要的累计消费必须大于等于0，单位：元</small>
					</div>
					<div class="d-flex align-items-center">
						<small class="mr-2">累计次数满</small>
						<el-input
							v-model="form.times"
							type="number"
							:min="0"
							placeholder="请输入内容"
							size="mini"
							style="width: 200px;"
						>
							<template slot="append">
								笔
							</template>
						</el-input>
						<small class="ml-2">设置会员等级所需要的购买量必须大于等于0，单位：笔</small>
					</div>
				</el-form-item>
				<el-form-item label="折扣率(%)" prop="discont">
					<el-input
						v-model="form.discont"
						type="number"
						:min="0"
						placeholder="请输入折扣率"
						size="mini"
						style="width: 200px;"
					>
						<template slot="append">
							%
						</template>
					</el-input>
					<small class="text-secondary d-block">
						折扣率单位为百分比，比如输入90，表示该会员等级的用户可以以商品原价的90%购买
					</small>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	inject: ['app'],

	data() {
		return {
			// 升级标注
			level: 0,

			// 商品表格数据
			tableData: [
				{
					id: 10,
					name: '普通会员',
					consume: 100,
					times: 10,
					discont: 10,
					level: 1,
					status: 1,
					create_time: '2022-06-30 12:45:23'
				}
			],

			// 分页当前页码
			currentPage: 1,

			// 是否显示添加/修改类型弹框
			createModel: false,

			// 表单
			form: {
				name: '',
				consume: 0,
				times: 0,
				discont: 0,
				level: 1,
				status: 1
			},

			// 判断是新增还是编辑大于-1为修改
			editIndex: -1
		};
	},

	computed: {
		getLevel() {
			let arr = [
				{
					name: '累计消费',
					value: 'consume'
				},
				{
					name: '累计次数',
					value: 'times'
				}
			];
			return arr[this.level];
		}
	},

	created() {
		this.__getData();
	},

	methods: {
		// 获取表格数据
		__getData() {},

		// 修改状态
		changeStatus(item) {
			item.status = !item.status;
			this.$message({
				message: item.status ? '启用' : '禁用',
				type: 'success'
			});
		},

		// 打开添加/修改会员弹框
		openModel(e = false) {
			if (!e) {
				//新增
				this.form = {
					name: '',
					consume: 0,
					times: 0,
					discont: 0,
					level: 1,
					status: 1
				};
				this.editIndex = -1;
			} else {
				//修改
				this.form = {
					...e.row
				};
				this.editIndex = e.$index;
			}

			this.createModel = true;
		},

		// 提交会员数据
		submit() {
			let msg = '添加成功';
			if (this.editIndex === -1) {
				this.tableData.unshift({
					...this.form
				});
			} else {
				msg = '修改成功';
				let list = this.tableData[this.editIndex];
				list.name = this.form.name;
				list.consume = this.form.consume;
				list.times = this.form.times;
				list.discont = this.form.discont;
				list.level = this.form.level;
				list.status = this.form.status;
			}
			this.createModel = false;
			this.$message({
				message: msg,
				type: 'success'
			});
		},

		// 删除类型
		deteleItem(index) {
			this.$confirm('是否确认删除该等级?', '提示', {
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
		},

		// 选择头像
		chooesImg() {
			this.app.chooseImage(res => {
				this.form.avatar = res[0].src;
			}, 1);
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
