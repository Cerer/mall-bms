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
		>
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input v-if="data.editStatus" v-model="data.label" size="mini"></el-input>
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
	data() {
		return {
			data: [
				{
					id: 1,
					label: '一级 1',
					status: 1,
					editStatus: false,
					children: [
						{
							id: 2,
							label: '二级 1-1',
							status: 1,
							editStatus: false,
							children: [
								{
									id: 3,
									label: '三级 1-1-1',
									status: 1,
									editStatus: false
								}
							]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		};
	},
	methods: {
		// 点击节点
		handleNodeClick(data) {
			console.log(data);
		},

		// 显示/隐藏
		showOrHide(data) {
			data.status = data.status ? 0 : 1;
		},

		//修改/提交
		edit(data) {
			data.editStatus = !data.editStatus;
		},

		// 新增子分类
		append(data) {
			let newObj = {
				id: 2,
				label: '二级 1-1',
				status: 1,
				editStatus: true,
				children: []
			};
			data.children.push(newObj);
		},

		//删除
		remove(node, data) {
			this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let parent = node.parent;
					let children = parent.data.children || parent.data;
					let index = children.findIndex(v => {
						v.id === data.id;
					});
					children.splice(index, 1);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
				.catch(() => {});
		},

		// 节点拖拽
		nodeDrop(...options) {
			console.log(options[0].data);
			console.log(options[1].data);
		},

		// 创建顶级分类
		createTop() {
			this.$prompt('请输入顶级分类名称', '提示', {
				confirmButtonText: '创建',
				cancelButtonText: '取消',
				inputValidator(val) {
					if (val === '' || val === null) {
						return '顶级分类名称不能为空';
					}
				}
			})
				.then(({ value }) => {
					this.$message({
						type: 'success',
						message: '创建分类' + value + '成功'
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
