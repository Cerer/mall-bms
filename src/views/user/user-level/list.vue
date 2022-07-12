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
			<el-table-column label="折扣率(%)" prop="discount" align="center"></el-table-column>
			<el-table-column label="等级序号" prop="level" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="150">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{ scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除</el-button>
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
							v-model="form.max_price"
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
							v-model="form.max_times"
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
				<el-form-item label="折扣率(%)" prop="discount">
					<el-input
						v-model="form.discount"
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],

	mixins: [common],

	data() {
		return {
			// 接口标识
			preUrl: 'user_level',

			// 升级标注
			level: 0,

			// 会员等级数据
			tableData: [],

			// 是否显示添加/修改类型弹框
			createModel: false,

			// 表单
			form: {
				name: '',
				max_price: 0,
				max_times: 0,
				discount: 0,
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
					value: 'max_price'
				},
				{
					name: '累计次数',
					value: 'max_times'
				}
			];
			return arr[this.level];
		}
	},

	methods: {
		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
		},

		// 打开添加/修改会员弹框
		openModel(e = false) {
			if (!e) {
				//新增
				this.form = {
					name: '',
					max_price: 0,
					max_times: 0,
					discount: 0,
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
			let self = this;
			let id = 0;
			if (self.editIndex !== -1) {
				id = this.tableData[this.editIndex].id;
			}
			self.addOrEdit(self.form, id);
			self.createModel = false;
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
