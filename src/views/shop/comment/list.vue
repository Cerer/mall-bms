<!-- 商品评论 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search
			ref="buttonSearch"
			class="py-2 border-bottom"
			placeholder="要搜索的商品名称"
			:showsuperSearch="false"
			@search="searchEvent"
		></button-search>

		<el-table :data="tableData" class="mt-3" border>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<div class="media ml-3 mr-3">
						<img :src="scope.row.user.avatar" class="mr-3 rounded-circle" alt="" style="width: 70px;height: 70px;" />
						<div class="media-body">
							<h6 class="mt-0 d-flex align-items-center">
								{{ scope.row.user.username }}
								<small class="ml-1">{{ scope.row.review_time }}</small>
								<el-button
									v-if="!scope.row.extra && !textareaEdit"
									class="ml-auto mr-2"
									type="info"
									size="mini"
									@click="textareaEdit = true"
								>
									回复
								</el-button>
							</h6>
							<p>{{ scope.row.review.data }}</p>

							<div class="py-2">
								<img
									v-for="(item, index) in scope.row.review.image"
									:key="index"
									:src="item"
									alt=""
									style="max-width: 100px;max-height: 100px;"
								/>
							</div>

							<div v-if="textareaEdit">
								<el-input v-model="textarea" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
								<div class="pt-2">
									<el-button class="ml-auto mr-2" type="success" size="mini" @click="review(scope.row.id)">
										回复
									</el-button>
									<el-button class="ml-auto mr-2" type="info" size="mini" @click="closeTextarea">
										取消
									</el-button>
								</div>
							</div>

							<div v-if="scope.row.extra">
								<div
									v-for="(item, index) in scope.row.extra"
									:key="index"
									class="media mt-3 bg-light p-2 rounded"
								>
									<div class="media-body">
										<h6 class="mt-0 d-flex align-items-center">
											客服
											<el-button
												v-if="!textareaEdit"
												class="ml-auto mr-2"
												type="info"
												size="mini"
												@click="openTextarea(item.data)"
											>
												修改
											</el-button>
										</h6>
										<p>{{ item.data }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="ID" prop="id" align="center" width="70"></el-table-column>
			<el-table-column prop="title" label="商品" width="400">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" :src="scope.row.goods_item.cover" alt="" style="width: 60px;height: 60px;" />
						<div class="media-body">
							<p class="mt-0 mb-0 font-weight-bold">{{ scope.row.goods_item.title }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价信息" width="220">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<p>用户名：{{ scope.row.user.username }}</p>
						<div class="d-flex align-items-center">
							评分：
							<el-rate
								v-model="scope.row.rating"
								disabled
								show-score
								text-color="#ff9900"
								score-template="{value}"
							></el-rate>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价时间" prop="review_time" align="center"></el-table-column>
			<el-table-column label="是否显示" prop="status" align="center">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{ scope.row.status ? '启用' : '禁用' }}
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
			preUrl: 'goods_comment',

			// 搜索参数
			title: '',

			// 商品表格数据
			tableData: [],

			// 是否显示回复文本框
			textareaEdit: false,

			// 回复内容
			textarea: ''
		};
	},

	methods: {
		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
		},

		//获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&title=${this.title}`;
		},

		// 高级搜索
		searchEvent(e) {
			this.title = e;
			this.__getData();
		},

		// 回复提交
		review(id) {
			let self = this;
			if (self.textarea == '') {
				return self.$message({
					type: 'error',
					message: '回复内容不能为空'
				});
			}
			self.layout.showLoading();
			self.axios
				.post(
					`/admin/goods_comment/review/${id}`,
					{
						data: self.textarea
					},
					{
						token: true
					}
				)
				.then(() => {
					self.$message({
						type: 'success',
						message: '回复成功'
					});
					self.layout.hideLoading();
					self.__getData();
					self.closeTextarea();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 取消回复
		closeTextarea() {
			let self = this;
			self.textarea = '';
			this.textareaEdit = false;
		},

		// 修改回复
		openTextarea(data) {
			let self = this;
			self.textarea = data;
			self.textareaEdit = true;
		}
	}
};
</script>

<style></style>
