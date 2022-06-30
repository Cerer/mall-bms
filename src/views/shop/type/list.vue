<!-- 商品类型列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search class="py-2 border-bottom" :showSearch="false">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加类型</el-button>
				<el-button type="danger" size="mini" @click="deteleAll">批量删除</el-button>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center"></el-table-column>
			<el-table-column prop="name" label="类型名称"></el-table-column>
			<el-table-column label="属性标签" width="400" align="center">
				<template slot-scope="scope">
					{{ scope.row.value_lsit | dealValue }}
				</template>
			</el-table-column>
			<el-table-column prop="order" label="属性排序" align="center"></el-table-column>
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
		<el-dialog title="添加类型" :visible.sync="createModel" top="5vh" width="80%">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入类型名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="属性排序">
					<el-input-number v-model="form.order" :min="1" size="mini"></el-input-number>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="form.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关联规格">
					<div class="d-flex">
						<span class="px-3 py-2 border rounded mr-3 sku-list-item" style="line-height: initial;">
							<font>颜色</font>
							<i class="el-icon-delete"></i>
						</span>
						<el-button><i class="el-icon-plus"></i></el-button>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					<el-table :data="value_lsit" style="width: 100%">
						<el-table-column prop="order" label="排序" width="100">
							<template slot-scope="scope">
								<el-input v-model="scope.row.order" type="number" placeholder="排序" size="mini"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="属性名称" width="130">
							<template slot-scope="scope">
								<el-input v-model="scope.row.name" placeholder="属性名称" size="mini"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="所属类型" width="130">
							<template slot-scope="scope">
								<el-select v-model="scope.row.type" placeholder="请选择所属类型" size="mini">
									<el-option label="输入框" value="input"></el-option>
									<el-option label="单选框" value="radio"></el-option>
									<el-option label="多选框" value="checkbox"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="是否显示" width="80">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="属性值">
							<template slot-scope="scope" v-if="scope.row.type != 'input'">
								<el-input
									v-if="scope.row.isEdit"
									v-model="scope.row.value"
									type="textarea"
									:rows="2"
									placeholder="一行为一个属性值,多个属性值用换行输入"
								></el-input>
								<span v-else>{{ scope.row.value }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="180">
							<template slot-scope="scope">
								<el-button v-if="scope.row.type != 'input'" type="text" size="mini" @click="editRow(scope)">
									{{ scope.row.isEdit ? '完成' : '编辑属性值' }}
								</el-button>
								<el-button type="text" size="mini" @click="delRow(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item>
					<el-button type="text" size="mini" icon="el-icon-plus" @click="addValue">添加一个属性</el-button>
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
					name: '鞋子',
					order: 50,
					status: 1,
					sku_list: [{ id: 1, name: '颜色' }, { id: 2, name: '尺寸' }],
					value_lsit: [
						{
							order: 50,
							name: '特性',
							type: 'input',
							value: ''
						},
						{
							order: 50,
							name: '电池',
							type: 'input',
							value: ''
						}
					]
				}
			],

			// 分页当前页码
			currentPage: 1,

			// 表格多选数据
			multipleSelection: [],

			// 是否显示添加/修改类型弹框
			createModel: false,

			// 表单
			form: {
				name: '',
				order: 50,
				status: 1,
				sku_list: []
			},

			value_lsit: [
				{
					order: 50,
					name: '属性名称',
					type: 'input',
					value: '属性值',
					isEdit: false
				}
			],

			// 表单校验
			rules: {
				name: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }]
			},

			// 判断是新增还是编辑大于-1为修改
			editIndex: -1
		};
	},

	filters: {
		dealValue(value) {
			let list = value.map(v => v.name);
			return list.join(',');
		}
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

		// 打开添加/修改类型弹框
		openModel(e = false) {
			if (!e) {
				//新增
				this.form = {
					name: '',
					order: 50,
					status: 1,
					sku_list: []
				};
				this.value_lsit = [];
				this.editIndex = -1;
			} else {
				//修改
				this.form = {
					...e.row
				};
				this.value_lsit = [...e.row.value_lsit];
				this.editIndex = e.$index;
			}

			this.createModel = true;
		},

		// 提交类型
		submit() {
			this.$refs.form.validate(valid => {
				let result = true;
				let msg = [];
				this.value_lsit.forEach((item, index) => {
					let no = index + 1;
					if (item.order == '') {
						result = result && false;
						msg.push('第' + no + '行:排序不能为空');
					}

					if (item.name == '') {
						result = result && false;
						msg.push('第' + no + '行:属性名称不能为空');
					}

					if (item.type != 'input' && item.value == '') {
						result = result && false;
						msg.push('第' + no + '行:属性值不能为空');
					}
				});

				if (!result) {
					let temp = '';
					msg.forEach(v => {
						temp += `<li>${v}</li>`;
					});
					return this.$notify({
						title: '属性列表提示',
						dangerouslyUseHTMLString: true,
						message: `<ul>${temp}</ul>`,
						type: 'warning',
						duration: 3000
					});
				}

				if (valid) {
					let msg = '添加成功';
					if (this.editIndex === -1) {
						this.tableData.unshift({
							...this.form,
							value_lsit: [...this.value_lsit]
						});
					} else {
						msg = '修改成功';
						let list = this.tableData[this.editIndex];
						list.name = this.form.name;
						list.order = this.form.order;
						list.status = this.form.status;
						list.type = this.form.type;
						list.sku_list = this.form.sku_list;
						list.value_lsit = this.value_lsit;
					}
					this.createModel = false;
					this.$message({
						message: msg,
						type: 'success'
					});
				}
			});
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
		},

		//批量删除类型数据
		deteleAll() {
			this.$confirm('是否确认批量删除类型?', '提示', {
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
		},

		// 添加属性值
		addValue() {
			this.value_lsit.push({
				order: 50,
				name: '',
				type: 'input',
				value: '',
				isEdit: false
			});
		},

		// 编辑属性
		editRow(scope) {
			scope.row.isEdit = !scope.row.isEdit;
		},

		// 删除属性
		delRow(index) {
			this.value_lsit.splice(index, 1);
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
