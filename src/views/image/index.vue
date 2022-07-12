<!-- 相册管理 -->
<template>
	<div>
		<el-container style="position: absolute;left: 0;right: 0;top: 55px;bottom: 0;">
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
						placeholder="请输入图片名称"
						size="mini"
						style="width: 200px;"
						class="mr-2"
						clearable
					></el-input>
					<el-button type="success" size="mini" @click="getImageList">搜索</el-button>
				</div>
				<el-button v-if="chooseList.length" type="warning" size="mini" @click="unChoose">取消选中</el-button>
				<el-button v-if="chooseList.length" type="danger" size="mini" @click="imagesDel({ all: true })">
					批量删除
				</el-button>
				<el-button type="success" size="mini" @click="openAlbumModel(false)">创建相册</el-button>
				<el-button type="warning" size="mini" @click="uploadModel = true">上传图片</el-button>
			</el-header>

			<el-container>
				<!-- 侧边 | 相册列表 -->
				<el-aside class="bg-white border-right" width="200px" style="position: absolute;top: 60px;left: 0;bottom: 60px;">
					<ul class="list-group list-group-flush">
						<album-item
							v-for="(item, index) in albums"
							:key="index"
							:item="item"
							:index="index"
							:active="albumsIndex === index"
							@change="albumsChange"
							@edit="openAlbumModel"
							@del="albumsDel"
						></album-item>
					</ul>
				</el-aside>

				<!-- 主内容 -->
				<el-container>
					<el-main style="position: absolute;top: 60px;left: 200px;right: 0;bottom: 60px;">
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
													icon="el-icon-view"
													size="mini"
													@click="previewImages(item)"
												></el-button>
												<el-button
													class="p-2"
													icon="el-icon-edit"
													size="mini"
													@click="imagesEdit(item)"
												></el-button>
												<el-button
													class="p-2"
													icon="el-icon-delete"
													size="mini"
													@click="imagesDel({ index, item })"
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

		<!-- 创建 | 修改相册 -->
		<el-dialog :title="albumModelTitle" :visible.sync="albumsModel">
			<el-form ref="form" :model="albumsForm" label-width="80px">
				<el-form-item label="相册名称">
					<el-input v-model="albumsForm.name" size="medium" placeholder="请输入相册名称"></el-input>
				</el-form-item>
				<el-form-item label="相册排序">
					<el-input-number v-model="albumsForm.order" size="medium" :min="0"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="albumsModel === false">取消</el-button>
				<el-button type="primary" @click="condirmAlbumModel">确定</el-button>
			</div>
		</el-dialog>

		<!-- 上传图片 -->
		<el-dialog title="上传图片" :visible.sync="uploadModel" @close="__init">
			<div class="text-center">
				<el-upload
					class="upload-demo w-100"
					drag
					action="/admin/image/upload"
					multiple
					:headers="{ token: $store.state.user.token }"
					:data="{ image_class_id: image_class_id }"
					name="img"
					:on-success="uploadSuccess"
					:on-error="uploadError"
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</div>
		</el-dialog>

		<!-- 预览图片 -->
		<el-image-viewer
			v-if="isViewer"
			:on-close="
				() => {
					isViewer = false;
				}
			"
			:url-list="srcList"
		/>
	</div>
</template>

<script>
import albumItem from '@/components/image/album-item.vue';
import elImageViewer from 'element-ui/packages/image/src/image-viewer';
export default {
	inject: ['layout'],

	components: {
		albumItem,
		elImageViewer
	},

	data() {
		return {
			// 搜索参数
			searchForm: {
				order: 'desc',
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

			// 是否显示新建/修改相册弹框
			albumsModel: false,

			// 相册表单
			albumsForm: {},

			// 判断是否是修改（大于-1为修改）
			albumsEditIndex: -1,

			// 是否显示上传图片弹框
			uploadModel: false,

			// 列表图片数据
			imagesList: [],

			// 是否显示预览图片
			isViewer: false,

			// 预览图片数据
			srcList: [],

			//选中的数据
			chooseList: [],

			// 相册图片分页默认显示页数
			currentPage: 1,

			// 相册图片分页每页显示条数
			pageSize: 5,

			// 相册图片分页每页显示条数选择
			pageSizes: [5, 10, 20, 30, 40, 100],

			// 相册图片列表总条数
			total: 0
		};
	},

	computed: {
		//新建/修改相册弹框标题
		albumModelTitle() {
			return this.albumsEditIndex > -1 ? '修改相册' : '创建相册';
		},

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

	created() {
		this.__init();
	},

	methods: {
		// 初始化相册列表数据
		__init() {
			let self = this;
			self.layout.showLoading();

			// 获取相册左边类型列表数据
			self.axios
				.get('/admin/imageclass/' + self.albumPage, {
					token: true
				})
				.then(res => {
					let data = res.data.data;
					self.albums = data.list;
					self.albumTotal = data.totalCount;

					//获取选中相册下的第一页图片列表
					this.getImageList();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 获取图片列表数据
		getImageList() {
			let self = this;
			self.layout.showLoading();

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

					self.layout.hideLoading();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 切换相册
		albumsChange(index) {
			this.albumsIndex = index;

			this.getImageList();
		},

		// 打开新建/修改相册弹框
		openAlbumModel(obj) {
			this.albumsForm = {
				name: '',
				order: 0
			};
			// 修改
			if (obj) {
				let { index, item } = obj;

				// 初始化表单
				this.albumsForm.name = item.name;
				this.albumsForm.order = item.order;
				this.albumsEditIndex = index;
				return (this.albumsModel = true);
			}

			// 新增相册
			this.albumsForm = {
				name: '',
				order: 0
			};
			this.albumsEditIndex = -1;
			this.albumsModel = true;
		},

		//提交表单
		condirmAlbumModel() {
			let self = this;
			// 修改
			if (self.albumsEditIndex > -1) {
				self.albumsEdit();
				return (self.albumsModel = false);
			}

			self.layout.showLoading();
			// 新增
			self.axios
				.post('/admin/imageclass', self.albumsForm, {
					token: true
				})
				.then(() => {
					// 关闭弹框
					self.layout.showLoading();
					self.albumsModel = false;
					self.$message({
						type: 'success',
						message: '新增成功'
					});
					self.__init();
				})
				.catch(() => {
					self.layout.showLoading();
				});
		},

		// 修改相册
		albumsEdit() {
			let self = this;
			self.layout.showLoading();
			let item = this.albums[this.albumsEditIndex];
			self.axios
				.post(`/admin/imageclass/${item.id}`, this.albumsForm, {
					token: true
				})
				.then(() => {
					self.layout.hideLoading();
					self.$message({
						type: 'success',
						message: '修改成功'
					});
					self.__init();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 删除相册
		albumsDel(index) {
			let self = this;
			self.$confirm('是否删除该相册?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					self.layout.showLoading();
					let id = this.albums[index].id;
					self.axios
						.delete(`/admin/imageclass/${id}`, {
							token: true
						})
						.then(() => {
							self.layout.hideLoading();
							self.$message({
								type: 'success',
								message: '删除成功!'
							});
							self.__init();
						})
						.catch(() => {
							self.layout.hideLoading();
						});
				})
				.catch(() => {});
		},

		// 选中图片
		choose(item) {
			//1选中
			if (!item.isCheck) {
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

		// 预览图片
		previewImages(e) {
			this.isViewer = true;
			this.srcList.push(e.src);
		},

		// 修改图片名称
		imagesEdit(item) {
			let self = this;
			self.$prompt('请输入新名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue: item.name,
				inputValidator(val) {
					if (val === '') {
						return '图片名称不能为空';
					}
				}
			})
				.then(({ value }) => {
					self.layout.showLoading();
					self.axios
						.post(
							`/admin/image/${item.id}`,
							{
								name: value
							},
							{
								token: true
							}
						)
						.then(() => {
							self.layout.hideLoading();
							self.$message({
								type: 'success',
								message: '修改成功'
							});
							self.__init();
						})
						.catch(() => {
							self.layout.hideLoading();
						});
				})
				.catch(() => {});
		},

		// 删除当前图片
		imagesDel(obj) {
			let self = this;
			self.$confirm(obj.all ? '是否删除选中图片?' : '是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				self.layout.showLoading();

				// 批量删除
				if (obj.all) {
					let ids = self.chooseList.map(i => i.id);
					self.axios
						.post(
							'/admin/image/delete_all',
							{
								ids: ids
							},
							{ token: true }
						)
						.then(() => {
							self.layout.hideLoading();
							self.chooseList = [];
							self.__init();
						})
						.catch(() => {
							self.layout.hideLoading();
						});
				} else {
					// 删除单张
					self.axios
						.delete(`/admin/image/${obj.item.id}`, {
							token: true
						})
						.then(() => {
							self.layout.hideLoading();
							self.__init();
							// self.getImageList();
						})
						.catch(() => {
							self.layout.hideLoading();
						});
				}

				self.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
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

		// 分页每页几条
		handleSizeChange(val) {
			let self = this;
			self.pageSize = val;
			self.getImageList();
		},

		// 分页选中页
		handleCurrentChange(val) {
			let self = this;
			self.currentPage = val;
			self.getImageList();
		},

		// 上传图片成功
		uploadSuccess(response, file, fileList) {
			console.log(response, file, fileList);
			this.$message({
				type: 'success',
				message: '上传图片成功'
			});
		},

		//上传图片失败
		uploadError(err) {
			let error = JSON.parse(err.message);
			this.$message.error(error.msg);
		}
	}
};
</script>

<style>
/* 相册列表背景色 */
.sum-active {
	color: #67c23a !important;
	background-color: #f0f9eb !important;
	border-color: #c2e7b0 !important;
}
</style>
