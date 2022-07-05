<!-- 分类管理 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<div class="py-2 border-bottom d-flex align-items-center">
			<el-button type="success" size="mini" @click="createTop">创建顶级分类</el-button>
		</div>

		<el-tree
			:data="data"
			:props="defaultProps"
			@node-click="handleNodeClick"
			default-expand-all
			:expand-on-click-node="false"
			draggable
			@node-drop="nodeDrop"
			@node-drag-end="nodeDragEnd"
		>
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input v-if="data.editStatus" v-model="data.name" size="mini"></el-input>
					<span v-else>{{ node.label }}</span>
				</div>

				<span>
					<el-button :type="data.status ? 'success' : 'danger'" size="mini" plain @click.stop="showOrHide(data)">
						{{ data.status ? '显示' : '隐藏' }}
					</el-button>
					<el-button type="success" size="mini" @click.stop="append(data)">新增</el-button>
					<el-button :type="data.editStatus ? 'default' : 'warning'" size="mini" @click.stop="edit(data)">
						{{ data.editStatus ? '完成' : '修改' }}
					</el-button>
					<el-button type="danger" size="mini" @click.stop="remove(node, data)">删除</el-button>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
export default {
	inject: ['layout'],

	data() {
		return {
			data: [],
			defaultProps: {
				children: 'child',
				label: 'name'
			}
		};
	},

	computed: {
		// 排序后数据
		sortData() {
			let data = [];
			let sort = function(arr) {
				arr.forEach(i => {
					data.push(i);
					if (i.child.length) {
						sort(i.child);
					}
				});
			};
			// 多维数组转为一维数组
			sort(this.data);

			// 排序后数据
			data = data.map((item, index) => {
				return {
					id: item.id,
					order: index,
					category_id: item.category_id
				};
			});
			return data;
		}
	},

	created() {
		this.__init();
	},

	methods: {
		// 初始化数据
		__init() {
			let self = this;
			self.layout.showLoading();
			self.axios
				.get('/admin/category', {
					token: true
				})
				.then(res => {
					let data = res.data.data;
					let addEditStatus = function(arr) {
						arr.forEach(item => {
							item.editStatus = false;
							if (item.child.length) {
								addEditStatus(item.child);
							}
						});
					};

					addEditStatus(data);
					self.data = data;
					self.layout.hideLoading();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 点击节点
		handleNodeClick(data) {
			console.log(data);
		},

		// 显示/隐藏
		showOrHide(data) {
			let self = this;
			let status = data.status ? 0 : 1;
			let mag = status ? '显示' : '隐藏';
			self.layout.showLoading();
			self.axios
				.post(
					`/admin/category/${data.id}/update_status`,
					{
						status
					},
					{
						token: true
					}
				)
				.then(() => {
					data.status = status;
					self.layout.hideLoading();
					self.$message({
						type: 'success',
						message: mag + '成功'
					});
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		//修改/提交
		edit(data) {
			let self = this;
			// 校验是否为
			if (!data.editStatus) {
				return (data.editStatus = true);
			}

			// 校验名称
			if (data.name == '') {
				return self.$message.error('分类名称不能为空');
			}

			self.layout.showLoading();
			self.axios
				.post(
					`/admin/category/${data.id}`,
					{
						status: data.status,
						name: data.name,
						category_id: data.category_id
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
					data.editStatus = false;
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 新增子分类
		append(data) {
			let self = this;
			self.layout.showLoading();

			self.axios
				.post(
					`/admin/category`,
					{
						status: 0,
						name: '新分类',
						category_id: data.id
					},
					{
						token: true
					}
				)
				.then(res => {
					let obj = res.data.data;
					obj.editStatus = true;
					obj.child = [];
					data.child.push(obj);
					self.layout.hideLoading();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		//删除
		remove(node, data) {
			let self = this;
			self.$confirm('此操作将删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					self.layout.showLoading();
					self.axios
						.delete(`/admin/category/${data.id}`, {
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

		// 节点拖拽
		nodeDrop(...options) {
			let self = this;
			self.layout.showLoading();
			self.axios
				.post(
					'/admin/category/sort',
					{
						sortdata: JSON.stringify(self.sortData)
					},
					{
						token: true
					}
				)
				.then(() => {
					self.layout.hideLoading();
					self.__init();
				})
				.catch(() => {
					self.layout.hideLoading();
				});
		},

		// 节点拖拽结束
		nodeDragEnd(...options) {
			//被拖拽节点对应的数据
			let beforeItem = options[0].data;

			//结束拖拽时最后进入的节点数据
			let afterItem = options[1].data;

			if (afterItem) {
				if (options[2] === 'before' || options[2] === 'after') {
					beforeItem.category_id = afterItem.category_id;
				} else {
					beforeItem.category_id = afterItem.id;
				}
			}
		},

		// 创建顶级分类
		createTop() {
			let self = this;
			self.$prompt('请输入顶级分类名称', '提示', {
				confirmButtonText: '创建',
				cancelButtonText: '取消',
				inputValidator(val) {
					if (val === '' || val === null) {
						return '顶级分类名称不能为空';
					}
				}
			})
				.then(({ value }) => {
					self.layout.showLoading();
					self.axios
						.post(
							`/admin/category`,
							{
								status: 0,
								name: value,
								category_id: 0
							},
							{
								token: true
							}
						)
						.then(() => {
							self.layout.hideLoading();
							self.$message({
								type: 'success',
								message: '创建分类' + value + '成功'
							});
							self.__init();
						})
						.catch(() => {
							self.layout.hideLoading();
						});
				})
				.catch(() => {});
		}
	}
};
</script>

<style>
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}

.el-tree-node__content {
	padding: 20px 0;
}
</style>
