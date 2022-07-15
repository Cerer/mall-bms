<!-- 管理员管理 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="preUrl" @tab-click="__getData">
			<el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini" @click="opanDialog('manager')">添加用户</el-button>

					<div class="ml-auto">
						<el-input
							v-model="keyword"
							size="mini"
							placeholder="请输入用户名"
							style="width: 200px;"
							clearable
						></el-input>
						<el-button class="ml-2" type="info" size="mini" @click="__getData">搜索</el-button>
					</div>
				</div>
				<el-table :data="managerList" class="mt-3" border>
					<el-table-column label="用户头像" align="center" width="100">
						<template slot-scope="scope">
							<el-avatar size="large" :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column label="登录账号" prop="username" align="center"></el-table-column>
					<el-table-column label="所属用户组" align="center">
						<template slot-scope="scope">
							{{ scope.row.role.name }}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="150">
						<template slot-scope="scope">
							<el-button
								:type="scope.row.status ? 'success' : 'danger'"
								size="mini"
								plain
								@click="changeStatus(scope.row)"
							>
								{{ scope.row.status ? '启用' : '禁用' }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="opanDialog('manager', scope.row)">修改</el-button>
							<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="role">
				<div>
					<el-button type="primary" size="mini" v-auth="'添加角色'" @click="opanDialog('role')">添加角色</el-button>
				</div>
				<el-table :data="roleList" class="mt-3" border>
					<el-table-column label="角色名称" prop="name" align="center"></el-table-column>
					<el-table-column label="角色描述" prop="desc" align="center"></el-table-column>
					<el-table-column label="添加时间" prop="create_time" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="150">
						<template slot-scope="scope">
							<el-button
								:type="scope.row.status ? 'success' : 'danger'"
								size="mini"
								plain
								@click="changeStatus(scope.row)"
							>
								{{ scope.row.status ? '启用' : '禁用' }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="220" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="opanDialog('role', scope.row)">修改</el-button>
							<el-button type="text" size="mini" @click="openDrawer(scope.row)">配置权限</el-button>
							<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限列表" name="rule">
				<div>
					<el-button type="primary" size="mini" v-auth="'添加规则'" @click="opanDialog('rule')">添加规则</el-button>
				</div>

				<el-tree
					:data="ruleList"
					:props="defaultProps"
					@node-click="handleNodeClick"
					default-expand-all
					:expand-on-click-node="false"
				>
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div>
							<span
								v-if="data.menu"
								:class="data.icon ? data.icon : 'el-icon-star-off'"
								class="mr-2 text-muted"
							></span>
							<small v-else class="mr-2 text-muted">{{ data.method }}</small>
							<span>{{ data.name }}</span>
							<span v-if="data.menu" class="badge ml-2">{{ data.frontpath }}</span>
							<span v-else class="badge badge-secondary ml-2">{{ data.condition }}</span>
						</div>

						<span>
							<el-button :type="data.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(data)">
								{{ data.status ? '启用' : '禁用' }}
							</el-button>
							<el-button type="text" size="mini" @click.stop="opanDialog('rule', data.id)" v-auth="'添加规则'">
								新增
							</el-button>
							<el-button type="text" size="mini" @click.stop="opanDialog('rule', data)">修改</el-button>
							<el-button type="text" size="mini" @click.stop="deteleItem(data)">删除</el-button>
						</span>
					</span>
				</el-tree>
			</el-tab-pane>
		</el-tabs>

		<div style="height: 65px;"></div>

		<!-- 分页 -->
		<el-footer
			v-if="preUrl !== 'rule'"
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

		<!-- 添加用户/角色/权限 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
			<!-- 添加/修改用户 -->
			<el-form v-if="preUrl === 'manager'" ref="form" :model="form.manager" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.manager.username" placeholder="请输入用户名" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.manager.password" placeholder="请输入密码" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					{{ form.manager.avatat }}
					<div v-if="!form.manager.avatar" class="btn btn-light border" @click="chooesImg">
						<i class="el-icon-plus"></i>
					</div>

					<img
						v-else
						:src="form.manager.avatar"
						alt=""
						class="rounded"
						style="width: 45px;height: 45px;cursor: pointer;"
						@click="chooesImg"
					/>
				</el-form-item>
				<el-form-item label="所属角色">
					<el-select v-model="form.manager.role_id" placeholder="请选择所属角色" size="mini">
						<el-option
							v-for="(item, index) in roleOptions"
							:key="index"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.manager.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<!-- 添加/修改角色 -->
			<el-form v-if="preUrl === 'role'" ref="form" :model="form.role" label-width="80px">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="form.role.name" placeholder="请输入角色名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="desc">
					<el-input v-model="form.role.desc" type="textarea" placeholder="请输入角色描述" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.role.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<!-- 添加/修改规则 -->
			<el-form v-if="preUrl === 'rule'" ref="form" :model="form.rule" label-width="100px">
				<el-form-item label="上级规则">
					<el-select v-model="form.rule.rule_id" placeholder="请选择上级规则" size="mini">
						<el-option label="顶级规则" :value="0"></el-option>
						<el-option
							v-for="(item, index) in ruleOptions"
							:key="index"
							:label="item | dealRuleName"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单/规则">
					<el-radio-group v-model="form.rule.menu" size="small">
						<el-radio :label="1" border>菜单</el-radio>
						<el-radio :label="0" border>规则</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="form.rule.name" placeholder="请输入名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="图标" v-if="form.rule.menu">
					<el-input v-model="form.rule.icon" placeholder="请输入图标" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="前端路由路径" v-if="form.rule.menu && form.rule.rule_id > 0">
					<el-input v-model="form.rule.frontpath" placeholder="请输入前端路由路径" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="前台路由别名" v-if="form.rule.menu">
					<el-input v-model="form.rule.desc" placeholder="请输入前台路由别名" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="后端规则" v-if="!form.rule.menu">
					<el-input v-model="form.rule.condition" placeholder="请输入后端规则" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="请求方式" v-if="!form.rule.menu">
					<el-select v-model="form.rule.method" placeholder="请选择请求方式" size="mini">
						<el-option label="GET" value="GET"></el-option>
						<el-option label="POST" value="POST"></el-option>
						<el-option label="PUT" value="PUT"></el-option>
						<el-option label="DELETE" value="DELETE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.rule.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 配置权限 -->
		<el-drawer title="配置权限" :visible.sync="drawerRole" direction="rtl" :before-close="handleClose" size="40%">
			<div style="position: absolute;top: 52px;left: 0;right: 0;bottom: 0;">
				<div style="position: absolute;top: 0;left: 0;right: 0;bottom: 60px;overflow-y: auto;">
					<el-tree
						:data="ruleList"
						show-checkbox
						node-key="id"
						default-expand-all
						:default-checked-keys="checkedKeys"
						:props="defaultProps"
						:check-strictly="true"
						@check="check"
					></el-tree>
				</div>
				<div
					style="height: 60px;position: absolute;bottom: 0;right: 0;left: 0;"
					class="border d-flex align-items-center px-3"
				>
					<el-button @click="drawerRole = false">取消</el-button>
					<el-button type="primary" @click="submitRules">确定</el-button>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout', 'app'],

	mixins: [common],

	data() {
		return {
			// 接口标识,默认tab选中
			preUrl: 'manager',

			// 搜索关键字
			keyword: '',

			// 管理员数据
			managerList: [],

			// 角色数据
			roleList: [],

			// 权限数据
			ruleList: [],

			// 权限树状结构默认取值key
			defaultProps: {
				children: 'child',
				label: 'name'
			},

			// 是否显示用户/角色/权限弹框
			dialogVisible: false,

			// 点击弹框类型
			dialogType: 'manager',

			// 弹框标题
			dialogTitle: '',

			// 用户/角色/权限表单
			form: {
				manager: {
					username: '',
					password: '',
					avatar: '',
					role_id: '',
					status: 1
				},
				role: {
					name: '',
					desc: '',
					status: 1
				},
				rule: {
					menu: 0,
					rule_id: '',
					name: '',
					status: 1,
					frontpath: '',
					desc: '',
					condition: '',
					icon: '',
					method: 'GET',
					order: 50
				}
			},

			// 编辑获取数据ID
			dialogId: 0,

			// 角色下拉数据
			roleOptions: [],

			// 上级规则下拉数据
			ruleOptions: [],

			// 是否显示配置权限抽屉
			drawerRole: false,

			// 配置权限选择数据
			checkedKeys: [],

			// 配置权限选择数据Id
			drawerRoleId: 0
		};
	},

	filters: {
		dealRuleName(item) {
			if (item.level == 0) {
				return item.name;
			}
			let str = '';
			for (let i = 0; i < item.level; i++) {
				str += i == 0 ? '|--' : '--';
			}
			return str + ' ' + item.name;
		}
	},

	methods: {
		//获取请求列表分页url
		getListUrl() {
			if (this.preUrl === 'manager') {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`;
			}
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},

		// 获取列表数据
		getListResult(data) {
			switch (this.preUrl) {
				case 'manager':
					this.managerList = data.list;
					this.roleOptions = data.role;
					break;
				case 'role':
					this.roleList = data.list;
					break;
				case 'rule':
					this.ruleList = data.list;
					this.ruleOptions = data.rules;
					break;
			}
		},

		//打开用户/角色/权限弹框
		opanDialog(type, item = false) {
			this.dialogType = type;
			this.dialogVisible = true;

			switch (type) {
				case 'manager':
					if (!item) {
						this.dialogTitle = '添加用户';
						this.dialogId = 0;
						this.form.manager = {
							username: '',
							password: '',
							avatar: '',
							role_id: '',
							status: 1
						};
					} else {
						this.dialogTitle = '编辑用户';
						this.dialogId = item.id;
						this.form.manager = {
							username: item.username,
							password: item.password,
							avatar: item.avatar,
							role_id: item.role_id,
							status: item.status
						};
					}
					break;
				case 'role':
					if (!item) {
						this.dialogTitle = '添加角色';
						this.dialogId = 0;
						this.form.role = {
							name: '',
							desc: '',
							status: 1
						};
					} else {
						this.dialogTitle = '编辑角色';
						this.dialogId = item.id;
						this.form.role = {
							name: item.name,
							desc: item.desc,
							status: item.status
						};
					}
					break;
				case 'rule':
					if (!item || typeof item == 'number') {
						this.dialogTitle = '添加规则';
						this.dialogId = 0;
						this.form.rule = {
							menu: 0,
							rule_id: '',
							name: '',
							status: 1,
							frontpath: '',
							desc: '',
							condition: '',
							icon: '',
							method: 'GET',
							order: 50
						};
						this.form.rule.rule_id = typeof item == 'number' ? item : '';
					} else {
						this.dialogTitle = '编辑规则';
						this.dialogId = item.id;
						this.form.rule = {
							menu: item.menu,
							rule_id: item.rule_id,
							name: item.name,
							status: item.status,
							frontpath: item.frontpath,
							desc: item.desc,
							condition: item.condition,
							icon: item.icon,
							method: item.method,
							order: 50
						};
					}
					break;
			}
		},

		// 选择头像
		chooesImg() {
			this.app.chooseImage(res => {
				this.form.manager.avatar = res[0].src;
			}, 1);
		},

		//点开空白处关闭弹框确认提示
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(() => {
					done();
				})
				.catch(() => {});
		},

		// 表单提交
		submit() {
			this.addOrEdit(this.form[this.preUrl], this.dialogId);
			this.dialogVisible = false;
		},

		// 点击节点
		handleNodeClick(data) {
			console.log(data);
		},

		// 打开配置权限抽屉
		openDrawer(item) {
			// 获取权限配置数据
			this.layout.showLoading();
			this.axios
				.get(`/admin/rule/1`, {
					token: true
				})
				.then(res => {
					this.drawerRole = true;
					this.ruleList = res.data.data.list;
					this.checkedKeys = item.rules.map(i => i.id);
					this.drawerRoleId = item.id;
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 选择配置权限
		check(...e) {
			this.checkedKeys = e[1].checkedKeys;
		},

		// 修改配置权限提交
		submitRules() {
			this.axios
				.post(
					`/admin/role/set_rules`,
					{
						id: this.drawerRoleId,
						rule_ids: this.checkedKeys
					},
					{
						token: true
					}
				)
				.then(() => {
					this.drawerRole = false;
					this.__getData();
					this.$message({
						type: 'success',
						message: '配置成功'
					});
				});
		}
	}
};
</script>

<style></style>
