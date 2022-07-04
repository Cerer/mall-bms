<!-- 物流设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="运费模板" name="first">
				<div><el-button type="primary" size="mini">添加模板</el-button></div>
				<el-table :data="tableData" class="mt-3" border>
					<el-table-column label="模板名称" prop="name"></el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{ scope.row.type | formatType }}
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="order" align="center"></el-table-column>
					<el-table-column label="添加时间" prop="create_time" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="150">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="物流跟踪" name="second">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="快递100 Customer">
						<el-input
							v-model="form.customer"
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
						<el-input v-model="form.key" size="mini" style="width: 50%;" placeholder="快递100 key"></el-input>
					</el-form-item>
					<el-form-item><el-button type="primary">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 默认tab选中
			activeName: 'first',

			// 运费模板数据
			tableData: [
				{
					name: '全国统一邮费',
					type: 1,
					order: 100,
					create_time: '2022-06-30 12:45:23',
					status: 1
				}
			],

			// 表单数据
			form: {
				customer: '',
				key: ''
			}
		};
	},

	filters: {
		formatType(value) {
			let arr = ['按重量', '按件数'];
			return arr[value];
		}
	}
};
</script>

<style></style>
