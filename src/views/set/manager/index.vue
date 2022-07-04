<!-- 管理员管理 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="管理员列表" name="first">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini">添加用户</el-button>

					<div class="ml-auto">
						<el-input v-model="keyword" size="mini" placeholder="请输入用户名" style="width: 200px;"></el-input>
						<el-button class="ml-2" type="info" size="mini">搜索</el-button>
					</div>
				</div>
				<el-table :data="managerList" class="mt-3" border>
					<el-table-column label="用户头像" align="center" width="100">
						<template slot-scope="scope">
							<el-avatar size="large" :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column label="登录账号" prop="username" align="center"></el-table-column>
					<el-table-column label="手机号" prop="phone" align="center"></el-table-column>
					<el-table-column label="邮箱" prop="email" align="center"></el-table-column>
					<el-table-column label="所属用户组" align="center">
						<template slot-scope="scope">
							{{ scope.row.group.name }}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="150">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="second">
				<div><el-button type="primary" size="mini" v-auth="'添加角色'">添加角色</el-button></div>
				<el-table :data="roleList" class="mt-3" border>
					<el-table-column label="角色名称" prop="name" align="center"></el-table-column>
					<el-table-column label="添加时间" prop="create_time" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="150">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="220" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">配置权限</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限列表" name="third">
				<el-tree
					:data="powerList"
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
							<el-button
								:type="data.status ? 'success' : 'danger'"
								size="mini"
								plain
								@click.stop="showOrHide(data)"
							>
								{{ data.status ? '显示' : '隐藏' }}
							</el-button>
							<el-button type="success" size="mini" @click.stop="append(data)" v-auth="'添加规则'">新增</el-button>
							<el-button :type="data.editStatus ? 'default' : 'warning'" size="mini" @click.stop="edit(data)">
								{{ data.editStatus ? '完成' : '修改' }}
							</el-button>
							<el-button type="danger" size="mini" @click.stop="remove(node, data)">删除</el-button>
						</span>
					</span>
				</el-tree>
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

			// 搜索关键字
			keyword: '',

			// 管理员数据
			managerList: [
				{
					id: 10,
					username: '用户名',
					avatar: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
					phone: 13047002569,
					email: '5568656@qq.com',
					group_id: 1,
					group: {
						id: 1,
						name: '管理员'
					},
					status: 1
				}
			],

			// 角色数据
			roleList: [
				{
					id: 10,
					name: '超级管理员',
					create_time: '2022-03-22',
					status: 1
				}
			],

			// 权限数据
			powerList: [
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

			// 权限树状结构默认取值key
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
		}
	}
};
</script>

<style></style>
