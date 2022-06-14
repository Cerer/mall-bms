<template>
	<div id="app">
		<router-view></router-view>

		<!-- 选择相册弹框 -->
		<image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>
	</div>
</template>

<script>
import imageDialog from '@/components/image/image-dialog.vue';
export default {
	name: 'app',

	// 注入依赖
	provide() {
		return {
			app: this
		};
	},

	components: {
		imageDialog
	},

	data() {
		return {
			// 最多选中图片限制
			maxChooseImage: 9
		};
	},

	methods: {
		chooseImage(callback, max = 9) {
			this.maxChooseImage = max;
			this.$refs.imageDialog.chooseImage(callback);
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
