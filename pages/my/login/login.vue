<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			leftShow
			rightText="注册"
			title="登录"
			@clickLeft="handleLeftClick"
			@clickRight="handleRightClick"
		></auto-nav-bar>	
		
		<image class="logo" src="/static/logo@3x.png" ></image>
		
		<view class="main-box">
			<view class="login_item">
				<text class="login_item_text">手机号</text>
				<input type="number" pattern="[0-9]*" class="login_item_input" v-model="userName" placeholder="请输入手机号" />
			</view>
			<view class="login_item">
				<text class="login_item_text">密码</text>
				<input  password type="text" class="login_item_input" v-model="passWord" placeholder="请输入您的密码" />
			</view>
			<view class="clear30"></view>
			<view>
				<button class="btn" @click="handleLogin">登录</button>
			</view>
			<view class="retrieve">
				<navigator url="/pages/my/retrieve/retrieve">忘记密码？</navigator>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {regPhone,regPassword} from '@/utils/util.js'
	import { mapMutations } from 'vuex';  
	
	export default {
		data() {
			return {
				userName: "",
				passWord: ""
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
			...mapMutations(['login']),
			handleLeftClick(){
				uni.switchTab({
				    url: "/pages/notice/notice"
				});
			},
			handleRightClick(){
				uni.navigateTo({
				    url: '../register/register'
				});
			},
			handleLogin(){
				if(regPhone(this.userName)){
					uni.showToast({
						title:"请填写正确手机号",
						icon:"none",
						mask:true,
					})
					return false;
				}
				if(regPassword(this.passWord)){
					uni.showToast({
						title:"密码错误",
						icon:"none",
						mask:true,
					})
					return false;
				}
				
				uni.showLoading()
				this.$API.login({name:this.userName,password:this.passWord}).then(res => {
					// success
					// decode(str) 解密方法  
					// 10008 账号不存在
					// 10011 密码错误
					// 10012 账号被冻结
					// 10013 成功
					// console.log(res)
					if(res.statusCode == 200){
						uni.hideLoading()
						if(res.data.message == "10008"){
							uni.showToast({
								title: "此账号不存在",
								icon: 'none',
							});
							return
						}else if(res.data.message == "10011"){
							uni.showToast({
								title: "账号或密码错误",
								icon: 'none',
							});
							return
						}else if(res.data.message == "10012"){
							uni.showToast({
								title: "该账号已被冻结！",
								icon: 'none',
							});
							return
						}else if(res.data.message == "10013"){
							this.$store.state.firstTime = true;
							this.login(res.data.data);
							uni.showToast({
								title: "登录成功",
								icon: 'none',
							});
							setTimeout(()=>{
								uni.switchTab({
									url: "/pages/my/my"
								});
							},1500)
						}else{
							uni.showToast({
								title: "网络错误，请稍后重试",
								icon: 'none',
							});
							return
						}
						
					}else{
						uni.showToast({
							title: "网络错误，请稍后重试",
							icon: 'none',
						});
						return
					}
					
				}).catch(err => {
					uni.hideLoading()
					// error
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				
			}
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
	}
	.login_item_text{
		font-size: 32rpx;
	}
	.login_item_input{
		padding: 20rpx 0 0;
		font-size: 28rpx;
	}
	.retrieve{
		float: right;
		font-size: 28rpx;
		color: #d89d1e;
		line-height: 64rpx;
	}

</style>
