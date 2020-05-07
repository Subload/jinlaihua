<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="修改密码"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="main-box">
			<view class="editPw">
				<view>原登录密码</view>
				<input password type="text" placeholder="请输入原登录密码" v-model="password.oldPw" />
			</view>
			<view class="editPw">
				<view>新登录密码</view>
				<input password type="text" placeholder="请输入新登录密码" v-model="password.newPw" />
			</view>
			<view class="editPw">
				<view>重复登录密码</view>
				<input password type="text" placeholder="请重复新登录密码" v-model="password.reNewPw" />
			</view>
		</view>
		<view class="btn editPw_btn" @click="handleReset">重置</view>
	</view>
</template>

<script>
	import {regPassword} from '@/utils/util.js'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				password:{
					oldPw:"",
					newPw:"",
					reNewPw:""
				}
			}
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 重置按钮
			handleReset(){
				if(this.password.oldPw==""||this.password.newPw==""||this.password.reNewPw==""){
					uni.showToast({
						title:"请输入密码",
						icon:"none"
					})
					return
				}
				if(regPassword(this.password.oldPw)){
					uni.showToast({
						title:"旧密码错误",
						icon:"none"
					})
					return
				}
				if(regPassword(this.password.newPw)){
					uni.showToast({
						title:"请输入6-12位密码",
						icon:"none"
					})
					return
				}
				if(this.password.newPw != this.password.reNewPw){
					uni.showToast({
						title:"两次新密码密码不一致",
						icon:"none"
					})
					return
				}
				let userid = decode(this.userInfo.data)
				this.$API.updatelogpwd({oldpwd:this.password.oldPw,newpwd:this.password.newPw,userid}).then(res => {
					// 10238 登录密码修改成功 10023 原密码有误 10020 系统错误
					
					if(res.data.message == "10023"){
						uni.showToast({
						    title: "原密码错误，请重新输入！",
							icon: 'none',
						});
						return
					}
					if(res.data.message == "10020"){
						uni.showToast({
						    title: "系统错误，请稍后重试",
							icon: 'none',
						});
						return
					}
					if(res.data.message == "10238"){
						uni.showToast({
						    title: "修改成功",
							icon: 'none',
						});
						uni.navigateBack()
					}
				}).catch(err => {
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
.editPw_btn{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}
.editPw{
	border-bottom: 1px solid #12224C;
	padding: 30rpx 0;
}
.editPw view{
	font-size: 36rpx;
	margin-bottom: 30rpx;
}
.editPw input{
	line-height: 2;
}
</style>
