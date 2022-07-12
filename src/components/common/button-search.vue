<!-- 搜索按钮组件 -->
<template>
	<div>
		<div class="d-flex align-items-center">
			<!-- 左边 -->
			<slot name="left"></slot>

			<!-- 右边 -->
			<div v-show="!superSearch" v-if="showSearch" class="ml-auto">
				<slot name="right">
					<el-input
						v-model="keyword"
						:placeholder="placeholder"
						style="width: 150px;"
						size="mini"
						class="mr-2"
						clearable
					></el-input>
					<el-button type="info" size="mini" @click="$emit('search', keyword)">搜索</el-button>
					<el-button v-if="showsuperSearch" size="mini" @click="superSearch = true">高级搜索</el-button>
				</slot>
			</div>
		</div>

		<!-- 高级搜索 -->
		<el-card v-if="superSearch" class="box-card bg-light my-3">
			<div slot="header" class="clearfix" style="margin: -10px;">
				<span>高级搜索</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="closeSuperSearch">收起</el-button>
			</div>

			<!-- 搜索表单 -->
			<slot name="form"></slot>
		</el-card>
	</div>
</template>

<script>
export default {
	props: {
		// 提示语
		placeholder: {
			type: String,
			default: ''
		},

		// 是否搜索右边内容
		showSearch: {
			type: Boolean,
			default: true
		},

		// 是否显示高级搜索按钮
		showsuperSearch: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			// 搜索关键字
			keyword: '',

			// 是否显示高级搜索卡片
			superSearch: false
		};
	},

	methods: {
		// 关闭高级搜索卡片
		closeSuperSearch() {
			this.superSearch = false;
		}
	}
};
</script>

<style></style>
