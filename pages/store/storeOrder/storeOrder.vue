<template>
	<view>
		<auto-nav-bar
			leftShow
			title="提交订单"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		<view class="clear30"></view>
		<view class="main-box">
			<!-- 设置地址 -->
			<view class="clearfix store-order-address" @click="handleAddress">
				<view v-if="address.address" class="clearfix">
					<view v-if="address.username" class="store-order-address-info">
						<view class="store-order-address-info-name">
							<text>{{address.username}}</text>
							<text>{{address.phone}}</text>
						</view>
						<view class="store-order-address-info-address">{{address.province + address.area + address.city +  address.address}}</view>
					</view>
					<view class="store-order-address-arrow"><image src="/static/my/arrow@3x.png"></image></view>
				</view>
				<view v-else  class="clearfix">
					<view v-if="oldaddress.username" class="store-order-address-info">
						<view class="store-order-address-info-name">
							<text>{{oldaddress.username}}</text>
							<text>{{oldaddress.phone}}</text>
						</view>
						<view class="store-order-address-info-address">{{oldaddress.province + oldaddress.area + oldaddress.city +  oldaddress.address}}</view>
					</view>
					<view v-else class="store-order-address-info clearfix">
						<view class="add-address"><image src="/static/my/addressWhite@3x.png" mode="aspectFill"></image></view>
						<text class="add-address-text">添加收货地址</text>
					</view>
					<view class="store-order-address-arrow"><image src="/static/my/arrow@3x.png"></image></view>
				</view>
				
			</view>
			<view class="clear30"></view>
			<view class="store_order_info">
				<view class="store_order_info_title">商品</view>
				<view class="store_order_info_pro clearfix">
					<view class="store_order_info_pro_pic"><image :src="storeInfo.logo" mode="aspectFill"></image></view>
					<view class="store_order_info_pro_name">{{storeInfo.name}}</view>
					<view class="store_order_info_pro_price">
						<text>¥{{storeInfo.price}}</text>
						<text>x1</text>
					</view>
				</view>
				<view class="store_order_info_num clearfix">
					<text>购买数量</text>
					<!-- 数字 -->
					<view>
						<uni-number-box :min="1" :value="quantity" v-model="quantity" @change="change" />
					</view>
				</view>
				<view class="store_order_info_server clearfix">
					<text>运费</text>
					<view>包邮</view>
				</view>
				<view class="store_order_info_price clearfix">
					<text>商品总价</text>
					<view>¥{{(storeInfo.price * quantity).toFixed(2)}}</view>
				</view>
				
				<view class="store_order_info_total clearfix">
					<view class="store_order_info_total_submit" @click="togglePopup">提交订单</view>
					<view class="store_order_info_total_price">
						<text>共 {{quantity}} 件，</text>
						<text>合计：¥{{(storeInfo.price * quantity).toFixed(2)}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="payment" type="bottom" >
			<view class="order_payment">
				<view class="order_payment_top">
					<view class="order_payment_cancel" @click="cancel"><image src="/static/pay/close@3x.png" mode="aspectFill"></image></view>
					<text>付款详情</text>
				</view>
				<view class="main-box order_payment_bottom">
					<view class="order_payment_bottom_price"><text>¥</text>{{(storeInfo.price * quantity).toFixed(2)}}</view>
					<view class="clearfix">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd clearfix" v-for="(item, index) in items" :key="item.value">	
								<view class="order_payment_bottom_logo">
									<image :src="item.logo" mode="aspectFill"></image>
								</view>
								<view class="order_payment_bottom_name">{{item.name}}</view>
								<view class="order_payment_bottom_check">
									<radio :value="item.value" :checked="index === current" />
								</view>
							</label>
						</radio-group>
					</view>
					<view class="clear30"></view>
					<view class="btn store_order_btn" @click="goAliPay(alipay_sdk)">立即付款</view>
					<view class="clear30"></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		components: {
			uniPopup
		},
		data() {
			return {
				// 商品基本信息
				storeInfo:{},
				// 购买基本信息
				quantity:'1', // 购买数量
				// 地址选择页面传来的
				address:{},
				// 获取的默认数据
				oldaddress:{},
				items: [{
						value: 'alipay',
						name: '支付宝',
						checked: 'true',
						logo: '/static/pay/aliPay@3x.png'
					},
					// {
					// 	value: 'wxpay',
					// 	name: '微信',
					// 	logo: '/static/pay/wxPay@3x.png'
						
					// }
					],
				current: 0,
				alipay_sdk:"",
			}
		},
		onLoad: function (option) {
		    this.storeInfo=JSON.parse(decodeURIComponent(option.item));
			this.getBusinessOrder()
		},
		methods: {
			// 返回上一步
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 跳转选择地址或者添加地址
			handleAddress(){
				// console.log(this.address.username)
				// if(this.address.username){
				// 	uni.navigateTo({
				// 		url: "/pages/my/address/address",
				// 	});
				// 	return;
				// }
				uni.navigateTo({
					url: "/pages/my/address/address",
				});
			},
			// 购买数量
			change(value) {
				this.quantity = value
			},
			
			// 获取默认地址
			getBusinessOrder(){
				if(this.address.address){
					return;
				}
				uni.showLoading()
				let userid = decode(this.userInfo.data)
				this.$API.getBusinessOrder({userid,commdityid:this.storeInfo.id,commditynum:this.quantity}).then(res => {
					// console.log("获取默认地址",res)
					
					if(res.statusCode == 200){
						if(res.data.data.length>0){
							this.oldaddress = res.data.data[0];
							uni.hideLoading()
						}
						uni.hideLoading()
					}else{
						uni.hideLoading()
						uni.showToast({
							title:"网络错误",
							icon:"none"
						})
					}
				}).catch(err => {
					// error
					uni.hideLoading();
					uni.showToast({
						title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
			// 提交订单
			togglePopup(type, open) {
				if(this.alipay_sdk){
					this.$refs['payment'].open()
					return
				}
				uni.showLoading();
				let userid = decode(this.userInfo.data);
				let parameter = {
					userid,
					username:"",
					phone:"",
					address:"",
					commdityid:this.storeInfo.id,
					commditynum:this.quantity,
				}
				if(this.address.address){
					parameter.username = this.address.username;
					parameter.phone = this.address.phone;
					parameter.address = this.address.province +  this.address.address
				}else if(this.oldaddress.address){
					parameter.username = this.oldaddress.username;
					parameter.phone = this.oldaddress.phone;
					parameter.address = this.oldaddress.province +  this.oldaddress.address
				}else{
					uni.hideLoading();
					uni.showToast({
						title:"请填写收货地址",
						icon:"none"
					})
					return
				}
				
				// 暂时不提交
				// return
				
				this.$API.accomplishBusinessOrder(parameter).then(res => {
					uni.hideLoading()
					if(res.statusCode == '200' && res.data.state == '0'){
						this.alipay_sdk = res.data.data
						this.$refs['payment'].open()
					}else{
						uni.showModal({
							content:"订单拉取失败，请返回后重新下单",
							showCancel:false,
							success:() => {
								uni.navigateBack()
							}
						})
					}
				}).catch(err => {
					// error
					uni.hideLoading();
					uni.showModal({
						content:"订单拉取失败，请返回后重新下单",
						showCancel:false,
						success:() => {
							uni.navigateBack()
						}
					})
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				
			},
			// 拉取支付宝
			goAliPay(data){
				let that = this;
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: data, //微信、支付宝订单数据
				    success: function (res) {
						// 返回主要信息
						let reData = res.rawdata;
						reData = JSON.parse(reData);
						console.log(reData)
						that.cancel()
						switch (reData.resultStatus) {
							case "9000":
								uni.showModal({
									title:"支付成功",
									content:"支付成功，去认购JLH.MP？",
									confirmText:"去认购",
									success: (res) => {
										if (res.confirm) {
											uni.navigateTo({
												url:"/pages/store/buyMot/buyMot"
											})
										} else if (res.cancel) {
											uni.navigateBack({
												delta:1
											})
										}
									}
								})
								break;
							case "8000":
								uni.showToast({
									title:"正在处理中",
									icon:"none"
								})
								break;
							case "4000":
								uni.showToast({
									title:"订单支付失败",
									icon:"none"
								})
								break;
							case "5000":
								uni.showToast({
									title:"请勿重复支付",
									icon:"none"
								})
								break;
							case "6001":
								uni.showToast({
									title:"已取消支付",
									icon:"none"
								})
								break;
							case "6002":
								uni.showToast({
									title:"网络连接出错，支付失败，请稍后重试",
									icon:"none"
								})
								break;
							case "6004":
								uni.showToast({
									title:"支付结果未知",
									icon:"none"
								})
								break;
							default:
								uni.showToast({
									title:"支付失败",
									icon:"none"
								})
						}
						
				    },
				    fail: function (err) {
						console.log(err)
						that.cancel()
						uni.showToast({
							title:"支付失败",
							icon:"none"
						})
				        // console.log('fail:' + JSON.stringify(err));
				    }
				});
			},
			
			cancel(type) {
				this.$refs['payment'].close()
			},
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						// console.log(this.items[i].value)
						this.current = i;
						break;
					}
				}
			}
		},
		onBackPress() {
			this.$refs['payment'].close()
		}
	}
</script>

<style>
.uni-list-cell {
	display: block;
	border-bottom: 1rpx solid #12224C;
	padding: 20rpx 0;
}
.uni-list-cell>*{
	float: left;
	line-height: 100rpx;
}
.order_payment_bottom_check{
	float: right;
}
.order_payment_bottom_name{
	margin-left: 30rpx;
}

.store-order-address{
	padding: 20rpx;
	background: #091941;
	border-radius: 15rpx;
}
.store-order-address-info{
	float: left;
	width: 560rpx;
}
.store-order-address-info-name{
	margin-bottom: 10rpx;
}
.store-order-address-info-name text{
	margin-right: 20rpx;
}
.store-order-address-info-address{
	font-size: 28rpx;
}
.store-order-address-arrow{
	float: right;
	margin-top: 10rpx;
}
.store-order-address-arrow image{
	display: block;
	width: 60rpx;
	height: 60rpx;
}
.store_order_info{
	background: #091941;
	border-radius: 15rpx;
}
.store_order_info_title{
	font-size: 36rpx;
	padding: 20rpx;
}
.store_order_info_pro{
	padding: 0  20rpx 30rpx;
	border-bottom: 1px solid #12224C;
}
.store_order_info_pro_pic{
	float: left;
	width: 130rpx;
	height: 130rpx;
}
.store_order_info_pro_pic image{
	width: 100%;
	height: 100%;
}
.store_order_info_pro_name{
	float: left;
	width: 340rpx;
	line-height: 1.4;
	font-size: 28rpx;
	margin-left: 20rpx;
	text-align: justify;
	overflow: hidden;
	text-overflow: -o-ellipsis-lastline;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.store_order_info_pro_price{
	float: right;
}
.store_order_info_pro_price text{
	text-align: right;
	display: block;
	line-height: 1.4;
}
.store_order_info_num{
	padding: 20rpx;
	border-bottom: 1px solid #12224C;
}
.store_order_info_num text{
	float: left;
	line-height: 60rpx;
}
.store_order_info_num view{
	float: right;
}
.store_order_info_server{
	border-bottom: 1px solid #12224C;
}
.store_order_info_server text,
.store_order_info_server view,
.store_order_info_price text,
.store_order_info_price view{
	line-height: 60rpx;
	padding: 20rpx;
	float: left;
}
.store_order_info_server view,
.store_order_info_price view{
	float: right;
}

.store_order_info_total{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background: #091941;
	z-index: 99;
}
.store_order_info_total view{
	float: right;
	height: 120rpx;
	line-height: 120rpx;
}
.store_order_info_total_submit{
	width: 250rpx;
	background: #ff3e3e;
	text-align: center;
	font-size: 36rpx;
}
.store_order_info_total_price{
	text-align: right;
	font-size: 28rpx;
	padding-right: 20rpx;
}
.store_order_info_total_price text:nth-child(2){
	font-size: 34rpx;
	color: #FF3E3E;
}

.order_payment{
	background: #091941;
	border-radius: 30rpx 30rpx 0 0;
}
.order_payment_top{
	border-bottom: 1rpx solid #12224C;
	font-size: 36rpx;
	text-align: center;
	position: relative;
	padding: 20rpx 0;
}
.order_payment_cancel{
	position: absolute;
	left: 30rpx;
	top: 20rpx;
	width: 30rpx;
	height: 30rpx;
}
.order_payment_cancel image{
	width: 100%;
	height: 100%;
}
.store_order_btn{
	border-radius: 15rpx;
}
.order_payment_bottom_price{
	text-align: center;
	color: #DC2626;
	font-size: 60rpx;
	font-weight: 400;
	padding: 30rpx 0;
}
.order_payment_bottom_price text{
	font-size: 36rpx;
	margin-right: 15rpx;
}
.order_payment_bottom_logo{
	width: 100rpx;
	height: 100rpx;
}
.order_payment_bottom_logo image{
	width: 100%;
	height: 100%;
}
.add-address{
	float: left;
	width: 50rpx;
	height: 50rpx;
}
.add-address image{
	width: 100%;
	height: 100%;
	margin-top: 10rpx;
}
.add-address-text{
	float: left;
	margin-top: 10rpx;
	font-size: 34rpx;
	line-height: 50rpx;
	margin-left: 10rpx;
}


</style>
