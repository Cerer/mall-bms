<!-- 商品规格弹框 -->
<template>
	<el-dialog title="商品规格选中" :visible.sync="showSkusDialog" width="80%" top="5vh">
		<el-container style="position: relative;height: 70vh;margin: -30px -20px;">
			<el-container>
				<!-- 侧边 | 商品规格列表 -->
				<el-aside class="bg-white border-right" width="200px" style="position: absolute;top: 0;left: 0;bottom: 0;">
					<ul class="list-group list-group-flush">
						<li
							v-for="(item, index) in skusList"
							:key="index"
							class="list-group-item list-group-item-action"
							:class="skusIndex === index ? 'sum-active' : ''"
							@click="changeSku(index)"
						>
							{{ item.name }}
						</li>
					</ul>
				</el-aside>

				<!-- 主内容 -->
				<el-container>
					<el-header
						style="position: absolute;top: 0;left: 200px;right: 0;height: 60px; line-height: 60px;"
						class="border-top border-bottom"
					>
						<el-button type="primary" size="mini" @click="doChooseAll">
							{{ isChooseAll ? '取消全选' : '全选' }}
						</el-button>
					</el-header>
					<el-main style="position: absolute;top: 60px;left: 200px;right: 0;bottom: 0;">
						<div class="d-flex flex-wrap">
							<span
								v-for="(item, index) in skusItem"
								:key="index"
								class="border rounded py-1 px-2 m-1"
								:class="item.isCheck ? 'sum-active' : ''"
								style="cursor: pointer;"
								@click="chooseSkusItem(item)"
							>
								{{ item.name }}
							</span>
						</div>
					</el-main>
				</el-container>
			</el-container>
		</el-container>
		<span slot="footer" class="dialog-footer">
			<el-button @click="hideImgDialog">取 消</el-button>
			<el-button type="primary" @click="confirm">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 是否打开商品规格弹框
			showSkusDialog: false,

			callback: false,

			//选中的数据
			chooseList: [],

			// 当前选中规格值
			skusIndex: 0,

			//规格数据
			skusList: [
				{
					name: '颜色',
					type: 0,
					list: [
						{ id: 1, name: '黄色', image: '', color: '', isCheck: false },
						{ id: 1, name: '红色', image: '', color: '', isCheck: false }
					]
				},
				{
					name: '类型',
					type: 0,
					list: [
						{ id: 3, name: '大小', image: '', color: '', isCheck: false },
						{ id: 4, name: '型号', image: '', color: '', isCheck: false }
					]
				}
			]
		};
	},

	computed: {
		// 当前规格下的规格属性列表
		skusItem() {
			return this.skusList[this.skusIndex].list;
		},

		// 是否全选
		isChooseAll() {
			return this.skusItem.length === this.chooseList.length;
		}
	},

	created() {},

	methods: {
		// 显示商品规格弹框
		chooseSkus(callback) {
			this.callback = callback;
			this.showSkusDialog = true;
		},

		// 隐藏商品规格弹框
		hideImgDialog() {
			this.unChooseAll();
			this.showSkusDialog = false;
			this.callback = false;
		},

		// 提交商品规格数据
		confirm() {
			// 提交选择skus数据
			if (typeof this.callback === 'function') {
				let item = this.skusList[this.skusIndex];
				this.callback({
					name: item.name,
					type: item.type,
					list: this.chooseList
				});
			}

			// 隐藏弹框
			this.hideImgDialog();
		},

		//切换规格卡片
		changeSku(index) {
			this.unChooseAll();
			this.skusIndex = index;
		},

		//选中规格属性
		chooseSkusItem(item) {
			// 之前没有选中
			if (!item.isCheck) {
				// 加入选中列表
				this.chooseList.push(item);

				// 修改选中状态
				return (item.isCheck = true);
			}

			// 之前选中
			//找到当前对象在chooseList中的索引
			let index = this.chooseList.findIndex(v => {
				return v.id === item.id;
			});

			// 找不到
			if (index < 0) return;

			//从选中列表移除
			this.chooseList.splice(index, 1);

			// 修改选中状态
			item.isCheck = false;
		},

		//全选 | 取消全选
		doChooseAll() {
			let list = this.skusList[this.skusIndex].list;

			// 已经全选
			if (this.isChooseAll) {
				return this.unChooseAll();
			}

			// 全选
			this.chooseList = list.map(v => {
				v.isCheck = true;
				return v;
			});
		},

		// 取消全选
		unChooseAll() {
			let list = this.skusList[this.skusIndex].list;

			// 修改状态
			list.forEach(v => {
				v.isCheck = false;
			});

			// 清空选中列表
			return (this.chooseList = []);
		}
	}
};
</script>

<style>
.sum-active {
	background-color: teal;
	color: #fff;
}
</style>
