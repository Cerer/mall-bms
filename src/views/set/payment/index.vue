<!-- 交易设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="支付设置" name="first">
				<div><el-button type="primary" size="mini">添加模板</el-button></div>
				<el-table :data="tableData" class="mt-3" border>
					<el-table-column label="支付方式" align="left">
						<template slot-scope="scope">
							<div class="d-flex align-items-center">
								<img :src="scope.row.src" alt="" style="width: 40px;height: 40px;" class="rounded mr-2" />
								<div class="d-flex flex-column" style="align-items: flex-start;">
									<h6>{{ scope.row.name }}</h6>
									<small class="text-secondary d-block">{{ scope.row.desc }}</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="购物设置" name="second">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="未支付订单">
						<el-input v-model="form.customer" type="number" size="mini" style="width: 25%;" placeholder="未支付订单">
							<template slot="append">
								天后自动关闭
							</template>
						</el-input>
						<small class="text-secondary d-block">订单下单未付款，n天后自动关闭，设置0天不自动关闭</small>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input v-model="form.customer" type="number" size="mini" style="width: 25%;" placeholder="已发货订单">
							<template slot="append">
								天后自动确认收货
							</template>
						</el-input>
						<small class="text-secondary d-block">如果再期间未确认收货，系统自动完成收货，设置0天不自动收货</small>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input v-model="form.customer" type="number" size="mini" style="width: 25%;" placeholder="已完成订单">
							<template slot="append">
								天后允许申请售后
							</template>
						</el-input>
						<small class="text-secondary d-block">
							订单完成后，用户在n天内可以发起售后申请，设置0天不允许申请售后
						</small>
					</el-form-item>
					<el-form-item label="运费组合策略">
						<el-select v-model="form.region" placeholder="请选择运费组合策略" size="mini" style="width: 25%;">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
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
					name: '银联卡支付',
					desc: '该系统支持即时到账接口',
					src: require('../../../assets/image/set/payment/unionpay.png')
				},
				{
					name: '支付宝支付',
					desc: '该系统支持即时到账接口',
					src: require('../../../assets/image/set/payment/alipay.png')
				},
				{
					name: '微信支付',
					desc: '该系统支持微信网页支付和扫码支付',
					src: require('../../../assets/image/set/payment/weChatPay.png')
				}
			],

			// 表单数据
			form: {
				customer: '',
				region: ''
			}
		};
	}
};
</script>

<style></style>
