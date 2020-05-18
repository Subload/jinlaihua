<template>
	<view>
		<!-- 支付方式 -->
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
		>
			<view slot="title">{{title}}收款</view>
		</auto-nav-bar>	
		<view class="main-box">
			<view v-if="title == '支付宝'">
				<view class="consignee_list clearfix">
					<label>姓名</label>
					<input class="uni-input" placeholder="请输入支付宝账号姓名" v-model="alipay.realname"  />
				</view>
				<view class="consignee_list clearfix">
					<label>验证码</label>
					<input class="uni-input" placeholder="手机验证码" v-model="alipay.code"  />
					<!-- 手机验证码 -->
					<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取验证码</view>
					<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
				</view>
				<view class="consignee_list clearfix image">
					<view class="chooseImage_label">添加支付宝收款码</br>(请添加真实收款码，否则将收不到款)</view>
					<block v-if="showImg">
						<image :src="showImg" class="image" mode="aspectFill" @click="chooseImage"></image>
					</block>
					<block v-else>
						<view class="chooseImage" @click="chooseImage">+ 选择图片</view>
					</block>
				</view>
			</view>
			<view v-if="title == '微信'">
				<view class="consignee_list clearfix">
					<label>姓名</label>
					<input class="uni-input" placeholder="请输入微信实名姓名" v-model="wxpay.realname" />
				</view>
				<view class="consignee_list clearfix">
					<label>验证码</label>
					<input class="uni-input" placeholder="请输入手机验证码" v-model="wxpay.code" />
					<!-- 手机验证码 -->
					<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取验证码</view>
					<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
				</view>
				<view class="consignee_list clearfix image">
					<view class="chooseImage_label">添加微信收款码</br>(请添加真实收款码，否则将收不到款)</view>
					<block v-if="showImg">
						<image :src="showImg" class="image" mode="aspectFill" @click="chooseImage"></image>
					</block>
					<block v-else>
						<view class="chooseImage" @click="chooseImage">+ 选择图片</view>
					</block>
				</view>
			</view>
			<view v-if="title == '银行卡'">
				<view class="consignee_list clearfix">
					<label>姓名</label>
					<input class="uni-input" placeholder="请输入持卡人姓名" v-model="bankcard.realname" />
				</view>
				<view class="consignee_list clearfix">
					<label>银行卡号</label>
					<input class="uni-input" type="number" placeholder="请输入银行卡号" v-model="bankcard.openingline" />
				</view>
				<view class="consignee_list clearfix">
					<label>验证码</label>
					<input class="uni-input" placeholder="请输入手机验证码" v-model="bankcard.code" />
					<!-- 手机验证码 -->
					<view v-if="showSmsBtn" class="systemCodeBtn" @click="getSystem">获取验证码</view>
					<view v-else class="systemCodeBtn countDownBtn">{{smsBtnText}}</view>
				</view>
				<view class="consignee_list clearfix image">
					<view class="chooseImage_label">添加银行卡照片(带卡号面)</view>
					<block v-if="showImg">
						<image :src="showImg" class="image" mode="aspectFill" @click="chooseImage"></image>
					</block>
					<block v-else>
						<view class="chooseImage" @click="chooseImage">+ 选择图片</view>
					</block>
				</view>
			</view>
			<view class="consignee_list clearfix"  v-if="showImg">(如若更改信息，请点击上方图片重新上传)</view>
			
			<view class="clear30"></view>
			<view class="clear30"></view>
		</view>
		
		<view class="btn addPaymentMethod_btn" @click="handleConfirm">保存</view>
	</view>
</template>

<script>
	import { decode,encode } from '@/utils/des3.js' // 参数加密方法
	import { regBackCode,regName } from '@/utils/util.js' // 参数加密方法
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo','showSmsBtn','smsBtnText']),
		data() {
			return {
				title:"",
				type:'', //type 0 为微信, 1为支付宝,2银行卡
				// 当前框里显示的图片 或者 上传之后的临时图片
				showImg:'',
				alipay:{
					realname:"",
					tdcodeimg:"",
					code:""
				},
				wxpay:{
					realname:"",
					tdcodeimg:"",
					code:""
				},
				bankcard:{
					realname:"",
					openingline:"",
					tdcodeimg:"",
					code:""
				}
			}
		},
		onLoad:function(option){
			let item = JSON.parse(decodeURIComponent(option.item));
			this.title = item.name;
			if(item.name == "微信"){
				this.type = '0';
				this.wxpay.realname = this.userInfo.accountinfo.data.payinfo.wxrealname;
				this.wxpay.tdcodeimg = this.userInfo.accountinfo.data.payinfo.wxtdcodeimg;
				this.showImg = this.userInfo.accountinfo.data.payinfo.wxtdcodeimg
			}else if(item.name == "支付宝"){
				this.type = '1';
				this.alipay.realname = this.userInfo.accountinfo.data.payinfo.zfbrealname;
				this.alipay.tdcodeimg = this.userInfo.accountinfo.data.payinfo.zfbtdcodeimg;
				this.showImg = this.userInfo.accountinfo.data.payinfo.zfbtdcodeimg
			}else{
				this.type = '2';
				this.bankcard.realname = this.userInfo.accountinfo.data.payinfo.bankrealname;
				this.bankcard.openingline = this.userInfo.accountinfo.data.payinfo.bankopeningline;
				this.bankcard.tdcodeimg = this.userInfo.accountinfo.data.payinfo.banktdcodeimg;
				this.showImg = this.userInfo.accountinfo.data.payinfo.banktdcodeimg
			}
		},
		methods: {
			...mapMutations(['login','smsCountdown']),
			// 返回
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 提交
			handleConfirm(){
				let _this = this;
				let realname = "";
				let filePath = "";
				let obj={};
				if(_this.type == '0'){
					if(!_this.wxpay.realname||regName(_this.wxpay.realname)){
						uni.showToast({
							title:"请输入正确姓名",
							icon:"none"
						})
						return
					}
					if(!_this.wxpay.tdcodeimg){
						uni.showToast({
							title:"请选择收款码",
							icon:"none"
						})
						return
					}
					if(!_this.wxpay.code){
						uni.showToast({
							title:"请输入手机验证码",
							icon:"none"
						})
						return
					}
					filePath = _this.wxpay.tdcodeimg
					obj = _this.wxpay
					delete(obj["tdcodeimg"])
					obj = encode(obj)
				}
				if(_this.type == '1'){
					if(!_this.alipay.realname||regName(_this.alipay.realname)){
						uni.showToast({
							title:"请输入正确姓名",
							icon:"none"
						})
						return
					}
					if(!_this.alipay.tdcodeimg){
						uni.showToast({
							title:"请选择收款码",
							icon:"none"
						})
						return
					}
					if(!_this.alipay.code){
						uni.showToast({
							title:"请输入手机验证码",
							icon:"none"
						})
						return
					}
					filePath = _this.alipay.tdcodeimg
					obj = _this.alipay
					delete(obj["tdcodeimg"])
					obj = encode(obj)
				}
				if(_this.type == '2'){
					if(!_this.bankcard.realname||regName(_this.bankcard.realname)){
						uni.showToast({
							title:"请输入正确姓名",
							icon:"none"
						})
						return
					}
					if(!_this.bankcard.openingline||regBackCode(_this.bankcard.openingline)){
						uni.showToast({
							title:"请输入正确银行卡号",
							icon:"none"
						})
						return
					}
					
					if(!_this.bankcard.tdcodeimg){
						uni.showToast({
							title:"请选择银行卡照片（带卡号面）",
							icon:"none"
						})
						return
					}
					if(!_this.bankcard.code){
						uni.showToast({
							title:"请输入手机验证码",
							icon:"none"
						})
						return
					}
					filePath = _this.bankcard.tdcodeimg
					obj = _this.bankcard
					delete(obj["tdcodeimg"])
					obj = encode(obj)
					// realname = _this.bankcard.realname
				}
				uni.showLoading()
				uni.uploadFile({
					 // 需要上传的地址
					url: _this.$API.addPayment,
					 // filePath  需要上传的文件
					filePath: filePath,
					name: 'tdcodeimg',
					formData:{
						userid:_this.userInfo.data,
						type: encode(_this.type),
						...obj
					},
					success:(res) => {
						 // 显示上传信息
						 console.log(res)
						uni.hideLoading()
						let resData = JSON.parse(res.data)
						if(res.statusCode != '200'||resData.state != '0'){
							uni.showModal({
								content:"网络错误，请稍后重试",
								showCancel:false
							})
							_this.showImg = ""
							return
						}
						
						if(resData.message == "10237"){
							if(_this.type == '0'){
								_this.$store.state.userInfo.accountinfo.data.payinfo.wxid = resData.data.appid;
								_this.$store.state.userInfo.accountinfo.data.payinfo.wxrealname = resData.data.realname;
								_this.$store.state.userInfo.accountinfo.data.payinfo.wxtdcodeimg = resData.data.tdcodeurl;
								_this.login(_this.userInfo)
							}else if(_this.type == '1'){
								_this.$store.state.userInfo.accountinfo.data.payinfo.zfbid = resData.data.appid;
								_this.$store.state.userInfo.accountinfo.data.payinfo.zfbrealname = resData.data.realname;
								_this.$store.state.userInfo.accountinfo.data.payinfo.zfbtdcodeimg = resData.data.tdcodeurl;
								_this.login(_this.userInfo)
							}else if(_this.type == '2'){
								_this.$store.state.userInfo.accountinfo.data.payinfo.bankid = resData.data.appid;
								_this.$store.state.userInfo.accountinfo.data.payinfo.bankrealname = resData.data.realname;
								_this.$store.state.userInfo.accountinfo.data.payinfo.bankopeningline = resData.data.bankopeningline;
								_this.$store.state.userInfo.accountinfo.data.payinfo.banktdcodeimg = resData.data.tdcodeurl
								_this.login(_this.userInfo)
							}
							uni.showModal({
								content:"设置成功",
								showCancel:false,
								success: () => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}else{
							uni.showModal({
								title:"保存失败",
								content:resData.message,
								showCancel:false
							})
							_this.showImg = ""
						}
					 },
					 fail:()=>{
						 uni.showModal({
						 	content:"保存失败,请重新上传",
						 	showCancel:false
						 })
					 }
				});
			},
			// 选择图片
			chooseImage() {
				let _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						_this.showImg = res.tempFilePaths[0]
						if(_this.type == '0'){
							_this.wxpay.tdcodeimg = res.tempFilePaths[0]
						}else if(_this.type == '1'){
							_this.alipay.tdcodeimg = res.tempFilePaths[0]
						}else{
							_this.bankcard.tdcodeimg = res.tempFilePaths[0]
						}
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '金莱花需要从您的相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			
			
			// 获取验证码
			getSystem(){
				this.$API.sendCodeByUser({userid:decode(this.userInfo.data)}).then(res => {
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
				})
			},
		}
	}
</script>

<style>
.addPaymentMethod_btn{
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	z-index: 999;
}
.consignee_list{
	border-bottom: 1px solid #12224C;
	padding: 30rpx 0;
	display: flex;
	position: relative;
}
.consignee_list label{
	float: left;
	font-size: 28rpx;
	min-width: 180rpx;
}
.consignee_list .uni-input{
	font-size: 28rpx;
	flex: auto;
}


.consignee_list.image{
	display: block;
	/* width: 500rpx;
	height: 500rpx; */
}
.consignee_list.image image{
	width: 300rpx;
	height: 300rpx;
}
.consignee_list .chooseImage_label{
	display: block;
	width: 100%;
	font-size: 28rpx;
	margin-bottom: 20rpx;
}
.consignee_list .chooseImage{
	display: block;
	width: 200rpx;
	height: 200rpx;
	background: #fff;
	color: #081432;
	line-height: 200rpx;
	text-align: center;
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
