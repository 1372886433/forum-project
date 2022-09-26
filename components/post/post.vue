<template>
	<uni-list-item :showArrow="false" direction="column">
		<template v-slot:header>
			<u-row>
				<!-- 用户头像 -->
				<u-col span="2">
					<image :src="'../../' + info.head" class="head-img"></image>
				</u-col>
				<!-- 用户id及发帖时间 -->
				<u-col span="5" customStyle="margin-left: -15px">
					<view>{{info.name}}</view>
					<view class="time">{{info.time}}</view>
				</u-col>
				<!-- 关注按钮 -->
				<u-col span="2" offset="3">
					<button :type="followType" class="follow-button" @click="followClick">{{followText}}</button>
				</u-col>
			</u-row>			
		</template>
		<template v-slot:body>
			<view  @click="fullPost">
				<u-row  customStyle="margin-top: 10px;">
					<!-- 在帖子详情页面的标题，主页不显示 -->
					<text class="bigContent" v-if="inFullPost">{{info.content}}</text>
				</u-row>
				<!-- 帖子内容 -->
				<u-row customStyle="margin-top: 10px;">
					<text class="content">{{info.content}}</text>
				</u-row>
				<image v-if="info.image !== ''" :src="'../../' + info.image" mode="aspectFill" class="content-image"></image>
			</view>		
		</template>
		<template v-slot:footer>
			<!-- 点赞、反对、评论、分享栏 -->
			<u-row customStyle="margin-top: 10px">
				<u-col span="3" v-for="(emoji, index) in emojiList">
					<view class="text-center"  @click="buttonClick(index)">
						<text class="iconfont small-font text-center" v-html="emoji.code" 
						v-bind:class="{'red-text': emoji.active}"></text>
						<text class="small-font text-center" style="margin-left: 5px;">{{emoji.num == 0? emoji.name: emoji.num}}</text>
					</view>
				</u-col>
			</u-row>
		</template>
		
	</uni-list-item>
</template>

<script>
	import moveToOtherPage from '@/mixins/move.js'
	export default{
		props: ['info', 'followList', 'commentNum'],
		mixins: [moveToOtherPage],
		data(){
			return {			
				emojiList: [{name: '点赞', code: '&#xe702;', num: 0, active: false}, 
							{name: '反对', code: '&#xe701;', num: 0, active: false},
							{name: '评论', code: '&#xe61e;', num: 0, active: false}, 
							{name: '分享', code: '&#xe600;', num: 0, active: false}]
			}
		},
		computed: {
			followType() {
				let index = this.followList.findIndex((e) => e == this.info.id);
				return index !== -1? 'warn': 'primary';
			},
			followText() {
				let index = this.followList.findIndex((e) => e == this.info.id);
				return index !== -1? '取消关注': '关注';
			},
			inFullPost() {
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route //获取当前页面路由
				return curRoute === 'pages/fullPost/fullPost';
			}
		},
		methods: {
			buttonClick(index) {
				if (index == 0 || index == 1) {
					let active = this.emojiList[index].active;
					if (!active) {
						this.$emit('sendAlert', this.emojiList[index].name);
						this.emojiList[index].num++;
						if (index == 1) {
							//点击反对同时会取消先前的点赞
							if (this.emojiList[0].active) this.emojiList[0].num--;
							this.emojiList[0].active = false;
						}else {
							if (this.emojiList[1].active) this.emojiList[1].num--;
							this.emojiList[1].active = false;
						}
					}else {
						this.emojiList[index].num--;
					}
					this.emojiList[index].active = !active;
					this.setEmojiStor();
				} else if (index == 2) {
					//进入帖子详情页面
					this.fullPost();
				} else {
					console.log('分享成功');
				}
			},
			followClick() {
				this.$emit('handleFollow', this.info.id);
			},
			fullPost() {
				if (this.inFullPost) return;
				//进入帖子详情页面并把点击的帖子内容作为参数传进去
				this.moveToOtherPage('fullPost', false, 
				{'info': JSON.stringify(this.info)});
			},
			getEmojiStor() {
				//从localStorage获取对应帖子的操作栏信息
				let emojiId = 'emoji' + this.info.id;
				let emojiList = uni.getStorageSync(emojiId)
				if (emojiList !== '') this.emojiList = emojiList;
			},
			setEmojiStor() {
				let emojiId = 'emoji' + this.info.id;
				uni.setStorageSync(emojiId, this.emojiList);
			}
		},
		watch: {
			commentNum(val) {
				this.emojiList[2].num = val;
				this.setEmojiStor();
			}
		},
		beforeMount() {
			this.getEmojiStor();
			this.$EventBus.$on('getEmojiStor', this.getEmojiStor);
		}
	}
</script>

<style scoped lang="scss">
	$smallFontSize: 13px;
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
		color: darkgray;
	}
	.follow-button {
		font-size: 14px;
		padding: 0px 2px;
		width: 65px;
		height: 26px;
		line-height: 26px;
		position: relative;
		left: 10px;
	}
	.content {
		white-space: pre-wrap;
		font-size: 18px;		
	}
	.bigContent {
		white-space: pre-wrap;
		font-size: 20px;
	}
	.content-image {
		margin-top: 5px;
		width: 100%;
		height: 200px;
	}
	.red-text {
		color: red;
	}
</style>