<!-- 创建商品 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 14px;left: 180px;">
			<el-button icon="el-icon-arrow-left" size="mini">回到商品列表</el-button>
		</router-link>

		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane label="基础设置"><base-create></base-create></el-tab-pane>
			<el-tab-pane label="商品规格">
				<!-- 规格选择 -->
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
					<single-attrs></single-attrs>
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

							<el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
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
			</el-tab-pane>
			<el-tab-pane label="商品属性">
				<el-form ref="form" label-width="80px">
					<el-form-item label="商品类型">
						<el-select :value="goods_type_id" placeholder="请选择商品类型" @change="vModel('goods_type_id', $event)">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-card class="box-card">
					<div slot="header" class="clearfix"><span>商品属性</span></div>
					<el-form ref="form" label-width="80px" inline>
						<el-form-item label="手机型号">
							<el-input
								:value="goods_attrs.phone_model"
								placeholder="请输入手机型号"
								@input="vModelGoodsAttrs({ key: 'phone_model', value: $event })"
							></el-input>
						</el-form-item>
					</el-form>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="媒体设置">
				<el-form label-width="80px">
					<el-form-item label="商品大图">
						<div class="d-flex flex-wrap">
							<div
								v-for="(item, index) in banners"
								:key="index"
								class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
								style="width: 150px;height: 150px;cursor: pointer;position: relative;"
								@click="chooesImg(index)"
							>
								<img v-if="item.src" :src="item.src" style="width: 100%;height: 100%;" />
								<i v-else class="el-icon-plus text-muted" style="font-size: 30px;"></i>
								<i
									class="el-icon-delete p-2 text-white"
									style="position: absolute;top: 0;right: 0;background-color: rgba(0, 0, 0, 0.4);"
									@click.stop="deleteImg(index)"
								></i>
							</div>
							<div
								v-if="banners.length < 9"
								class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
								style="width: 150px;height: 150px;cursor: pointer;"
								@click="chooesImg(-1)"
							>
								<i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
							</div>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="商品详情"><tinymce ref="tinymceEditor" v-model="msg" @onClick="onClick"></tinymce></el-tab-pane>
			<el-tab-pane label="折扣设置">
				<el-form ref="form" label-width="80px" inline>
					<el-form-item label="会员价">
						<el-input :value="discount" @input="vModel('discount', $event)">
							<template slot="append">
								%
							</template>
						</el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import baseCreate from '@/components/shop/create/base-create.vue';
import singleAttrs from '@/components/shop/create/single-attrs.vue';
import skuCard from '@/components/shop/create/sku/sku-card.vue';
import skuTable from '@/components/shop/create/sku-table.vue';
import tinymce from '@/components/common/tinymce.vue';
import { mapState, mapMutations } from 'vuex';
export default {
	inject: ['app'],

	components: {
		baseCreate,
		singleAttrs,
		skuCard,
		skuTable,
		tinymce
	},

	data() {
		return {
			// tabs默认选择第一个
			tabIndex: 0,

			msg: 'Welcome to Use Tinymce Editor',

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
			sku_card: state => state.goods_create.sku_card,
			banners: state => state.goods_create.banners,
			goods_type_id: state => state.goods_create.goods_type_id,
			goods_attrs: state => state.goods_create.goods_attrs,
			discount: state => state.goods_create.discount
		}),

		skuCardTotal() {
			return this.sku_card.length;
		}
	},

	created() {},

	methods: {
		...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),

		// 修改state
		vModel(key, value) {
			this.vModelState({ key, value });
		},

		// tabs切换获取数据
		handleClick(tab, event) {},

		// 富文本点击
		onClick(e, editor) {
			console.log('click');
			console.log(e);
			console.log(editor);
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
					console.log(this.$refs.table.list);
					this.$message({
						type: 'success',
						message: '批量设置' + btnItem.name + '值成功'
					});
				})
				.catch(() => {});
		},

		// 选择商品图片
		chooesImg(index) {
			const MAX = 9;
			let count = MAX - this.banners.length;
			this.app.chooseImage(
				res => {
					let list = [];
					if (index === -1) {
						list = [...this.banners, ...res];
					} else {
						list = [...this.banners];
						list[index] = res[0];
					}
					this.vModel('banners', list);
				},
				index === -1 ? count : 1
			);
		},

		// 删除选中商品大图
		deleteImg(index) {
			this.$confirm('是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let list = [...this.banners];
					list.splice(index, 1);
					this.vModel('banners', list);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style></style>
