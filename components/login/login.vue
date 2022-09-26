<template>
	<view class="u-page">

			
		<closeButton></closeButton>
			
		<view class="u-demo-block">
			<u--text 
			:text="title" 
			class="u-demo-block__title" 
			bold size="24px" 
			align="center" 
			customStyle="margin-bottom: 50px; margin-top:75px"></u--text>
			<view class="u-demo-block__content">
				<!-- 用户手机号格式有误时弹出错误提示 -->
				<u-row  class="row" v-show="error" customStyle="margin-bottom: 10px;">
					<u-col span="10" offset="1">
						<u-alert :title="errorTitle" type = "error" showIcon></u-alert>
					</u-col>
				</u-row>
				<u-row class="row" customStyle="margin-bottom: 10px;">
					<u-col span="10" offset="1">
						<!-- 用户名输入栏 -->
						  <u-input
						    :placeholder="idPlaceholder"
						    border="bottom"
						    v-model="userId"
						  >
							<template v-if="!isPassword" slot="prefix">
								<view style="margin-right: 20px;">+86</view>
							</template>
						  </u-input>
					</u-col>
				</u-row>
				<u-row class="row">
					<u-col span="10" offset="1">
						<!-- 密码输入栏 -->
						<u-input
						  :placeholder="passwordPlaceholder"
						  border="bottom"
						  v-model="password"
						  :password="isPassword"
						  customStyle="padding: 0px 0px 0px 9px"
						>
							<template slot="suffix" v-if="isPassword">
								<view 
								class="small-font dark-gray-font link-gray" 
								@click="moveToOtherPage('retrievePassword')" 
								style="height: 40px; line-height: 40px;">
									忘记密码？
								</view>
							</template>
							<!-- 验证码获取按钮 -->
							<template slot='suffix' v-else>
								<u-toast ref="uToast"></u-toast>
								<u-code :seconds="60" @end="endTimeOut" @start="startTimeOut" ref="uCode" 
								@change="codeChange" changeText="x" keepRunning uniqueKey="login-page"></u-code>
								<u-button 
								type="primary" 
								:customStyle="{width: 80 + 'px', padding: 0 + 'px', fontSize: codeFontSize + 'px'}" 
								:disabled="codeDisabled" 
								@tap="getCode">
									{{timeOutTips}}
								</u-button>
							</template>
						</u-input>
					</u-col>	
				</u-row>
				<u-row class="row">
					<u-col span="10" offset="1">
						<u-button type="primary" shape="circle" text="登录" :disabled="loginDisabled" @click="login"></u-button>
					</u-col>
					
				</u-row>
				<u-row class="row">
					<u-col span="3" offset="2" customStyle="align-items: flex-end;">
							<text v-text="switchedLoginType" class="small-font link-font" @click="moveToOtherPage(switchedLoginPage, true)"></text>	
					</u-col>
					<u-col span="2" customStyle="align-items: center;">
							<view v-text="'|'" class="small-font"></view>	
					</u-col>
					<u-col span="3" customStyle="align-items: flex-start;">
							<text class="small-font link-font" @click="moveToOtherPage('problem')">登陆遇到问题</text>	
					</u-col>
				</u-row>
				<u-row class="row">
					<u-col span="2" offset="2" customStyle="align-items: center;">
							<u-line color="darkgray" length="100%"></u-line>	
					</u-col>
					<u-col span="4" customStyle="align-items: center;">
							<text class="dark-gray-font small-font">社交帐号登录</text>
					</u-col>
					<u-col span="2" customStyle="align-items: center;">
							<u-line color="darkgray" length="100%"></u-line>	
					</u-col>
				</u-row>
				<!-- 社交帐号图标 -->
				<u-row class="row">
					<u-col span="2" offset="3" customStyle="align-items: center;">
						<view @click="loginByOtherProvider('微信')">
							<i class="iconfont iconfont-wechat">&#xe73b;</i>
						</view>
					</u-col>
					<u-col span="2" customStyle="align-items: center;">
						<view @click="loginByOtherProvider('QQ')">
							<i class="iconfont iconfont-qq">&#xe73e;</i>
						</view>
					</u-col>
					<u-col span="2" customStyle="align-items: center;">
						<view @click="loginByOtherProvider('微博')">
							<i class="iconfont iconfont-sina">&#xe73c;</i>
						</view>
					</u-col>
				</u-row>
				<u-row class="row">
					<u-col span="10" offset="1" customStyle="align-items: center">
						<view class="small-font dark-gray-font">
							注册即代表同意
							<text class="link-font" @click="moveToOtherPage('agreement')">&laquoxxx社区协议&raquo</text>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
</template>

<script>
	import moveToOtherPage from '@/mixins/move.js'
	export default {
		props: ['loginType'],
		mixins: [moveToOtherPage],
		data() {
			return {
				userId:'',
				password:'',
				error: false,
				errorTitle: '',
				timeOutTips: '',
				codeDisabled: false,
				codeFontSize: 13
			}
		},
		computed: {
			title(){
				return this.loginType;
			},
			isPassword(){
				return this.loginType === '账号密码登录';
			},
			loginDisabled(){
				return this.userId == '' || this.password == '';
			},
			switchedLoginType() {
				return this.isPassword? '验证码登录': '账号密码登录';
			},
			switchedLoginPage() {
				return this.isPassword? 'loginByCode': 'loginByPassword';
			},
			idPlaceholder(){
				return this.isPassword? '昵称/手机号/邮箱': '手机号';
			},
			passwordPlaceholder(){
				return this.isPassword? '请输入密码': '请输入验证码';
			}
			
		},
		methods: {
			login(){
				if (!this.isPassword && !this.checkPhoneNumber()){
					return;
				}
				this.error = false;
				uni.setStorageSync('userId', this.userId);
				uni.setStorageSync('password', this.password);
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			checkPhoneNumber(){
				//检查手机号格式是否正确
				var phoneRule = /^[1][3,5,7.8][0-9]{9}$/;
				if (phoneRule.test(this.userId) == false){
					this.errorTitle = '请输入正确的手机号码';
					this.error = true;
					return false;
				}
				return true;
			},
			codeChange(text) {
				this.timeOutTips = text;
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					if (!this.checkPhoneNumber()) return;
					this.error = false;
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 1000);
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			endTimeOut() {
				//uni.$u.toast('倒计时结束');
				this.codeDisabled = false;
				this.codeFontSize = 13;
			},
			startTimeOut() {
				//uni.$u.toast('倒计时开始');
				this.codeDisabled = true;
				this.codeFontSize = 18;
			},
			loginByOtherProvider(providerName){
				console.log(providerName + '授权登录');
			}
		}
	}
</script>

<style scoped lang="scss">	
	.row {
		margin-bottom: 20px;
	}
	
	.small-font {
		font-size: 13px;
	}
	
	.link-font {
		color: #3c9cff;
	}
	
    .link-font:active {
		color: purple;
	} 
	
	.dark-gray-font {
		color: darkgray;
	}	
	
	.iconfont-wechat {
		color: #00CD00;
	}
	
	.iconfont-wechat:active {
		color: green;
	}
	
	.iconfont-qq {
		color: #00BFFF;
	}
	
	.iconfont-qq:active {
		color: #4169E1;
	}
	
	.iconfont-sina {
		color: orange
	}
	
	.iconfont-sina:active {
		color: 	#EE7621;
	}
	
	.link-gray:hover, .link-gray:active {
		color: #696969;
	}
</style>