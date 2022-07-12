<!-- 相册弹框 -->
<template>
	<el-dialog title="图片管理" :visible.sync="showImgDialog" width="80%" top="5vh">
		<el-container style="position: relative;height: 70vh;margin: -30px -20px;">
			<!-- 头部 -->
			<el-header class="d-flex align-items-center border-bottom">
				<div class="d-flex mr-auto">
					<el-select
						v-model="searchForm.order"
						placeholder="请选择图片排序方式"
						size="mini"
						style="width: 200px;"
						class="mr-2"
					>
						<el-option label="降序" value="desc"></el-option>
						<el-option label="升序" value="asc"></el-option>
					</el-select>
					<el-input
						v-model="searchForm.keyword"
						placeholder="请输入相册名称"
						size="mini"
						style="width: 200px;"
						class="mr-2"
					></el-input>
					<el-button type="success" size="mini" @click="getImageList">搜索</el-button>
				</div>
			</el-header>

			<el-container>
				<!-- 侧边 | 相册列表 -->
				<el-aside
					class="bg-white border-right"
					width="200px"
					style="position: absolute;top: 60px;left: 0;bottom: 60px;"
					v-loading="asideLoading"
				>
					<ul class="list-group list-group-flush">
						<album-item
							v-for="(item, index) in albums"
							:key="index"
							:item="item"
							:index="index"
							:active="albumsIndex === index"
							@change="albumsChange"
							:showOptions="false"
						></album-item>
					</ul>
				</el-aside>

				<!-- 主内容 -->
				<el-container>
					<el-main style="position: absolute;top: 60px;left: 200px;right: 0;bottom: 60px;" v-loading="mainLoading">
						<el-row :gutter="20">
							<el-col v-for="(item, index) in imagesList" :key="index" :span="24" :lg="4" :md="6" :sm="8">
								<el-card
									class="box-card mb-3 position-relative"
									:body-style="{ padding: '0' }"
									shadow="hover"
									style="cursor: pointer;"
								>
									<div class="border" :class="{ 'border-danger': item.isCheck }">
										<span
											v-if="item.isCheck"
											class="badge badge-danger"
											style="position: absolute;right: 0;top: 0;"
										>
											{{ item.checkOrder }}
										</span>
										<img :src="item.src" alt="" class="w-100" style="height: 100px;" @click="choose(item)" />
										<div
											class="w-100 text-white position-absolute px-1"
											style="background: rgba(0, 0, 0, 0.5);margin-top: -25px;"
										>
											<span class="small">{{ item.name }}</span>
										</div>
										<div class="p-2 text-center">
											<el-button-group>
												<el-button
													class="p-2"
													icon="el-icon-edit"
													size="mini"
													@click="imagesEdit(item, index)"
												></el-button>
												<el-button
													class="p-2"
													icon="el-icon-delete"
													size="mini"
													@click="imagesDel({ index })"
												></el-button>
											</el-button-group>
										</div>
									</div>
								</el-card>
							</el-col>
						</el-row>
					</el-main>
				</el-container>
			</el-container>

			<!-- 底部 -->
			<el-footer class="border-top d-flex align-items-center px-0">
				<div
					style="width: 200px;flex-shrink: 0;"
					class="h-100 d-flex align-items-center justify-content-center border-right"
				>
					<el-button-group>
						<el-button
							size="mini"
							icon="el-icon-arrow-left"
							:disabled="albumPage === 1"
							@click="changeAlbumPage('pre')"
						>
							上一页
						</el-button>
						<el-button
							size="mini"
							:disabled="albumPage === Math.ceil(albumTotal / 10)"
							@click="changeAlbumPage('next')"
						>
							下一页
							<i class="el-icon-arrow-right el-icon--right"></i>
						</el-button>
					</el-button-group>
				</div>

				<div style="flex: 1;" class="px-2">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="pageSizes"
						:page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total"
					></el-pagination>
				</div>
			</el-footer>
		</el-container>
		<span slot="footer" class="dialog-footer">
			<el-button @click="hideImgDialog">取 消</el-button>
			<el-button type="primary" @click="confirm">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import albumItem from '@/components/image/album-item.vue';
export default {
	props: {
		//限制选择图片数量
		max: {
			type: Number,
			default: 9
		}
	},

	components: {
		albumItem
	},

	data() {
		return {
			// 是否打开现在相册弹框
			showImgDialog: false,

			callback: false,

			// 搜索参数
			searchForm: {
				order: '',
				keyword: ''
			},

			// 选中相册
			albumsIndex: 0,

			// 相册列表数据
			albums: [],

			// 相册类型列表分页默认显示页数
			albumPage: 1,

			// 相册类型列表总条数
			albumTotal: 0,

			// 判断是否是修改（大于-1为修改）
			albumsEditIndex: -1,

			// 列表图片数据
			imagesList: [],

			//选中的数据
			chooseList: [],

			// 相册图片分页默认显示页数
			currentPage: 1,

			// 相册图片分页每页显示条数
			pageSize: 5,

			// 相册图片分页每页显示条数选择
			pageSizes: [5, 10, 20, 30, 40, 100],

			// 相册图片列表总条数
			total: 0,

			// 侧边相册加载圈
			asideLoading: false,

			// 主内容图片列表加载圈
			mainLoading: false
		};
	},

	computed: {
		//当前选中左边列表相册id
		image_class_id() {
			let item = this.albums[this.albumsIndex];
			if (item) {
				return item.id;
			}
			return 0;
		},

		// 当前选中相册的图片列表URL
		getItemListUrl() {
			let other = '';
			if (this.searchForm.keyword !== '') {
				other = `&keyword=${this.searchForm.keyword}`;
			}
			return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${
				this.searchForm.order
			}${other}`;
		}
	},

	methods: {
		// 显示相册弹框
		chooseImage(callback) {
			this.__init();
			this.callback = callback;
			this.showImgDialog = true;
			
			// 取消选中图片
			this.unChoose();
		},

		// 隐藏相册弹框
		hideImgDialog() {
			this.showImgDialog = false;
			this.callback = false;
		},

		// 提交相册数据
		confirm() {
			// 提交选择图片url数据
			if (typeof this.callback === 'function') {
				this.callback(this.chooseList);
			}

			// 隐藏弹框
			this.hideImgDialog();
		},

		// 初始化相册列表数据
		__init() {
			let self = this;
			self.asideLoading = true;
			// 获取相册左边类型列表数据
			self.axios
				.get('/admin/imageclass/' + self.albumPage, {
					token: true
				})
				.then(res => {
					let data = res.data.data;
					self.albums = data.list;
					self.albumTotal = data.totalCount;

					self.asideLoading = false;

					//获取选中相册下的第一页图片列表
					self.getImageList();
				})
				.catch(() => {
					self.asideLoading = false;
				});
		},

		// 获取图片列表数据
		getImageList() {
			let self = this;
			self.mainLoading = true;
			self.axios
				.get(self.getItemListUrl, {
					token: true
				})
				.then(item => {
					let data = item.data.data;
					this.imagesList = data.list.map(i => {
						return {
							id: i.id,
							src: i.url,
							name: i.name,
							isCheck: false,
							checkOrder: 0
						};
					});
					self.total = data.totalCount;

					self.mainLoading = false;
				})
				.catch(() => {
					self.mainLoading = false;
				});
		},

		// 切换相册
		albumsChange(index) {
			this.albumsIndex = index;
			this.getImageList();
		},

		// 相册列表分页
		changeAlbumPage(type) {
			let self = this;
			if (type === 'pre') {
				self.albumPage--;
			} else {
				self.albumPage++;
			}
			self.__init();
		},

		// 选中图片
		choose(item) {
			//1选中
			if (!item.isCheck) {
				// 限制选择图片数量
				if (this.chooseList.length >= this.max) {
					return this.$message({
						message: '最多选择' + this.max + '张图片',
						type: 'warning'
					});
				}

				// 1.1选中数据
				this.chooseList.push({ id: item.id, src: item.src });

				// 1.2选中序号
				item.checkOrder = this.chooseList.length;

				// 1.3选中状态
				item.isCheck = true;
				return;
			}

			// 2取消选中
			//2.1找到chooseList中的索引
			let i = this.chooseList.findIndex(v => v.id === item.id);
			if (i === -1) return;

			// 2.2重新计算序号，可能取消的中间的数据
			let length = this.chooseList.length;

			// 2.3取消选中中间部分
			if (i + 1 < length) {
				//2.3.1重新计算imagesList选中序号
				for (let j = i; j < length; j++) {
					// 2.3.2找到imagesList中选中数据
					let no = this.imagesList.findIndex(v => v.id === this.chooseList[j].id);

					// 2.3.3如果有数据，后面的序号都-1
					if (no > -1) {
						this.imagesList[no].checkOrder--;
					}
				}
			}

			// 2.4删除数据
			this.chooseList.splice(i, 1);

			//2.5修改状态
			item.isCheck = false;

			//2.6重置序号
			item.checkOrder = 0;
		},

		// 取消选中图片
		unChoose() {
			this.imagesList.forEach(img => {
				// 找到所有选中的图片
				let i = this.chooseList.findIndex(v => {
					return v.id === img.id;
				});

				if (i > -1) {
					// 取消选中样式，选中排序归零
					img.isCheck = false;
					img.checkOrder = 0;

					// 从chooseList移除
					this.chooseList.splice(i, 1);
				}
			});
		},

		// 修改图片名称
		imagesEdit(item, index) {
			this.$prompt('请输入新名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue: item.name,
				inputValidator(val) {
					if (val === '') {
						return '图片名称不能为空';
					}
				}
			}).then(({ value }) => {
				item.name = value;
				this.$message({
					type: 'success',
					message: '修改成功'
				});
			});
		},

		// 删除当前图片
		imagesDel(obj) {
			this.$confirm(obj.all ? '是否删除选中图片?' : '是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (obj.all) {
					let list = this.imagesList.filter(img => {
						return !this.chooseList.some(v => v.id === img.id);
					});
					this.imagesList = list;
					this.chooseList = [];
				} else {
					this.imagesList.splice(obj.index, 1);
				}

				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},

		// 分页每页几条
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},

		// 分页选中页
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		}
	}
};
</script>

<style></style>
