<!-- 会员列表 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<button-search class="py-2 border-bottom" ref="buttonSearch" placeholder="手机号/邮箱/会员昵称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加会员</el-button>
			</template>

			<!--右边-搜索表单 -->
			<template #form>
				<el-form ref="search" :inline="true" :model="search" class="demo-form-inline" label-width="80px">
					<el-form-item label="搜索内容" class="mb-0">
						<el-input v-model="search.keyword" placeholder="手机号/邮箱/会员昵称" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="会员等级" class="mb-0">
						<el-select v-model="search.group_id" placeholder="请选择会员等级" size="mini">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
							v-model="search.time"
							type="daterange"
							size="mini"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>

		<el-table :data="tableData" class="mt-3" border>
			<el-table-column label="会员" width="280">
				<template slot-scope="scope">
					<div class="media">
						<img :src="scope.row.avatar" class="mr-3 rounded-circle" style="width: 40px;height: 40px;" alt="" />
						<div class="media-body">
							<h6 class="mt-0 d-flex align-items-center">
								{{ scope.row.username }}
								<el-button class="ml-auto" type="text" size="mini">详情</el-button>
							</h6>
							<p>用户id:{{ scope.row.id }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="会员等级" align="center">
				<template slot-scope="scope">
					{{ scope.row.level.name }}
				</template>
			</el-table-column>
			<el-table-column label="注册/登录" width="300" align="center">
				<template slot-scope="scope">
					<div>注册时间：{{ scope.row.create_time }}</div>
					<div>最后登录：{{ scope.row.update_time }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="150">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini">重置密码</el-button>
					<el-button type="text" size="mini" @click="deteleItem(scope.$index)">删除</el-button>
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
				<!-- @size-change="handleSizeChange"
					@current-change="handleCurrentChange" -->
				<el-pagination
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				></el-pagination>
			</div>
		</el-footer>

		<!-- 新增/修改弹框 -->
		<el-dialog title="添加会员" :visible.sync="createModel" top="5vh" width="50%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" placeholder="请输入用户名" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" placeholder="请输入密码" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" placeholder="请输入昵称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					{{ form.avatat }}
					<div v-if="!form.avatar" class="btn btn-light border" @click="chooesImg"><i class="el-icon-plus"></i></div>

					<img
						v-else
						:src="form.avatar"
						alt=""
						class="rounded"
						style="width: 45px;height: 45px;cursor: pointer;"
						@click="chooesImg"
					/>
				</el-form-item>
				<el-form-item label="会员登录">
					<el-select v-model="form.level_id" placeholder="请选择会员登录" size="mini">
						<el-option label="普通会员" :value="1"></el-option>
						<el-option label="黄金会员" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入手机" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="form.sex" placeholder="请选择性别" size="mini">
						<el-option label="保密" :value="0"></el-option>
						<el-option label="男性" :value="1"></el-option>
						<el-option label="女性" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="small">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	inject: ['app'],

	data() {
		return {
			// 搜索参数
			search: {
				keyword: '',
				group_id: 0,
				time: ''
			},

			//会员列表数据
			tableData: [
				{
					id: 10,
					username: '用户名',
					nickname: '昵称',
					avatar: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
					level_id: 1,
					level: {
						id: 1,
						name: '普通会员'
					},
					create_time: '2022-06-30 12:45:23',
					update_time: '2022-07-3 12:45:23',
					status: 1,
					phone: 13047002569,
					email: '',
					sex: 0
				}
			],

			// 分页当前页码
			currentPage: 1,

			// 是否显示添加/修改类型弹框
			createModel: false,

			// 表单
			form: {
				username: '',
				password: '',
				nickname: '',
				avatar: '',
				level_id: 1,
				phone: '',
				email: '',
				sex: 0,
				status: 1
			},

			// 判断是新增还是编辑大于-1为修改
			editIndex: -1
		};
	},

	created() {
		this.__getData();
	},

	methods: {
		//搜索
		searchEvent(e) {
			// 简单搜索
			if (typeof e === 'string') {
				return console.log('简单搜索');
			}

			//高级搜索
			console.log('高级搜索');
		},

		// 清空筛选条件
		clearSearch() {
			this.search = {
				keyword: '',
				group_id: 0,
				time: ''
			};

			this.$refs.buttonSearch.closeSuperSearch();
		},

		// 获取表格数据
		__getData() {},

		// 修改状态
		changeStatus(item) {
			item.status = !item.status;
			this.$message({
				message: item.status ? '启用' : '禁用',
				type: 'success'
			});
		},

		// 打开添加/修改会员弹框
		openModel(e = false) {
			if (!e) {
				//新增
				this.form = {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					level_id: 1,
					phone: '',
					email: '',
					sex: 0,
					status: 1
				};
				this.editIndex = -1;
			} else {
				//修改
				this.form = {
					...e.row,
					password: ''
				};
				this.editIndex = e.$index;
			}

			this.createModel = true;
		},

		// 提交会员数据
		submit() {
			let msg = '添加成功';
			if (this.editIndex === -1) {
				this.form.level = {
					id: 1,
					name: '普通会员'
				};
				this.tableData.unshift({
					...this.form
				});
			} else {
				msg = '修改成功';
				let list = this.tableData[this.editIndex];
				list.username = this.form.username;
				list.password = this.form.password;
				list.nickname = this.form.nickname;
				list.level_id = this.form.level_id;
				list.phone = this.form.phone;
				list.email = this.form.email;
				list.sex = this.form.sex;
				list.status = this.form.status;
			}
			this.createModel = false;
			this.$message({
				message: msg,
				type: 'success'
			});
		},

		// 删除类型
		deteleItem(index) {
			this.$confirm('是否确认删除会员?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.tableData.splice(index, 1);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
				.catch(() => {});
		},

		// 选择头像
		chooesImg() {
			this.app.chooseImage(res => {
				this.form.avatar = res[0].src;
			}, 1);
		}
	}
};
</script>

<style>
/* 默认隐藏删除图片 */
.sku-list-item > i {
	display: none;
	cursor: pointer;
}

.sku-list-item:hover {
	background-color: #f4f4f4;
}

/* 鼠标移上去隐藏文字 */
.sku-list-item:hover > font {
	display: none;
}

/* 鼠标移上去显示删除图片 */
.sku-list-item:hover > i {
	display: inline-block;
}
</style>
