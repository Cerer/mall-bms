<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-12 col-sm-9 col-md-7 col-lg-5 m-auto pt-5">
					<div class="card mt-5">
						<div class="card-header bg-white">
							<h3 class="text-center mb-0 text-secondary">{{ $conf.logo }}</h3>
						</div>
						<div class="card-body">
							<el-form ref="form" :model="form" :rules="rules">
								<el-form-item prop="username">
									<el-input v-model="form.username" size="medium" placeholder="请输入用户名"></el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input
										v-model="form.password"
										type="password"
										size="medium"
										placeholder="请输入密码"
									></el-input>
								</el-form-item>
								<el-form-item>
									<el-button :loading="loading" type="primary" size="medium" class="w-100" @click="submit">
										{{ loading ? '登录中' : '立即登录' }}
									</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			//表单
			form: {
				username: '',
				password: ''
			},

			// 表单验证
			rules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
			},

			//按钮点击状态
			loading: false
		};
	},

	computed: {
		...mapGetters(['adminIndex'])
	},

	methods: {
		// 提交表单
		submit() {
			this.$refs.form.validate(e => {
				if (!e) return;

				this.loading = true;
				this.axios
					.post('/admin/login', this.form)
					.then(res => {
						let data = res.data.data;

						//1.存储到vuex 2.存储到本地存储
						this.$store.commit('login', data);

						//3.生成菜单
						this.$store.commit('createNavBar', data.tree);

						//4.存储权限规则
						if (data.role && data.role.rules) {
							window.sessionStorage.setItem('rules', JSON.stringify(data.role.rules));
						}

						//5.成功提示
						this.$message({
							type: 'success',
							message: '登录成功'
						});

						//6.跳转菜单数据第一个页面或者404页面
						this.$router.push({ name: this.adminIndex });

						this.loading = false;
					})
					.catch(() => {
						this.loading = false;
					});
			});
		}
	}
};
</script>
