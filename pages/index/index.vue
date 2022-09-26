<template>
    <view class="u-demo-block__content">
		<u-toast ref="uNotify"></u-toast>
		<!-- 顶部导航栏 -->
		<u-sticky class="sticky">
			<u-row class="top-list">
				<u-col span="1"></u-col>
				<u-col span="2" v-for="(item, index) in titleList" :index="index">
					<text :class="{'top-list-item': true, 'selected-top-list-item': isSelected(index)}" 
					@click="contentChange(index)">{{item}}</text>
				</u-col>	
			</u-row>
			<u-row><u-col span="12"><u-line></u-line></u-col></u-row>
		</u-sticky>
			 	
		<u-row>
			<u-col span="12">
				<!-- swiper实现左右滑动切换不同内容 -->
				<swiper :circular="false" :indicator-dots="false" :autoplay="false"
				:current="currentPage" @change="swiperChange" duration="300" skip-hidden-item-layout 
				:style="{height: avaWindowHeight+'px'}">
					<swiper-item v-for="(postList, index) in allLists">
						<!-- scroll-view实现上下滑动 -->
						<scroll-view scroll-top="0" scroll-y="true" class="scroll-Y" :style="{height: avaWindowHeight+'px'}"
						refresher-enabled refresher-background="#F5F5F5" @refresherrefresh="refresh" :refresher-triggered="isRefreshing"
						refresh-threshold="100" lower-threshold="10" @scrolltolower="scrollToLower">
							<!-- 如帖子列表为空，显示无数据字样 -->
							<u-row v-if="allLists[currentPage].length == 0" customStyle="position: relative; top:15%">
								<u-col span="2" offset="2" customStyle="align-items: center;">
										<u-line color="#000000"></u-line>	
								</u-col>
								<u-col span="4" customStyle="align-items: center;">
										<text>无数据</text>
								</u-col>
								<u-col span="2" customStyle="align-items: center;">
										<u-line color="#000000"></u-line>	
								</u-col>
							</u-row>
							<uni-list v-else class="post-list" :border="false">
								<!-- 帖子内容 -->
								<post v-for="(item, index) in postList" :key="index" :info="item" :followList="followList" 
								class="post" @sendAlert="sendAlert" @handleFollow="handleFollow"></post>
							</uni-list>
						</scroll-view>
					</swiper-item>
				</swiper>
			</u-col>
		</u-row>
    </view>
</template>

<script>
	import moveToOtherPage from '@/mixins/move.js'
	import post from '@/components/post/post.vue';
	let postInfo = require('@/static/postInfo.json');
	export default {
		components: {
			post
		},
		mixins: [moveToOtherPage],
		data(){
			return {
				currentPage: 0,
				titleList: ['圈子','热点','活动','公告','话题'],
				allLists: [],
				originPostList: [],
				isRefreshing: false,
				followList: []
		  }
		},
		computed: {
			isSelected() {
				return (index) => {return index === this.currentPage;};
			},
			avaWindowHeight() {
				let info = uni.getSystemInfoSync();
				return info.windowHeight - 40;
			},
			isListEmpty() {
				return this.allLists[this.currentPage].length == 0;
			}
		},
		methods: {
			swiperChange(e) {
				//监听swiper的滑动更新当前所在页面，改变this.currentPage会导致顶部导航栏样式变为对应内容高亮
				this.currentPage = e.detail.current;
			},
			contentChange(index) {
				//监听用户点击顶部导航栏
				this.currentPage = index;
			},
			randomizeArr(arr) {
				//列表随机化排序，用于模拟刷新行为
				arr.sort(() => Math.random() - 0.5);
			},
			refresh() {	
				//下拉刷新
				if (this.isListEmpty || this.isRefreshing) return;
				this.isRefreshing = true;						
                setTimeout(() => {
					this.randomizeArr(this.allLists[this.currentPage]);
                    this.isRefreshing = false;
                    this._freshing = false;
                }, 500)
			},
			scrollToLower() {
				//帖子列表下滑到底部触发加载数据
				if (this.isListEmpty) return; 
				this.allLists[this.currentPage].push(...this.originPostList);
			},
			sendAlert(message) {
				//发送点赞、反对、关注、取关成功的提示
				let parsedMessage = message + '成功';
				this.$refs.uNotify.show({
					type: 'default',					
					message: parsedMessage,
					duration: 1000,
				})
			},
			handleFollow(id) {
				//变更关注按钮的状态并刷新localStroage里的followList
				let index = this.followList.findIndex((e) => e == id);
				if (index !== -1) {
					this.sendAlert('取消关注');
					this.followList.splice(index, 1);
				}else {
					this.sendAlert('关注');
					this.followList.push(id);
				}
				uni.setStorageSync('followList', this.followList);
			},
			getFollowListStor() {
				let followList = uni.getStorageSync('followList');
				if (followList !== '') {
					this.followList = followList;
				}
			}
		},
		onLoad() {
			//初始化帖子列表，从json里读取
			for (let key in postInfo) {
				this.originPostList.push(postInfo[key]);
			}
			for (let num = 0; num < 5; num++){
				let postList = this.originPostList.slice(0);//deepCopy
				if (num !== 0){
					this.randomizeArr(postList);
				}
				this.allLists.push(postList);
			}	
		},
		onShow() {
			//每次显示时令所有post组件刷新一次赞踩评论状态，因为uni-app无法监听右滑返回所以只能这样
			this.getFollowListStor();
			this.$EventBus.$emit('getEmojiStor'); 
		},
		onNavigationBarSearchInputClicked() {
			//点击原生搜索框跳转到搜索页面
			this.moveToOtherPage('search');
		},
		onNavigationBarButtonTap() {
			this.moveToOtherPage('addPost');
		}	
	}
</script>

<style lang="scss" scoped>
	.sticky {
		 z-index: 1;
		 height: 35px;
		 margin-bottom: 6px;
	}
	.top-list {
		 padding: 5px 0px; 
		 background-color: white;
	}
	.scroll-Y {
		background-color: #F5F5F5;
	}
	.scroll-view-item {
		height: 800rpx;
		line-height: 800rpx;
		text-align: center;
		font-size: 36rpx;
		margin-bottom: 10px;
		background-color: white;
	}
	.swiper-item {
		display: block;
		height: 800rpx;
		line-height: 800rpx;
		text-align: center;
	}
	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}
	.info {
		position: absolute;
		right: 20rpx;
	}
	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}
	.top-list-item {
		text-align: center;
		font-size: 18px;
	}
	.selected-top-list-item {
		color: #B9D3EE;
		font-size: 22px;
	}
	.post-list {
		background-color: #F5F5F5;
	}
	.post {
		margin-bottom: 5px;
	}
</style>
