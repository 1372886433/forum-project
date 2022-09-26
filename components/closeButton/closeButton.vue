<template>
	<view >
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view @click="back" style="margin: 20px 0px 0px 20px;">
			<i class="iconfont iconfont-close">&#xeb6a;</i>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			back(){
				if (getCurrentPages().length === 1){
					return;
				}
				uni.navigateBack({
					delta:1
				});
			}
		}
	}
</script>

<style>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.iconfont-close {
		font-size: 24px;
		color: black;
	}
	
	.iconfont-close:active {
		color: darkgray
	}
</style>