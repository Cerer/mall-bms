<template>
	<div id="app">
		<router-view></router-view>

		<!-- 选择相册弹框 -->
		<image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>

		<!-- 选中规格 -->
		<skus-dialog ref="skusDialog"></skus-dialog>
	</div>
</template>

<script>
import imageDialog from '@/components/image/image-dialog.vue';
import skusDialog from '@/components/skus/skus-dialog.vue';
export default {
	name: 'app',

	// 注入依赖
	provide() {
		return {
			app: this
		};
	},

	components: {
		imageDialog,
		skusDialog
	},

	data() {
		return {
			// 最多选中图片限制
			maxChooseImage: 9
		};
	},

	created() {
		// 初始化用户信息
		this.$store.commit('initUser');
		
		// 初始化后台菜单
		this.$store.commit('initNavBar');
	},

	methods: {
		// 选中图片
		chooseImage(callback, max = 9) {
			this.maxChooseImage = max;
			this.$refs.imageDialog.chooseImage(callback);
		},

		// 选中规格
		chooseSkus(callback) {
			this.$refs.skusDialog.chooseSkus(callback);
		}
	}
};
</script>

<style>
/* 全局滚动条样式 */
::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 0;
}

::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-thumb {
	cursor: pointer;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.25);
	transition: color 0.2s ease;
}
</style>
