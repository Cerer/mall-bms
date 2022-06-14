<!-- 相册列表 -->
<template>
	<div>
		<li
			class="list-group-item list-group-item-action d-flex align-items-center"
			:class="{ 'active sum-active': active }"
			style="cursor: pointer;"
			@click.stop="$emit('change', index)"
		>
			{{ item.name }}
			<span v-if="!showOptions" class="btn btn-light btn-sm border ml-auto">{{ item.num }}</span>

			<el-dropdown v-else class="ml-auto">
				<span class="btn btn-light btn-sm border">
					{{ item.num }}
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.stop.native="$emit('edit', { index, item })">修改</el-dropdown-item>
					<el-dropdown-item @click.stop.native="$emit('del', index)">删除</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</li>
	</div>
</template>

<script>
export default {
	props: {
		active: {
			type: Boolean,
			default: false
		},
		item: Object,
		index: Number,

		//是否显示
		showOptions: {
			type: Boolean,
			default: true
		}
	}
};
</script>

<style></style>
