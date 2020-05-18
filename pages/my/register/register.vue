<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			leftShow
			rightText="登录"
			title="注册"
			@clickLeft="handleLeftClick"
			@clickRight="handleRightClick"
		></auto-nav-bar>
		
		<image class="logo" src="/static/logo@3x.png" ></image>
		
		<view class="main-box">
			<view class="login_item">
				<text class="login_item_text">手机号</text>
				<input class="login_item_input" type="number" v-model="parameter.name" placeholder="请输入手机号" />
			</view>
			<view class="clear30"></view>
			<view class="login_item">
				<text class="login_item_text">手机验证码</text>
				<input class="login_item_input systemCode" type="number" v-model="parameter.system" placeholder="请输入验证码" />
				<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取手机验证码</view>
				<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
			</view>
			<view class="clear30"></view>
			<view class="login_item">
				<text class="login_item_text">密码</text>
				<input class="login_item_input" password v-model="parameter.password" placeholder="请输入您的密码" />
			</view>
			<view class="clear30"></view>
			<view class="login_item">
				<text class="login_item_text">邀请码</text>
				<input class="login_item_input" v-model="parameter.tgm" placeholder="请输入邀请码" />
			</view>
			<view class="clear30"></view>
			<view style="transform: scale(0.8);transform-origin: left;line-height: 36.28rpx;">
				<radio :checked="radioChecked" @click="handleRadio"><text class="radioText">选勾即表示同意</text></radio><text class="openAgreement" @click="openAgreement">《风险告知书》</text>
			</view>
			<view class="clear30"></view>
			<view>
				<button class="btn" @click="toRegister">注册</button>
			</view>
			<view class="clear30"></view>
			<view class="clear30"></view>
		</view>
	</view>
</template>

<script>
	import {regPhone,regPassword,regCheckNum} from '@/utils/util.js'
	
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'showSmsBtn','smsBtnText']),
		data() {
			return {
				parameter:{
					name:"", // 手机号
					area:"86", // 区号
					password:"", // 密码
					system:"", // 验证码
					tgm:"" // 推荐码
				},
				// 《风险告知书》
				radioChecked:false
			}
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.switchTab({
				    url: "/pages/notice/notice"
				});
				return true; //阻止默认返回行为
			}
		},
		methods: {
			...mapMutations(['smsCountdown']),
			handleLeftClick(){
				uni.switchTab({
				    url: "/pages/notice/notice"
				});
			},
			handleRightClick(){
				uni.navigateTo({
				    url: '../login/login'
				});
			},
			// 点击《风险告知书》
			handleRadio(){
				this.radioChecked = !this.radioChecked
			},
			openAgreement(){
				// plus.runtime.openURL("http://baidu.com")
				uni.navigateTo({
					url:"/pages/agreement/agreement"
				})
			},
			// 点击注册
			toRegister(){
				const that = this;
				if(regPhone(this.parameter.name)){
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none",
						mask:true
					})
					return
				};
				if(regCheckNum(this.parameter.system)){
					uni.showToast({
						title:"请输入正确手机验证码",
						icon:"none",
						mask:true
					})
					return
				}
					
				if(regPassword(this.parameter.password)){
					uni.showToast({
						title:"请输入6-12位数字或字母的密码",
						icon:"none",
						mask:true
					})
					return
				}
				if(!this.parameter.tgm){
					uni.showToast({
						title:"请输入邀请码",
						icon:"none",
						mask:true
					})
					return
				}
				if(!this.radioChecked){
					uni.showToast({
						title:"请先同意《风险告知书》",
						icon:"none",
						mask:true
					})
					return
				}
				
				this.$API.registerComplete(this.parameter).then(res => {
					// success
					switch(res.data.message){
						case "10001":
							uni.showToast({
								title:"验证码过期，请重新获取",
								icon:"none"
							})
							break;
						case "10002":
							uni.showToast({
								title:"验证码错误，请重新输入",
								icon:"none"
							})
							break;
						case "10089":
							uni.showToast({
								title:"推荐码不存在",
								icon:"none",
							})
							break;
						case "10005":
							uni.showToast({
								title: "该账号已存在",
								icon: "none",
							})
							break;
						case "10004":
							uni.showToast({
								title:"注册成功",
								icon:"none",
								success: (res) => {
									setTimeout(() => {
										that.handleRightClick()
									},1500)
								}
							})
							break;
						default:
							uni.showToast({
								title:"网络错误，请重试",
								icon:"none"
							})
					}
				}).catch(err => {
					// error
					uni.showToast({
					    title: err.text,
						icon: 'none',
					    duration: 2000
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				
			},
			// 获取验证码
			getSystem(){
				if(regPhone(this.parameter.name)){
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none",
						mask:true
					})
					return
				};
				this.$API.registerSendCode({name:this.parameter.name,area:this.parameter.area}).then(res => {
					// success
					if(res.data.message == 10073){
						uni.showToast({
							title:"验证码已发送，请注意查收",
							icon:"none",
						})
						this.smsCountdown()
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
						})
					}
				}).catch(err => {
					// error
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
		}
	}
</script>

<style>
.logo{
	display: block;
	margin: 84rpx auto 96rpx;
	width: 156rpx;
	height: 200rpx;
}
.login_item{
	background: #091941;
	padding: 20rpx;
	border-radius: 12rpx;
	/* margin-bottom: 60rpx; */
	position: relative;
}
.login_item_text{
	font-size: 32rpx;
}
.login_item_input{
	padding: 20rpx 0 0;
	font-size: 28rpx;
}
.systemCode{
	width: 50%;
}
.systemCodeBtn{
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	height: 50rpx;
	line-height: 50rpx;
	border-radius: 15rpx;
	background: #D89D1E;
	font-size: 28rpx;
	padding: 0 20rpx;
}
.systemCodeBtn.countDownBtn{
	background: #999999;
}
.openAgreement{
	color: #FCC44D;
	text-decoration: underline;
}
</style>
