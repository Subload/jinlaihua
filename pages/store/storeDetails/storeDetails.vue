<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			:bgColor="bgColor"
			fixed="fixed"
		></auto-nav-bar>	
		
		<view>
			<view class="store-details-swiper">
				<swiper class="swiper" @change="swiperChange" >
					<swiper-item v-for="(banner,index) in swiperInfo.info" :key="index">
						<image class="swiper-img" :src="banner.logo" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="store-details-marker">{{swiperInfo.current}}/{{swiperInfo.info.length}}</view>
			</view>
			
			<view class="clear30"></view>
			<view class="main-box">
				<view class="store-details-price">¥{{storeInfo.price}}</view>
				<view class="store-details-title">{{storeInfo.name}}</view>
				<view class="store-details-server"><text class="store-details-server-title">服务</text><text>快递包邮</text><text>付款后48小时内发货</text></view>
			</view>
			<view class="clear30"></view>
			<view><image  class="store-details-info-pic" src="/static/store/info-pic.png"></image></view>
			<view class="clear30"></view>
			<view class="store-details-info" v-html="storeInfo.message">{{storeInfo.message}}</view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="store-buy" @click="handleGoBuy">立即购买</view>
		</view>
		
	</view>
</template>

<script>
	
	import {
		mapState,
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				bgColor:"rgba(9, 25, 65, 0)",
				swiperInfo:{
					info:[{
						logo:""
					}],
					current:1
				},
				storeInfo:{},
				bottomData: [{
						text: '微信',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
						name: 'wx'
					},
					{
						text: '支付宝',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
						name: 'wx'
					},
					{
						text: 'QQ',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/gird-3.png',
						name: 'qq'
					},
					{
						text: '新浪',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
						name: 'sina'
					},
					{
						text: '百度',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-7.png',
						name: 'copy'
					},
					{
						text: '其他',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
						name: 'more'
					}
				]
			}
		},
		onLoad:function(option){
			 this.storeInfo=JSON.parse(decodeURIComponent(option.item));
			 console.log(JSON.parse(decodeURIComponent(option.item)).logo)
			 this.swiperInfo.info[0].logo = JSON.parse(decodeURIComponent(option.item)).logo||'/static/store/images/pro_01.jpg'
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			swiperChange(e){
				this.swiperInfo.current = e.detail.current + 1;
			},
			onPageScroll(e){
				this.bgColor = "rgba(9, 25, 65, " + e.scrollTop * 0.01 + ")"
			},
			handleGoBuy(){
				console.log(this.hasLogin)
				if(!this.hasLogin){
					uni.showModal({
						content:"请先登录",
						confirmText:"去登陆",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/login/login"
								});
							}
						}
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == 0){
					uni.showModal({
						content:"您还未实名认证，请先实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == 1){
					uni.showModal({
						content:"您的账号实名审核中，完成审核后方可进行此操作",
						showCancel:false,
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == 2){
					uni.showModal({
						content:"您的账号实名审核失败，请重新实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
					return
				}
				uni.navigateTo({
					url: "/pages/store/storeOrder/storeOrder?item=" + encodeURIComponent(JSON.stringify(this.storeInfo)),
				});
			},
		}
	}
</script>

<style>
.store-details-swiper{
	height: 660rpx;
}
.swiper-img{
	width: 100%;
	height: 100%;
}
.store-details-swiper,
uni-swiper{
	height: 660rpx;
	position: relative;
}
.store-details-marker{
	position: absolute;
	bottom: 30rpx;
	right: 30rpx;
	background: rgba(0,0,0,.6);
	font-size: 28rpx;
	padding: 0 18rpx;
	border-radius: 8rpx;
}
.store-buy{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	line-height: 100rpx;
	height: 100rpx;
	text-align: center;
	background: #ff3e3e;
}
.store-details-price{
	color: #ff3e3e;
	font-size: 50rpx;
	line-height: 1.4;
}
.store-details-title{
	font-size: 32rpx;
	line-height: 1.4;
	padding: 0 0 20rpx 0;
}
.store-details-server{
	font-size: 28rpx;
	height: 90rpx;
	line-height: 90rpx;
	border-top: 1px solid #12224c;
	border-bottom: 1px solid #12224c;
}
.store-details-server-title{
	color: #dcdcdc;
	margin-left: 0 !important;
}
.store-details-server text{
	margin-left:80rpx;
}
.store-details-info-pic{
	width: 230rpx;
	height: 26rpx;
	display: block;
	margin: 0 auto;
}
.store-details-info img{
	display: block;
}
>>>img{
	max-width: 100% !important;
}


/* 底部分享 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}

	.uni-share-title {
		line-height: 60rpx;
		font-size: 24rpx;
		padding: 15rpx 0;
		text-align: center;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 15px;
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 200rpx;
	}

	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.content-image {
		width: 60rpx;
		height: 60rpx;
	}

	.uni-share-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}

	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}


</style>
