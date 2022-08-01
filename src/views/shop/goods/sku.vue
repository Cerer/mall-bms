<!-- 商品规格 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<!-- 规格选择 -->
		<div class="pt-3">
			<el-form label-position="right" label-width="80px">
				<el-form-item label="商品规格">
					<el-radio-group :value="skus_type" size="medium" @input="vModel('skus_type', $event)">
						<el-radio-button :label="0">统一规格</el-radio-button>
						<el-radio-button :label="1">多规格</el-radio-button>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<!-- 单一规格 -->
			<template v-if="skus_type === 0">
				<el-form ref="sku_value" :model="sku_value" label-position="right" label-width="80px">
					<el-form-item label="市场价格">
						<el-input v-model="sku_value.oprice" type="number" placeholder="" class="w-25">
							<template slot="append">
								件
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="销售价格">
						<el-input v-model="sku_value.pprice" type="number" placeholder="" class="w-25">
							<template slot="append">
								件
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="成本价格">
						<el-input v-model="sku_value.cprice" type="number" placeholder="" class="w-25">
							<template slot="append">
								件
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="商品重量">
						<el-input v-model="sku_value.weight" type="number" placeholder="" class="w-25">
							<template slot="append">
								公斤
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="商品体积">
						<el-input v-model="sku_value.volume" type="number" placeholder="" class="w-25">
							<template slot="append">
								立方米
							</template>
						</el-input>
					</el-form-item>
				</el-form>
			</template>

			<!-- 多规格 -->
			<template v-else>
				<!-- 规格卡片 -->
				<el-form label-position="right" label-width="80px">
					<el-form-item label="添加规格">
						<sku-card
							v-for="(item, index) in sku_card"
							:key="index"
							:item="item"
							:index="index"
							:total="skuCardTotal"
						></sku-card>

						<el-button type="success" size="mini" @click="addSkuCardEvent">添加规格</el-button>
					</el-form-item>
				</el-form>

				<el-form label-position="right" label-width="80px">
					<el-form-item label="批量设置">
						<el-button
							v-for="(btnItem, btnIndex) in updateList"
							:key="btnIndex"
							type="text"
							@click="changeUpdate(btnItem)"
						>
							{{ btnItem.name }}
						</el-button>
					</el-form-item>
					<el-form-item label="规格设置"><sku-table ref="table"></sku-table></el-form-item>
				</el-form>
			</template>
		</div>

		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
import skuCard from '@/components/shop/create/sku/sku-card.vue';
import skuTable from '@/components/shop/create/sku-table.vue';
import { mapState, mapMutations } from 'vuex';
export default {
	inject: ['app', 'layout'],

	components: {
		skuCard,
		skuTable
	},

	data() {
		return {
			id: 0,

			// 单规格表单
			sku_value: {
				oprice: 0,
				pprice: 0,
				cprice: 0,
				weight: 0,
				volume: 0
			},

			updateList: [
				{ name: '销售价', key: 'pprice' },
				{ name: '市场价', key: 'oprice' },
				{ name: '成本价', key: 'cprice' },
				{ name: '库存', key: 'stock' },
				{ name: '体积', key: 'volume' },
				{ name: '重量', key: 'weight' }
			]
		};
	},

	computed: {
		...mapState({
			skus_type: state => state.goods_create.skus_type,
			sku_card: state => state.goods_create.sku_card
		}),

		skuCardTotal() {
			return this.sku_card.length;
		}
	},

	created() {
		this.id = this.$route.params.id;
		if (!this.id) {
			this.$message({
				type: 'error',
				message: '非法参数'
			});
			return this.$router.push({
				name: 'shop_goods_list'
			});
		}

		// 获取之前商品详情
		this.layout.showLoading();
		let defauleVal = ['属性值', '#FFFFFF', '/favicon.ico'];
		this.axios
			.get(`/admin/goods/read/${this.id}`, {
				token: true
			})
			.then(res => {
				let data = res.data.data;
				this.vModel(
					'sku_card',
					data.goodsSkusCard.map(item => {
						item.list = item.goodsSkusCardValue;
						item.list.map(v => {
							v.text = item.type === 0 ? v.value : defauleVal[0];
							v.color = item.type === 1 ? v.value : defauleVal[1];
							v.image = item.type === 2 ? v.value : defauleVal[2];
							return v;
						});
						return item;
					})
				);
				this.vModel('skus_type', data.sku_type);
				let value = {
					oprice: 0,
					pprice: 0,
					cprice: 0,
					weight: 0,
					volume: 0
				};
				this.sku_value = data.sku_value ? data.sku_value : value;

				this.$nextTick(() => {
					if (this.$refs.table) {
						this.$refs.table.list = data.goodsSkus;
					}
				});

				this.layout.hideLoading();
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},

	methods: {
		...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),

		// 添加规格
		addSkuCardEvent() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card`,
					{
						goods_id: this.id,
						name: '规格名称',
						order: 50,
						type: 0
					},
					{
						token: true
					}
				)
				.then(res => {
					let data = res.data.data;
					data.list = [];
					this.addSkuCard(data);
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 修改state
		vModel(key, value) {
			this.vModelState({ key, value });
		},

		// 批量设置
		changeUpdate(btnItem) {
			this.$prompt(`请输入${btnItem.name}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'number',
				inputValidator(val) {
					if (val === '' || val === null) {
						return '输入内容不能为空';
					}
				}
			})
				.then(({ value }) => {
					this.$refs.table.list.forEach(i => {
						i[btnItem.key] = value;
					});
					this.$message({
						type: 'success',
						message: '批量设置' + btnItem.name + '值成功'
					});
				})
				.catch(() => {});
		},

		// 提交数据(有问题，多条数据提交不了，报500错误)
		submit() {
			let list = [];
			if (this.$refs.table) {
				list = this.$refs.table.list.map(item => {
					item.goods_id = this.id;
					return item;
				});
			}

			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/updateskus/${this.id}`,
					{
						sku_type: this.skus_type,
						sku_value: this.sku_value,
						goodsSkus: list
					},
					{
						token: true
					}
				)
				.then(() => {
					this.$message({
						type: 'success',
						message: '修改成功'
					});
					this.$router.push({
						name: 'shop_goods_list'
					});
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		}
	}
};
</script>

<style></style>
