<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			leftShow
			rightText="登录"
			title="忘记密码"
			@clickLeft="handleLeftClick"
			@clickRight="handleRightClick"
		></auto-nav-bar>
		
		<image class="logo" src="/static/logo@3x.png" ></image>
		
		<view class="main-box">
			<view class="login_item">
				<text class="login_item_text">手机号</text>
				<input class="login_item_input" type="number" v-model="name" placeholder="请输入手机号" />
			</view>
			<view class="login_item">
				<text class="login_item_text">验证码</text>
				<input class="login_item_input systemCode" type="number" v-model="system" placeholder="请输入验证码" />
				<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取验证码</view>
				<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
			</view>
			<view class="login_item">
				<text class="login_item_text">新密码</text>
				<input class="login_item_input" type="number" password v-model="password" placeholder="请输入您的密码" />
			</view>
			<view>
				<button class="btn" @click="toRegister">提交</button>
			</view>
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
				name:"", // 手机号
				password:"", // 新密码
				system:"", // 验证码
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
			
			// 提交
			toRegister(){
				const that = this;
				if(regPhone(this.name)){
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none",
						mask:true
					})
					return
				};
				if(regCheckNum(this.system)){
					uni.showToast({
						title:"请输入正确手机验证码",
						icon:"none",
						mask:true
					})
					return
				}
				if(regPassword(this.password)){
					uni.showToast({
						title:"请输入6-12位数字或字母的密码",
						icon:"none",
						mask:true
					})
					return
				}
				
				uni.showLoading()
				// 校验验证码
				this.$API.forget({name:this.name,code:this.system}).then(res => {
					// success
					// 10001 验证码过期 10002 验证码错误 10003 验证通过 
					
					if(res.data.message == "10001"){
						uni.hideLoading()
						uni.showToast({
							title:"验证码过期，请重试",
							icon:"none",
						})
						return
					}
					if(res.data.message == "10002"){
						uni.hideLoading()
						uni.showToast({
							title:"验证码错误，请重试",
							icon:"none",
						})
						return
					}
					
					if(res.data.message == "10003"){
						
						// 设置新密码
						this.$API.forgetComplete({name:this.name,password:this.password}).then( re=> {
							// success
							// 10021 设置密码成功 10020 设置失败
							
							if(re.data.message == "10020"){
								uni.hideLoading()
								uni.showToast({
									title:"设置失败，请重试",
									icon:"none",
								})
								return
							}
							if(re.data.message == "10021"){
								uni.hideLoading()
								uni.showToast({
									title:"修改成功，请重新登录",
									icon:"none",
									success: (e) => {
										setTimeout((e) => {
											that.handleRightClick()
										},2000)
									}
								})
							}
							
							// console.log(res)
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
						return
					}
					
					// 以上都没有
					uni.showToast({
						title:"网络错误，请重试",
						icon:"none",
					})
					
					// 更改倒计时状态
					// console.log(res)
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
				if(regPhone(this.name)){
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none",
						mask:true
					})
					return
				};
				
				this.$API.forgetSendCode({name:this.name}).then(res => {
					// success
					if(res.data.message == 10073){
						uni.showToast({
							title:"验证码已发送，请注意查收",
							icon:"none",
						})
						this.smsCountdown()
					}else if(res.data.message == 10045){
						uni.showToast({
							title:"该账号不存在",
							icon:"none",
						})
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
	margin-bottom: 60rpx;
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
	font-size: 24rpx;
	padding: 0 20rpx;
}
.systemCodeBtn.countDownBtn{
	background: #999999;
}
</style>
