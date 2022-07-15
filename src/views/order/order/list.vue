<!-- 订单列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(item, index) in tabBars" :key="index" :label="item.name"></el-tab-pane>

			<button-search ref="buttonSearch" placeholder="要搜索的订单编号" @search="searchEvent">
				<!-- 左边 -->
				<template #left>
					<el-button type="success" size="mini" class="ml-2">导出数据</el-button>
					<el-button type="danger" size="mini" @click="deteleAll">批量删除</el-button>
				</template>

				<!--右边-搜索表单 -->
				<template #form>
					<el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
						<el-form-item label="订单编号" class="mb-0">
							<el-input v-model="form.no" placeholder="订单编号" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="下单时间" class="mb-0">
							<el-date-picker
								v-model="form.time"
								type="daterange"
								size="mini"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyy-MM-dd"
							></el-date-picker>
						</el-form-item>
						<el-form-item label="收货人" class="mb-0">
							<el-input v-model="form.name" placeholder="收货人" size="mini"></el-input>
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
			<el-table :data="tableData" class="mt-2" border @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="45" align="center"></el-table-column>
				<el-table-column label="商品信息" width="380">
					<template slot-scope="scope">
						<div class="d-flex">
							<div style="flex: 1;">
								<p class="mb-0">订单编号：</p>
								<p class="mb-1">
									<small class="font-weight-bold">{{ scope.row.no }}</small>
								</p>
							</div>
							<div style="flex: 1;">
								<p class="mb-0">下单时间：</p>
								<p class="mb-1">
									<small class="font-weight-bold">{{ scope.row.create_time }}</small>
								</p>
							</div>
						</div>
						<div v-for="(item, index) in scope.row.order_items" :key="index" class="media border-top py-2">
							<img class="mr-3" :src="item.goods_item.cover" alt="" style="width: 60px;height: 60px;" />
							<div class="media-body">
								<p class="mt-0 mb-0 font-weight-bold">
									<a class="text-primary">{{ item.goods_item.title }}</a>
								</p>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="实付款" align="center" width="110">
					<template slot-scope="scope">
						<span>￥{{ scope.row.total_price }}</span>
						<p><small>(含运费:￥0.00)</small></p>
					</template>
				</el-table-column>
				<el-table-column label="买家" align="center" width="110">
					<template slot-scope="scope">
						<span>{{ scope.row.user.username }}</span>
						<p>
							<small>(用户id:{{ scope.row.user.id }})</small>
						</p>
					</template>
				</el-table-column>
				<el-table-column label="支付方式" prop="status" align="center" width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.payment_method === 'wechat'" class="badge badge-success">微信支付</span>
						<span v-else-if="scope.row.payment_method === 'alipay'" class="badge badge-primary">支付宝支付</span>
						<span v-else class="badge badge-secondary">待支付</span>
					</template>
				</el-table-column>
				<el-table-column label="配送方式" prop="stock" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.ship_data">
							<div>{{ scope.row.ship_data.express_company }}</div>
							<div>{{ scope.row.ship_data.express_no }}</div>
						</div>
						<span v-else class="badge badge-secondary">未配送</span>
					</template>
				</el-table-column>
				<el-table-column label="交易状态" prop="pprice" align="center" width="170">
					<template slot-scope="scope">
						<div>
							付款状态:
							<span class="badge" :class="scope.row.payment_method ? 'badge-success' : 'badge-secondary'">
								{{ scope.row.payment_method ? '已付款' : '未付款' }}
							</span>
						</div>
						<div>
							发货状态:
							<span class="badge" :class="scope.row.ship_data ? 'badge-success' : 'badge-secondary'">
								{{ scope.row.ship_data ? '已发货' : '待发货' }}
							</span>
						</div>
						<div>
							收货状态:
							<span
								class="badge"
								:class="scope.row.ship_status === 'received' ? 'badge-success' : 'badge-secondary'"
							>
								{{ scope.row.ship_status === 'received' ? '已收货' : '未收货' }}
							</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="mini">订单详情</el-button>
						<el-button
							v-if="
								scope.row.ship_status === 'pending' &&
									scope.row.closed === 0 &&
									scope.row.payment_method &&
									scope.row.refund_status === 'pending'
							"
							type="text"
							size="mini"
							@click="ship(scope.row)"
						>
							订单发货
						</el-button>
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
		</el-tabs>

		<!-- 订单发货 -->
		<el-dialog title="提示" :visible.sync="shipModel">
			<el-form ref="shipForm" :model="shipForm" :rules="shipRules" label-width="100px">
				<el-form-item label="快递公司" prop="express_company">
					<el-select v-model="shipForm.express_company">
						<el-option
							v-for="(item, index) in express_company_options"
							:key="index"
							:label="item.name"
							:value="item.name"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号" prop="express_no">
					<el-input type="text" v-model="shipForm.express_no" placeholder="请输入快递单号"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shipModel = false">取 消</el-button>
				<el-button type="primary" @click="shipSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],

	mixins: [common],

	data() {
		return {
			// 接口标识
			preUrl: 'order',

			// 当前tabs默认选中第一个
			tabIndex: 0,

			// tabs数据
			tabBars: [
				{
					name: '全部',
					key: 'all'
				},
				{
					name: '待付款',
					key: 'nopay'
				},
				{
					name: '待发货',
					key: 'noship'
				},
				{
					name: '已发货',
					key: 'shiped'
				},
				{
					name: '已收货',
					key: 'received'
				},
				{
					name: '已完成',
					key: 'finish'
				},
				{
					name: '已关闭',
					key: 'closed'
				},
				{
					name: '退款中',
					key: 'refunding'
				}
			],

			// 搜索参数
			form: {
				no: '',
				time: '',
				name: '',
				phone: ''
			},

			// 商品表格数据
			tableData: [],

			// 是否显示订单发货弹出框
			shipModel: false,

			// 发货表单
			shipForm: {
				express_company: '',
				express_no: ''
			},

			// 发货表单校验
			shipRules: {
				express_company: [{ required: true, message: '快递公司不能为空', trigger: 'change' }],
				express_no: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }]
			},

			// 快递公司下拉数据
			express_company_options: [],

			// 发货id
			shipId: ''
		};
	},

	computed: {
		//处理tab值
		tab() {
			return this.tabBars[this.tabIndex].key;
		},

		// 处理接口参数值
		params() {
			let str = '';
			for (let key in this.form) {
				let val = this.form[key];
				if (val) {
					if (Array.isArray(val)) {
						str += `&starttime=${val[0]}`;
						str += `&endtime=${val[1]}`;
					} else {
						str += `&${key}=${this.form[key]}`;
					}
				}
			}
			return str;
		}
	},

	created() {
		// 获取快递公司数据
		this.axios
			.get(`/admin/express_company/1?limst=50`, {
				token: true
			})
			.then(res => {
				let data = res.data.data;
				this.express_company_options = data.list;
			});
	},

	methods: {
		//获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`;
		},

		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
		},

		// tabs切换获取数据
		handleClick(tab, event) {
			this.__getData();
		},

		// 搜索
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				this.form.no = e;
				this.__getData();
				return;
			}

			//高级搜索
			this.__getData();
		},

		// 清空筛选条件
		clearSearch() {
			this.form = {
				no: '',
				time: '',
				name: '',
				phone: ''
			};
		},

		// 订单发货
		ship(item) {
			this.shipModel = true;
			this.shipId = item.id;
			this.shipReset();
		},

		// 发货提交
		shipSubmit() {
			this.layout.showLoading();
			this.$refs.shipForm.validate(valid => {
				if (valid) {
					this.axios
						.post(`/admin/order/${this.shipId}/ship`, this.shipForm, {
							token: true
						})
						.then(() => {
							this.layout.hideLoading();
							this.$message({
								type: 'success',
								message: '发货成功'
							});
							this.__getData();
							this.shipModel = false;
						})
						.catch(() => {
							this.layout.hideLoading();
						});
				}
			});
		},

		// 发货重置
		shipReset() {
			this.shipForm = {
				express_company: undefined,
				express_no: undefined
			};
			this.$refs.shipForm.resetFields();
		}
	}
};
</script>

<style></style>
