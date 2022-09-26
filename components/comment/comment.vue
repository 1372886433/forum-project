<template>
	<uni-list-item :showArrow="false" direction="column">
		<template v-slot:header>
			<u-row>
				<!-- 评论者头像 -->
				<u-col span="2">
					<image :src="'../../' + info.head" class="head-img"></image>
				</u-col>
				<!-- 评论者id -->
				<u-col span="5" class="name">
					<view>{{info.name}}</view>				
				</u-col>
			</u-row>			
		</template>
		<template v-slot:body>
			<u-row>
				<!-- 评论内容 -->
				<u-col span="10" offset="2">
					<text class="content">{{info.content}}</text>
				</u-col>
			</u-row>	
		</template>
		<template v-slot:footer>	
			<u-row customStyle="margin-top: 5px">
				<!-- 评论时间 -->
				<u-col span="10" offset="2">
					<view class="time">{{info.time}}</view>
				</u-col>
			</u-row>
		</template>	
	</uni-list-item>
</template>

<script>
	export default{
		props: ['info'],
		data(){
			return {		
			}
		},
		computed: {
		},
		methods: {
		}
	}
</script>

<style scoped lang="scss">
	$smallFontSize: 13px;
	.move-left {
		position: relative;
		left: -15px;
		top: -10px;
	}
	.small-font {
		font-size: $smallFontSize;
	}
	.text-center {
		text-align: center;
	}
	.head-img {
		width: 35px;
		height: 35px;
	}
	.time {
		@extend .small-font;
		@extend .move-left;
		color: darkgray;
	}
	.content {
		@extend .move-left;
		white-space: pre-wrap;
		font-size: 16px;		
	}
	.name {
		@extend .move-left;
		color: #00BFFF;
	}
</style>