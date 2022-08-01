<!-- 物流设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="运费模板" name="first">
				<div><el-button type="primary" size="mini" @click="openModal((index = false))">添加模板</el-button></div>
				<el-table :data="tableData" class="mt-3" border>
					<el-table-column label="模板名称" prop="name"></el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{ scope.row.type | formatType }}
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="order" align="center"></el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="openModal(scope.$index)">修改</el-button>
							<el-button type="text" size="mini" @click="openDrawer(scope.row)">
								配置模板({{ scope.row.express_values.length }})
							</el-button>
							<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="物流跟踪" name="second">
				<el-form ref="logisticsForm" :model="logisticsForm" label-width="140px">
					<el-form-item label="快递100 Customer">
						<el-input
							v-model="logisticsForm.customer"
							size="mini"
							style="width: 50%;"
							placeholder="快递100 Customer"
						></el-input>
						<small class="text-secondary d-block">
							用于查询物流信息，
							<a href="#">快递100申请</a>
						</small>
					</el-form-item>
					<el-form-item label="快递100 key">
						<el-input
							v-model="logisticsForm.key"
							size="mini"
							style="width: 50%;"
							placeholder="快递100 key"
						></el-input>
					</el-form-item>
					<el-form-item><el-button type="primary">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>

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

		<!-- 添加/修改模板 -->
		<el-dialog title="添加模板" :visible.sync="createModal" top="5vh" width="55%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入模板名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-input v-model="form.order" type="number" :min="1" label="请输入排序" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="收费方式">
					<el-radio-group v-model="form.type">
						<el-radio :label="0">按件数</el-radio>
						<el-radio :label="1">按重量</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="createModal = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 配置模板 -->
		<el-drawer :visible.sync="drawer" :with-header="false" size="80%">
			<div class="p-3">
				<el-table :data="express_values" class="mt-3" border>
					<el-table-column label="ID" prop="id" align="center" width="50"></el-table-column>
					<el-table-column label="可配送区域" prop="name" align="center" width="200">
						<template slot-scope="scope">
							<el-cascader
								v-model="scope.row.region"
								:options="options"
								:props="props"
								size="mini"
								collapse-tags
								clearable
								@change="changeValue(scope.row)"
							></el-cascader>
						</template>
					</el-table-column>
					<el-table-column label="首件(个)/首重(Kg)" align="center">
						<template slot-scope="scope">
							<el-input
								v-model="scope.row.first"
								type="number"
								size="mini"
								@change="changeValue(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="运费(元)" align="center">
						<template slot-scope="scope">
							<el-input
								v-model="scope.row.first_price"
								type="number"
								size="mini"
								@change="changeValue(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="续件/续重" align="center">
						<template slot-scope="scope">
							<el-input
								v-model="scope.row.add"
								type="number"
								size="mini"
								@change="changeValue(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="续费(元)" align="center">
						<template slot-scope="scope">
							<el-input
								v-model="scope.row.add_price"
								type="number"
								size="mini"
								@change="changeValue(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="deteleValue(scope.row, scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-button type="primary" class="mt-3" @click="addValue">添加策略</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],

	mixins: [common],

	data() {
		return {
			// 接口标识
			preUrl: 'express',

			// 默认tab选中
			activeName: 'first',

			// 运费模板数据
			tableData: [],

			// 无聊跟踪表单数据
			logisticsForm: {
				customer: '',
				key: ''
			},

			// 是否显示添加/修改模板弹框
			createModal: false,

			// 添加表单数据
			form: {
				name: '',
				order: 0,
				type: 0
			},

			// 区分是新增还是修改
			formIndex: -1,

			// 是否显示配置模板弹框
			drawer: false,

			// 当前点击数据ID
			drawerId: 0,

			// 配置模板数据
			express_values: [],

			// 级联选择器配置
			props: { multiple: true, label: 'name', value: 'name' },

			//可选区域数据
			options: []
		};
	},

	filters: {
		formatType(value) {
			let arr = ['按件数', '按重量'];
			return arr[value];
		}
	},

	methods: {
		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
			this.options = data.area.map(item => {
				item.children = item.citys.map(i => {
					i.children = i.districts;
					return i;
				});
				return item;
			});
		},

		// 打开弹框
		openModal(index) {
			// 新增
			if (index === false) {
				this.form = {
					name: '',
					order: 0,
					type: 0
				};
				this.formIndex = -1;
				return (this.createModal = true);
			}

			// 修改
			let item = this.tableData[index];
			this.form = {
				name: item.name,
				order: item.order,
				type: item.type
			};
			this.formIndex = index;
			this.createModal = true;
		},

		// 提交数据
		submit() {
			let id = 0;
			if (this.formIndex !== -1) {
				id = this.tableData[this.formIndex].id;
			}

			this.addOrEdit(this.form, id);
			this.createModal = false;
		},

		// 打开配置模板
		openDrawer(item) {
			this.express_values = item.express_values;
			this.drawer = true;
			this.drawerId = item.id;
		},

		// 添加运费模板策略
		addValue() {
			this.axios
				.post(
					`/admin/express_value`,
					{
						first: 0,
						first_price: 0,
						add: 0,
						add_price: 0,
						express_id: this.drawerId,
						region: [['全国', '所有', '所有']]
					},
					{
						token: true
					}
				)
				.then(res => {
					let data = res.data.data;
					this.express_values.push(data);
				});
		},

		// 修改运费模板策略
		changeValue(item) {
			this.axios.post(`/admin/express_value/${item.id}`, item, {
				token: true
			});
		},

		// 删除运费模板策略
		deteleValue(item, index) {
			this.axios
				.post(
					`/admin/express_value/${item.id}/delete`,
					{},
					{
						token: true
					}
				)
				.then(() => {
					this.express_values.slice(index, 1);
					this.$message({
						type: 'success',
						message: '删除成功'
					});
				});
		}
	}
};
</script>

<style></style>
