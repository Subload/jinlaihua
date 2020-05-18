<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="绑定手机号"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="main-box">
			<view class="editPw">
				<view>手机号</view>
				<input type="number" pattern="[0-9]*" placeholder="请输入绑定手机号" v-model="parameter.phone" />
			</view>
			<view class="editPw">
				<view>手机验证码</view>
				<input type="number" pattern="[0-9]*" style="width: 50%;" placeholder="手机验证码" v-model="parameter.code" />
				<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取验证码</view>
				<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
			</view>
		</view>
		<view class="btn editPw_btn" @click="handleReset">绑定</view>
	</view>
</template>

<script>
	import { regPhone,regCheckNum } from '@/utils/util.js'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo','showSmsBtn','smsBtnText']),
		data() {
			return {
				parameter:{
					userid:"",
					phone:"",
					area:"",
					code:""
				},
			}
		},
		onLoad:function(){
			this.parameter.userid = decode(this.userInfo.data);
		},
		methods: {
			...mapMutations(['smsCountdown']),
			
			handleLeftClick(){
				uni.navigateBack({});
			},
			
			// 获取验证码
			// 重置按钮
			handleReset(){
				uni.showLoading()
				
				if(regPhone(this.parameter.phone)){
					uni.hideLoading()
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none"
					})
					return
				}
				if(regCheckNum(this.parameter.code)){
					uni.hideLoading()
					uni.showToast({
						title:"请输入正确手机验证码",
						icon:"none"
					})
					return
				}
				
				this.$API.bindphone(this.parameter).then(res => {
					// 10024 已被绑定 10021 成功 10020 异常
					if(res.data.message == "10024"){
						uni.hideLoading()
						uni.showToast({
						    title: "该手机号已被绑定",
							icon: 'none',
						});
						return
					}
					if(res.data.message == "10020"){
						uni.hideLoading()
						uni.showToast({
						    title: "系统出现异常，请稍后重试",
							icon: 'none',
						});
						return
					}
					if(res.data.message == "10021"){
						uni.hideLoading()
						uni.showToast({
						    title: "绑定成功",
							icon: 'none',
						});
						uni.navigateBack()
					}
				}).catch(err => {
					// error
					uni.hideLoading()
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			// 获取验证码
			getSystem(){
				if(regPhone(this.parameter.phone)){
					uni.hideLoading()
					uni.showToast({
						title:"请输入正确手机号",
						icon:"none",
						mask:true
					})
					return
				};
				
				this.$API.sendCodeByUser({userid:this.parameter.userid}).then(res => {
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
.editPw_btn{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}
.editPw{
	border-bottom: 1px solid #12224C;
	padding: 30rpx 0;
	position: relative;
}
.editPw view{
	font-size: 36rpx;
	margin-bottom: 30rpx;
}
.editPw input{
	line-height: 2;
}
.systemCode{
	width: 50%;
}
.editPw .systemCodeBtn{
	position: absolute;
	right: 20rpx;
	bottom: 0rpx;
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
</style>
