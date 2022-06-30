<!-- 商品规格列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search class="py-2 border-bottom" :showSearch="false">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加规格</el-button>
				<el-button type="danger" size="mini" @click="deteleAll">批量删除</el-button>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column prop="name" label="规格名称"></el-table-column>
			<el-table-column prop="value" label="规格值" width="400" align="center"></el-table-column>
			<el-table-column prop="order" label="排序" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="150">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{ scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="success" size="mini" plain @click="openModel(scope)">编辑</el-button>
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

		<!-- 新增/修改弹框 -->
		<el-dialog title="添加规格" :visible.sync="createModel" top="5vh">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入规格名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="form.order" :min="1" size="mini"></el-input-number>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="form.type" size="small">
						<el-radio :label="0" border>文章</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="value">
					<el-input
						v-model="form.value"
						type="textarea"
						:rows="2"
						placeholder="一行为一个规格项,多个规格项用换行输入"
					></el-input>
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
	data() {
		return {
			// 商品表格数据
			tableData: [
				{
					id: 1,
					name: '颜色1',
					value: '棕色,蓝色',
					order: 50,
					status: 1,
					type: 1
				},
				{
					id: 2,
					name: '颜色2',
					value: '棕色,蓝色',
					order: 50,
					status: 1,
					type: 1
				},
				{
					id: 3,
					name: '颜色3',
					value: '棕色,蓝色',
					order: 50,
					status: 1,
					type: 1
				},
				{
					id: 4,
					name: '颜色4',
					value: '棕色,蓝色',
					order: 50,
					status: 1,
					type: 1
				}
			],

			// 分页当前页码
			currentPage: 1,

			// 表格多选数据
			multipleSelection: [],

			// 是否显示添加/修改规格弹框
			createModel: false,

			// 表单
			form: {
				name: '',
				order: 50,
				status: 1,
				type: 0,
				value: ''
			},

			// 表单校验
			rules: {
				name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
				value: [{ required: true, message: '规格值不能为空', trigger: 'blur' }]
			},

			// 判断是新增还是编辑大于-1为修改
			editIndex: -1
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

		// 修改状态
		changeStatus(item) {
			item.status = !item.status;
			this.$message({
				message: item.status ? '启用' : '禁用',
				type: 'success'
			});
		},

		// 打开添加/修改规格弹框
		openModel(e = false) {
			if (!e) {
				//新增
				this.form = {
					name: '',
					order: 50,
					status: 1,
					type: 0,
					value: ''
				};
				this.editIndex = -1;
			} else {
				//修改
				this.form = {
					name: e.row.name,
					order: e.row.order,
					status: e.row.status,
					type: e.row.type,
					value: e.row.value.replace(/,/g, '\n')
				};
				this.editIndex = e.$index;
			}

			this.createModel = true;
		},

		// 提交规格
		submit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let msg = '添加成功';
					this.form.value = this.form.value.replace(/\n/g, ',');
					if (this.editIndex === -1) {
						this.tableData.unshift(this.form);
					} else {
						msg = '修改成功';
						let list = this.tableData[this.editIndex];
						list.name = this.form.name;
						list.order = this.form.order;
						list.status = this.form.status;
						list.type = this.form.type;
						list.value = this.form.value;
					}

					this.createModel = false;
					this.$message({
						message: msg,
						type: 'success'
					});
				}
			});
		},

		// 删除规格
		deteleItem(index) {
			this.$confirm('是否确认删除规格?', '提示', {
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
