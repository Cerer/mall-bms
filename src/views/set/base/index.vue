<!-- 基础设置 -->
<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0 !important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="注册与访问" name="first">
				<el-form ref="form" :model="form" label-width="130px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.open_reg" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型">
						<el-radio-group v-model="form.reg_method" size="mini">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度">
						<el-input
							v-model="form.password_min"
							type="number"
							size="mini"
							style="width: 25%;"
							placeholder="密码最小长度"
						></el-input>
					</el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt" size="mini">
							<el-checkbox-button label="0">数字</el-checkbox-button>
							<el-checkbox-button label="1">小写字母</el-checkbox-button>
							<el-checkbox-button label="2">大写字母</el-checkbox-button>
							<el-checkbox-button label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="上传设置" name="second">
				<el-form ref="form" :model="form" label-width="130px">
					<el-form-item label="默认上传方式">
						<el-radio-group v-model="form.upload_method" size="mini">
							<el-radio-button label="local">本地存储</el-radio-button>
							<el-radio-button label="oss">阿里oss</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<template v-if="form.upload_method === 'oss'">
						<el-form-item label="Bucket">
							<el-input
								v-model="form.upload_config.Bucket"
								size="mini"
								style="width: 25%;"
								placeholder="Bucket"
							></el-input>
						</el-form-item>
						<el-form-item label="ACCESS_KEY">
							<el-input
								v-model="form.upload_config.ACCESS_KEY"
								size="mini"
								style="width: 25%;"
								placeholder="ACCESS_KEY"
							></el-input>
						</el-form-item>
						<el-form-item label="SECRET_KEY">
							<el-input
								v-model="form.upload_config.SECRET_KEY"
								size="mini"
								style="width: 25%;"
								placeholder="SECRET_KEY"
							></el-input>
						</el-form-item>
						<el-form-item label="空间域名">
							<el-input
								v-model="form.upload_config.http"
								size="mini"
								style="width: 25%;"
								placeholder="空间域名"
							></el-input>
							<small class="text-secondary d-block">请补全http://或https://</small>
						</el-form-item>
					</template>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="Api安全" name="third">
				<el-form ref="form" :model="form" label-width="130px">
					<el-form-item label="是否开启Api安全">
						<el-radio-group v-model="form.api_safe" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
						<small class="text-secondary d-block">api安全功能开启之后调用前端api需要传输签名串</small>
					</el-form-item>
					<el-form-item label="秘钥">
						<el-input v-model="form.api_secret" size="mini" style="width: 50%;" placeholder="秘钥"></el-input>
						<small class="text-secondary d-block">
							秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token
						</small>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>

		<el-form style="padding-bottom: 5px;" label-width="130px">
			<el-form-item><el-button type="primary" @click="submit">保存</el-button></el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	inject: ['layout'],

	data() {
		return {
			// 默认tab选中
			activeName: 'first',

			// 表单数据
			form: {
				open_reg: 1, //开启注册
				reg_method: 'username', //注册方式
				password_min: '', //密码最小长度
				password_encrypt: ['0'], //密码复杂度
				upload_method: 'local', //上传方式
				upload_config: {
					//上传配置
					Bucket: '',
					ACCESS_KEY: '',
					SECRET_KEY: '',
					http: ''
				},
				api_safe: 1, //api安全
				api_secret: '' //秘钥
			}
		};
	},

	created() {
		this.__getData();
	},

	methods: {
		// 获取数据
		__getData() {
			this.layout.showLoading();
			this.axios
				.get('/admin/sysconfig', {
					token: true
				})
				.then(res => {
					this.form = res.data.data;
					this.form.password_encrypt = this.form.password_encrypt.split(',');
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},

		// 保存数据
		submit() {
			this.layout.showLoading();
			this.form.password_encrypt = this.form.password_encrypt.join(',');
			this.axios
				.post('/admin/sysconfig', this.form, {
					token: true
				})
				.then(() => {
					this.$message({
						type: 'success',
						message: '提交成功'
					});
					this.__getData();
					this.layout.hideLoading();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		}
	}
};
</script>

<style></style>
