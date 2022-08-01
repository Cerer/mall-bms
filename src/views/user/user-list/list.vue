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
						<el-select v-model="search.user_level_id" placeholder="请选择会员等级" size="mini">
							<el-option
								v-for="(item, index) in user_level"
								:key="index"
								:label="item.name"
								:value="item.id"
							></el-option>
						</el-select>
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
					{{ scope.row.user_level ? scope.row.user_level.name : '' }}
				</template>
			</el-table-column>
			<el-table-column label="注册/登录" width="300" align="center">
				<template slot-scope="scope">
					<div>注册时间：{{ scope.row.create_time }}</div>
					<div>最后登录：{{ scope.row.last_login_time }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="150">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{ scope.row.status ? '启用' : '禁用' }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini" @click="deteleItem(scope.row)">删除</el-button>
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
					<el-select v-model="form.user_level_id" placeholder="请选择会员登录" size="mini">
						<el-option
							v-for="(item, index) in user_level"
							:key="index"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入手机" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱" size="mini"></el-input>
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],

	mixins: [common],

	data() {
		return {
			// 接口标识
			preUrl: 'user',

			// 搜索参数
			search: {
				keyword: '',
				user_level_id: ''
			},

			// 会员等级列表
			user_level: [],

			//会员列表数据
			tableData: [],

			// 是否显示添加/修改类型弹框
			createModel: false,

			// 表单
			form: {
				username: '',
				password: '',
				nickname: '',
				avatar: '',
				user_level_id: 1,
				phone: '',
				email: '',
				status: 1
			},

			// 判断是新增还是编辑大于-1为修改
			editIndex: -1
		};
	},

	methods: {
		// 获取列表数据
		getListResult(data) {
			this.tableData = data.list;
			this.user_level = data.user_level;
		},

		//获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${
				this.search.keyword
			}&user_level_id=${this.search.user_level_id}`;
		},

		//搜索
		searchEvent(e) {
			// 简单搜索
			if (typeof e === 'string') {
				this.search.keyword = e;
				this.__getData();
				return;
			}

			//高级搜索
			this.__getData();
		},

		// 清空筛选条件
		clearSearch() {
			this.search = {
				keyword: '',
				user_level_id: ''
			};
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
					user_level_id: 3,
					phone: '',
					email: '',
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
			let id = 0;
			if (this.editIndex !== -1) {
				id = this.tableData[this.editIndex].id;
			}
			this.addOrEdit(this.form, id);
			this.createModel = false;
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
