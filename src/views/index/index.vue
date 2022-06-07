<template>
	<div>
		<!-- 统计数据 -->
		<el-row :gutter="20">
			<el-col :span="6" v-for="(item, index) in counts" :key="index">
				<el-card class="box-card" shadow="hover">
					<div class="d-flex align-items-center">
						<i
							:class="[item.icon, item.color]"
							class="h4 mb-0 text-white text-center mr-3"
							style="width: 40px;height: 40px;line-height: 40px;"
						></i>
						<div>
							<h4 class="mb-1">{{ item.num }}</h4>
							<small class="text-muted">{{ item.desc }}</small>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 店铺,订单提示 / 统计图 -->
		<el-row :gutter="20" class="mt-3">
			<el-col :span="12" style="height: 370px;" class="d-flex flex-column justify-content-between">
				<!-- 店铺,订单提示 -->
				<el-card v-for="(item, index) in hintList" :key="index" class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>{{ item.type }}</span>
						<el-button style="float: right; padding: 3px 0;color: gray;" type="text">{{ item.desc }}</el-button>
					</div>
					<div class="row">
						<div v-for="(item2, index2) in item.list" :key="index2" :class="item.list.length | getNum">
							<button class="btn btn-light w-100">
								<h4 class="mb-1">{{ item2.num }}</h4>
								<small class="text-muted">{{ item2.name }}</small>
							</button>
						</div>
					</div>
				</el-card>
			</el-col>

			<!-- 统计图 -->
			<el-col :span="12">
				<el-card class="box-card" style="height: 370px;">
					<div slot="header" class="clearfix">
						<span>卡片名称</span>
						<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
					</div>
					<div ref="myChart" style="width: 100%;height: 270px;"></div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import echarts from 'echarts';
export default {
	data() {
		return {
			// 统计列表
			counts: [
				{
					icon: 'el-icon-user-solid',
					num: 30,
					desc: '关注人数(个)',
					color: 'bg-primary'
				},
				{
					icon: 'el-icon-s-finance',
					num: 120,
					desc: '订单总数(笔)',
					color: 'bg-success'
				},
				{
					icon: 'el-icon-s-order',
					num: 4183.8,
					desc: '今日订单总金额(元)',
					color: 'bg-danger'
				},
				{
					icon: 'el-icon-s-data',
					num: 100,
					desc: '本月销量(笔)',
					color: 'bg-warning'
				}
			],

			// 店铺,订单提示
			hintList: [
				{
					type: '店铺及商品提示',
					desc: '您需要关注的店铺信息以及待处理事项',
					colNum: 3,
					list: [
						{
							num: 64,
							name: '出售中'
						},
						{
							num: 10,
							name: '待回复'
						},
						{
							num: 0,
							name: '库存预警'
						},
						{
							num: 3,
							name: '仓库中'
						}
					]
				},
				{
					type: '交易提示',
					desc: '您需要立即处理的交易订单',
					colNum: 2,
					list: [
						{
							num: 0,
							name: '待付款'
						},
						{
							num: 10,
							name: '待发货'
						},
						{
							num: 0,
							name: '已发货'
						},
						{
							num: 3,
							name: '已收货'
						},
						{
							num: 3,
							name: '退款中'
						},
						{
							num: 3,
							name: '待售后'
						}
					]
				}
			]
		};
	},

	filters: {
		getNum(value) {
			return `col-${12 / value}`;
		}
	},

	mounted() {
		// 初始化图表
		this.drawLine();
	},

	methods: {
		drawLine() {
			// let myChart = 
		}
	}
};
</script>
