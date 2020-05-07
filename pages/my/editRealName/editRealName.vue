<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="实名认证"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>

		<view class="main-box">
			<view class="consignee_list clearfix">
				<label>姓名</label>
				<input class="uni-input" placeholder="请输入真实姓名" v-model="parameter.name"  />
			</view>
			<view class="consignee_list clearfix">
				<label>身份证号</label>
				<input class="uni-input" type="number" pattern="[0-9]*" placeholder="请输入身份证号" v-model="parameter.idcardnum"  />
			</view>
			<view class="consignee_list clearfix image">
				<view class="chooseImage_label">身份证人像面</view>
				<block v-if="frontOfIDCard">
					<image :src="frontOfIDCard" class="image" mode="widthFix" @click="chooseImage('frontOfIDCard')"></image>
				</block>
				<block v-else>
					<view class="chooseImage" @click="chooseImage('frontOfIDCard')">+ 选择图片</view>
				</block>
			</view>
			<view class="consignee_list clearfix image">
				<view class="chooseImage_label">身份证国徽面</view>
				<block v-if="reverseOfIDCard">
					<image :src="reverseOfIDCard" class="image" mode="widthFix" @click="chooseImage('reverseOfIDCard')"></image>
				</block>
				<block v-else>
					<view class="chooseImage" @click="chooseImage('reverseOfIDCard')">+ 选择图片</view>
				</block>
			</view>
			
			<view class="clear30"></view>
			<view class="clear30"></view>
		</view>
		
		<view class="btn addPaymentMethod_btn" @click="handleConfirm">提交</view>
	</view>
</template>

<script>
	import { regName, regIDC } from '@/utils/util.js'
	import { decode, encode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				parameter:{
					name:"", // 姓名
					idcardnum:"" // 身份证号
				},
				frontOfIDCard:"", // 身份证正面
				reverseOfIDCard:"", // 身份证反面
				// holdingIDCard:"", // 手持身份证
				// photos:["","",""]
			}
		},
		onLoad:function(option){
			// console.log(this.$children.__page__.route)
		},
		methods: {
			...mapMutations(['login']),
			// 返回
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 提交
			handleConfirm(){
				let _this = this;
				if(regName(_this.parameter.name)){
					// 真实姓名
					uni.showModal({
						content:"请填写真实姓名",
						showCancel:false
					})
					return
				}
				if(regIDC(_this.parameter.idcardnum)){
					// 身份证号
					uni.showModal({
						content:"请填写真实身份证号码",
						showCancel:false
					})
					return
				}
				if(_this.frontOfIDCard == "" || _this.reverseOfIDCard == "" ){
					// 身份证号
					uni.showModal({
						content:"请先上传相应照片",
						showCancel:false
					})
					return
				}
				// 照片上传
				uni.showLoading()
				// 验证身份证
				// this.idcardvalid()
				// 提交
				uni.uploadFile({
					 // 需要上传的地址
					url: _this.$API.seniorCertificate,
					files: [
						{
							name:"front",
							uri:_this.frontOfIDCard
						},
						{
							name:"back",
							uri:_this.reverseOfIDCard
						}
					],
					formData:{
						 userid:_this.userInfo.data,
						 area: encode("86"),
						 name: encode(_this.parameter.name),
						 idcardnum: encode(_this.parameter.idcardnum)
					 },
					 success(res) {
						 // 显示上传信息
						 console.log(res)
						 uni.hideLoading()
						 if(res.statusCode != 200){
							 uni.showModal({
							 	content:"网络错误，请稍后重试",
								showCancel:false
							 })
							 return
						 }
						 let resData = JSON.parse(res.data)
						 console.log(resData)
						if(resData.message == "10036"){
							uni.showModal({
								content:"提交成功",
								showCancel:false,
								success: () => {
									_this.$store.state.userInfo.accountinfo.data.senior  = 1;
									uni.navigateBack({
										delta:1
									})
								}
							})
						}else if(resData.message == "10035"){
							uni.showModal({
								content:"您已提交过，请等待审核或联系客服咨询",
								showCancel:false,
							})
						}else{
							uni.showModal({
								content:resData.message,
								showCancel:false,
							})
						}
					 }
				});
			},
			
			// 验证身份证是否已提交
			idcardvalid(){
				this.$API.idcardvalid({idcard:this.parameter.idcardnum}).then(res => {
					console.log("验证身份证是否已提交",res)
					// this.uploadImage()
					// if(res.statusCode == 200){
					// 	if(res.data.data.length>0){
					// 		this.passCardInfo = res.data.data;
					// 	}
					// }else{
					// 	uni.showToast({
					// 		title:"获取通证失败，请稍后刷新重新",
					// 		icon:"none"
					// 	})
					// }
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
			},
			
			// 上传照片
			uploadImage(){
				let _this = this;
				uni.uploadFile({
					 // 需要上传的地址
					url: _this.$API.seniorCertificate,
					files: [
						{
							name:"front",
							uri:_this.frontOfIDCard
						},
						{
							name:"back",
							uri:_this.reverseOfIDCard
						}
					],
					formData:{
						 userid:_this.userInfo.data,
						 area: encode("86"),
						 name: encode(_this.parameter.name),
						 idcardnum: encode(_this.parameter.idcardnum)
					 },
					 success(res) {
						 // 显示上传信息
						 console.log(res)
						 uni.hideLoading()
						 if(res.statusCode != 200){
							 uni.showModal({
							 	content:"网络错误，请稍后重试",
								showCancel:false
							 })
							 return
						 }
						 let resData = JSON.parse(res.data)
						 console.log(resData)
						if(resData.message == "10036"){
							uni.showModal({
								content:"提交成功",
								showCancel:false,
								success: () => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}else if(resData.message == "10035"){
							uni.showModal({
								content:"您已提交过，请等待审核或联系客服咨询",
								showCancel:false,
							})
						}else{
							uni.showModal({
								content:resData.message,
								showCancel:false,
							})
						}
					 }
				});
			},
			
			// 选择图片
			chooseImage(str) {
				console.log(str)
				let _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						switch(str){
							case "frontOfIDCard":
								_this.frontOfIDCard = res.tempFilePaths[0]
								break;
							case "reverseOfIDCard":
								_this.reverseOfIDCard = res.tempFilePaths[0]
								break;
							
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
			}
			
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

</style>

