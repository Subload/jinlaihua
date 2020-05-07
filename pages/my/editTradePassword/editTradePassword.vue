<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="交易密码"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		<view class="main-box">
			<view class="editPw">
				<view>交易密码</view>
				<input password type="number" pattern="[0-9]*" placeholder="请输入6位数纯数字交易密码" v-model="password.newPw" />
			</view>
			<view class="editPw">
				<view>重复交易密码</view>
				<input password type="number" pattern="[0-9]*" placeholder="请重复新交易密码" v-model="password.reNewPw" />
			</view>
			<view class="editPw">
				<view>短信验证码</view>
				<input password type="text" class="systemCode" placeholder="请输入短信验证码" v-model="password.smsCode" />
				<view v-show="showGetBtn" class="systemCodeBtn" @click="getSmsCode">获取验证码</view>
				<view v-show="!showGetBtn" class="systemCodeBtn countDownBtn">{{countDownBtnText}}</view>
			</view>
		</view>
		<view class="btn editPw_btn" @click="handleEdit">确认修改</view>
	</view>
</template>

<script>
	import { regVC } from '@/utils/util.js'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	
	var time = 60;
	var timeDown;
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				password:{
					newPw:"",
					reNewPw:"",
					smsCode:""
				},
				showGetBtn:true,
				countDownBtnText:"60秒后重新获取"
			}
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 保存
			handleEdit(){
				if(this.password.newPw == ""){
					uni.showToast({
						title:"请输入交易密码",
						icon:"none"
					})
					return
				}
				if(this.password.reNewPw == ""){
					uni.showToast({
						title:"请重复交易密码",
						icon:"none"
					})
					return
				}
				if(this.password.smsCode == ""){
					uni.showToast({
						title:"请输入短信验证码",
						icon:"none"
					})
					return
				}
				if(regVC(this.password.newPw)){
					uni.showToast({
						title:"交易密码格式错误，请重新输入",
						icon:"none"
					})
					this.password.newPw = "";
					this.password.reNewPw = ""
					return
				}
				if(this.password.newPw != this.password.reNewPw ){
					uni.showToast({
						title:"两次交易密码不一致，请检查",
						icon:"none"
					})
					return
				}
				if(regVC(this.password.smsCode)){
					uni.showToast({
						title:"验证码格式错误",
						icon:"none"
					})
					return
				}
				let par = {
					userid:decode(this.userInfo.data),
					tradpassword:this.password.newPw,
					name:this.userInfo.accountinfo.data.name,
					code:this.password.smsCode,
					// sign:
				}
				
				uni.showLoading()
				
				this.$API.setTradPassword(par).then(res => {
					
					// 10001验证码过期  10002 验证码错误 10021 验证通过 10042 系统错误
					
					uni.hideLoading()
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
						case "10021":
							_this.$store.state.userInfo.accountinfo.data.tradpassword  = 1;
							uni.showToast({
								title:"设置成功",
								icon:"none"
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1500)
							break;
						case "10042":
							uni.showToast({
								title:"系统错误",
								icon:"none"
							})
							break;
						default:
							uni.showToast({
								title:"系统错误",
								icon:"none"
							})
					}
					console.log(res)
				}).catch(err => {
					// error
					uni.hideLoading()
					uni.showToast({
					    title: err.text,
						icon: 'none',
					    duration: 2000
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				console.log(this.password)
			},
			
			// 获取验证码
			getSmsCode(){
				let userid = decode(this.userInfo.data)
				this.countDown()
				this.$API.sendCodeByUser({userid}).then(res => {
					// success
					if(res.data.message == 10073){
						uni.showToast({
							title:"验证码已发送，请注意查收",
							icon:"none",
						})
						return
					}else if(res.data.message == 10045){
						time = 60;
						this.showGetBtn = !this.showGetBtn;
						clearInterval(timeDown);
						uni.showToast({
							title:"该账号不存在",
							icon:"none",
						})
						return
					}
					time = 60;
					this.showGetBtn = !this.showGetBtn;
					clearInterval(timeDown);
					uni.showToast({
						title:res.data.message,
						icon:"none"
					})
					
					// 更改倒计时状态
					console.log(res)
				}).catch(err => {
					// error
					time = 60;
					this.showGetBtn = !this.showGetBtn;
					clearInterval(timeDown);
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
			// 倒计时
			countDown(){
				this.showGetBtn = !this.showGetBtn;
				timeDown = setInterval(()=>{
					this.countDownBtnText = time+"秒后重新获取";
					time-=1;
					if(time == 0){
						time = 60;
						this.showGetBtn = !this.showGetBtn;
						clearInterval(timeDown);
					}
				},1000)
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
.systemCodeBtn{
	position: absolute;
	right: 20rpx;
	bottom: 0;
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
