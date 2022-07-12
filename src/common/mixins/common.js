import {
	Loading
} from "element-ui";

export default {
	data() {
		return {
			// 分页数据
			page: {
				current: 1, // 分页当前页码
				sizes: [10, 20, 50, 100], // 页面显示条数
				size: 10, // 当前页面默认显示条数
				total: 0 // 列表总条数
			},

			// 表格多选数据
			multipleSelection: [],

			//接口url标识
			preUrl: '',

			// 判断是否开启加载圈
			loading: true
		}
	},

	filters: {
		numToString(value) {
			return value.toString();
		}
	},

	computed: {
		// 批量选择的id
		ids() {
			return this.multipleSelection.map(item => {
				return item.id;
			});
		}
	},

	created() {
		this.__getData();
	},

	methods: {
		// 显示加载
		showLoading() {
			if (this.loading) {
				this.layout.showLoading();
			}
		},

		// 隐藏加载
		hideLoading() {
			if (this.loading) {
				this.layout.hideLoading();
			}
		},

		// 处理列表数据
		getListResult(data) {},

		//获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},

		// 初始化数据
		__getData() {
			let self = this;
			if (self.preUrl === '') return;
			self.showLoading();
			let url = self.getListUrl();
			self.axios
				.get(url, {
					token: true
				})
				.then(res => {
					let data = res.data.data;
					self.getListResult(data);
					self.page.total = data.totalCount;
					self.hideLoading();
				})
				.catch(() => {
					self.hideLoading();
				});
		},

		//添加/编辑
		addOrEdit(data, id = 0) {
			let self = this;
			let msg = id > 0 ? '修改' : '添加';
			let url = id > 0 ? `/admin/${this.preUrl}/${id}` : `/admin/${this.preUrl}`;
			self.showLoading();
			self.axios
				.post(url, data, {
					token: true
				})
				.then(() => {
					self.hideLoading();
					self.__getData();
					this.$message({
						message: msg + '成功',
						type: 'success'
					});
				})
				.catch(() => {
					self.hideLoading();
				});
		},

		//批量删除数据
		deteleAll() {
			let self = this;
			if (self.ids.length === 0) {
				return self.$message({
					type: 'warning',
					message: '请先选择需要删除的数据!'
				});
			}
			self.$confirm('是否确认批量删除规格?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					self.showLoading();
					self.axios
						.post(
							`/admin/${this.preUrl}/delete_all`, {
								ids: self.ids
							}, {
								token: true
							}
						)
						.then(() => {
							self.hideLoading();
							self.multipleSelection = [];
							self.$message({
								type: 'success',
								message: '删除成功!'
							});
							self.__getData();
						})
						.catch(() => {
							self.hideLoading();
						});
				})
				.catch(() => {
					self.hideLoading();
				});
		},

		// 删除单条数据
		deteleItem(item) {
			let self = this;
			self.$confirm('是否确认删除规格?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					self.showLoading();
					self.axios
						.post(
							`/admin/${this.preUrl}/${item.id}/delete`, {}, {
								token: true
							}
						)
						.then(() => {
							self.hideLoading();
							self.$message({
								type: 'success',
								message: '删除成功!'
							});
							self.__getData();
						})
						.catch(() => {
							self.hideLoading();
						});
				})
				.catch(() => {
					self.hideLoading();
				});
		},

		// 修改状态
		changeStatus(item) {
			let self = this;
			let status = item.status === 1 ? 0 : 1;
			let mag = status === 1 ? '启用' : '禁用';
			self.showLoading();
			self.axios
				.post(
					`/admin/${this.preUrl}/${item.id}/update_status`, {
						status
					}, {
						token: true
					}
				)
				.then(() => {
					item.status = status;
					self.hideLoading();
					self.$message({
						type: 'success',
						message: mag + '成功'
					});
				})
				.catch(() => {
					self.hideLoading();
				});
		},

		// 表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		//每页显示多少条数据
		handleSizeChange(val) {
			let self = this;
			self.page.size = val;
			self.__getData();
		},

		//当前为第几页
		handleCurrentChange(val) {
			let self = this;
			self.page.current = val;
			self.__getData();
		}
	}

}
