<template>
	<view class="white-back">
		<!-- 状态栏留白 -->
		<u-sticky class="status_bar" z-index="1" bgColor="#fff" offsetTop="0"></u-sticky>
		<!-- 底部输入bar -->
		<u-sticky class="search-bar" z-index="1" bgColor="#fff" offsetTop="755">
			<u-row>
				<u-col span="10">
					<u-textarea class="input" placeholder="文明发言" v-model="commentText"
					@confirm="commentConfirm" height="20"></u-textarea>
				</u-col>
				<u-col span="2" customStyle="align-items: center; margin-top: 18px;">
					<view @click="commentConfirm">
						<i class="iconfont iconfont-send">&#xe659;</i>
					</view>
				</u-col>
			</u-row>
		</u-sticky>
		<view class="light-gray-back" style="position: relative;: relative; top: -60px;">
			<u-toast ref="uNotify" customStyle="color: #FFF"></u-toast>
			<!-- 主贴内容 -->
			<uni-list class="post-list" :border="false">
				<post :info="info" :followList="followList" :commentNum="commentNum" 
				@sendAlert="sendAlert" @handleFollow="handleFollow"></post>
			</uni-list>
			<!-- 评论列表 -->
			<view :style="{marginTop: '10px', minHeight: commentMinHeight + 'px'}" class="white-back"> 
				<u-row>
					<u-col span="11">
						<text class="commentTitle">最新评论 {{commentNum}}</text>
					</u-col>
				</u-row>
				<uni-list :border="false" class="comment-list">
					<comment v-for="(item, index) in commentList" :key="index" :info="item" class="comment"></comment>
				</uni-list>
			</view>
			
		</view>
	</view>

</template>

<script>
	import post from '@/components/post/post.vue';
	import comment from "@/components/comment/comment.vue";
	export default {
		components: {
			post,
			comment
		},
		data() {
			return {
				info: {},
				followList: [],
				commentList: [],
				commentText: '',
				commentMinHeight: 0
			}	
		},
		computed: {
			commentNum() {
				return this.commentList.length;
			 }
		},
		methods: {
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
			commentConfirm() {
				//在评论列表底部添加一个新评论
				if (this.commentText.trim() == '') {
					this.commentText = '';
					return;
				}
				let comment = {
					head: "/static/image/head1.jpeg",
					name: "评论用户1",
					time: "8月25日 上午 10:41"
				};
				comment.content = this.commentText;
				this.commentText = '';
				let time = this.getTime();
				comment.time = time;
				this.commentList.push(comment);
				this.setCommentListStor();
			},
			getTime() {
				//获取当前时间，格式为：x月x日 上（下）午 xx:xx
				let myDate = new Date();
				let month = myDate.getMonth() + 1;
				let date = myDate.getDate();
				let hour = myDate.getHours();
				let minute = myDate.getMinutes();
				let noonOrNight = hour < 12? ' 上午 ' : ' 下午 ';
				if (hour < 10) hour = '0' + hour;
				if (minute < 10) minute = '0' + minute;
				return month + '月' + date + '日' + noonOrNight + hour + ":" + minute;
			},
			getCommentMinHeight() {
				//根据主贴高度获取评论列表的最小高度，防止底部输入栏因页面高度不够而没法粘在屏幕最底部
				let listHeight;
				uni.createSelectorQuery().in(this).select('.post-list').boundingClientRect(data => {
					listHeight = data.height;
					let systemInfo = uni.getSystemInfoSync();
					//10是主贴和评论列表中间的margin高度，60是底部输入bar的高度
					let res = systemInfo.windowHeight - systemInfo.statusBarHeight - listHeight - 10 - 60;
					this.commentMinHeight = res;
				}).exec();
			},
			getCommentListStor() {
				//获取localStorage里的对应主贴的评论列表
				let commentListId = 'commentList' + this.info.id;
				let commentList = uni.getStorageSync(commentListId);
				if (commentList !== '') this.commentList = commentList;
			},
			setCommentListStor() {
				//向localStorage添加对应主贴的评论列表
				let commentListId = 'commentList' + this.info.id;
				uni.setStorageSync(commentListId, this.commentList);
			},
			getFollowListStor() {
				//获取localStorage里的关注列表
				let followList = uni.getStorageSync('followList');
				if (followList !== '') {
					this.followList = followList;
				}
			}
		},
		onLoad(option) {
			this.info = JSON.parse(option.info);
			this.setCommentListStor();
			this.getFollowListStor();
			this.getCommentListStor();
		},
		onReady() {
			this.getCommentMinHeight();	
		}
	}
</script>

<style scoped lang="scss">
	.status_bar {
		@extend .white-back;
		height: var(--status-bar-height);
		width: 100%;
	}
	.post-list {
		height: auto;
	}
	.commentTitle {
		margin-bottom: 25px;
		font-size: 20px;
		font-weight: bold;
		position: relative;
		top: 10px;
		left: 15px;
	}
	.light-gray-back {
		background-color: #f5f5f5;
	}
	.white-back {
		background-color: white;
	}
	.comment {
		margin-bottom: 5px;
		margin-top: -15px;
	}
	.search-bar {
		height: 60px;
		width: 100%;
		border-top: solid 1px #f5f5f5;
	}
	.input {
		height: 20px !important;
		margin-top: 15px;
		margin-left: 10px;
		background-color: #F8F8FF;
	}
	.iconfont-send {
		font-size: 22px;
	}
	.comment-list {
		margin-top: 10px;
	}
</style>