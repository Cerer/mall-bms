<!-- 创建商品--商品规格--多规格--规格设置 -->
<template>
	<table class="table table-sm table-bordered">
		<thead>
			<tr>
				<th
					v-for="(item, index) in tableThs"
					:key="index"
					scope="col"
					class="text-center"
					:rowspan="item.rowspan"
					:colspan="item.colspan"
					style="vertical-align: middle;"
				>
					{{ item.name }}
				</th>
			</tr>

			<tr>
				<th v-for="(item, index) in skuLabels" :key="index" scope="col" class="text-center" rowspan="1" colspan="1">
					{{ item.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<th v-for="(sku, skuIndex) in item.skus" :key="skuIndex" scope="row" class="text-center">{{ sku.value }}</th>
				<td class="text-center" width="100">
					<!-- <div class="btn btn-light border"><i class="el-icon-plus"></i></div> -->
					<div v-if="!item.image" class="btn btn-light border" @click="chooesImg(item)">
						<i class="el-icon-plus"></i>
					</div>

					<img
						v-else
						:src="item.image"
						alt=""
						class="rounded"
						style="width: 45px;height: 45px;cursor: pointer;"
						@click="chooesImg(item)"
					/>
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.pprice" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.oprice" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.cprice" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.stock" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.volume" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="number" v-model="item.weight" class="form-control text-center" />
				</td>
				<td class="text-center" width="100">
					<input type="text" v-model="item.code" class="form-control text-center" />
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	inject: ['app'],
	
	computed: {
		...mapGetters(['skuLabels', 'tableThs', 'tableData'])
	},

	watch: {
		tableData(newValue, oldValue) {
			this.list = newValue;
		}
	},

	data() {
		return {
			list: []
		};
	},

	mounted() {
		this.list = this.tableData;
	},

	methods: {
		// 选择图片
		chooesImg(item) {
			this.app.chooseImage(res => {
				item.image = res[0].src;
			}, 1);
		}
	}
};
</script>

<style></style>
