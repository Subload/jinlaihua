<template>
	<view>
		<auto-nav-bar
			title="交易"
			rightBusiness
			@clickRight="handleClickRight"
		>
		</auto-nav-bar>
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="downOption" :up="upOption">
				<view class="business-title">{{title}}</view>
				<view class="business-price">当前价格：{{dataList.price}}RMB</view>
				<view class="business-list clearfix">
					<view class="business-list-left">
						<view class="business-list-left-title clearfix">
							<view>买</view>
							<view>数量</view>
							<view>价格</view>
						</view>
						<view v-if="dataList.buylist && dataList.buylist.length>0">
							<view class="business-list-info clearfix" v-for="(buyItem, index) in dataList.buylist" :key="index">
								<view>{{index}}</view>
								<view>{{buyItem.num}}</view>
								<view>{{buyItem.price}}</view>
							</view>
						</view>
						<view v-else>
							<view class="business-list-info clearfix">
								<view>—</view>
								<view>—</view>
								<view>—</view>
							</view>
						</view>
						
					</view>
					<view class="business-list-right">
						<view class="business-list-right-title clearfix">
							<view>价格</view>
							<view>数量</view>
							<view>卖</view>
						</view>
						<view v-if="dataList.selllist && dataList.selllist.length>0">
							<view class="business-list-info clearfix" v-for="(sellItem, index) in dataList.selllist" :key="index">
								<view>{{sellItem.price}}</view>
								<view>{{sellItem.num}}</view>
								<view>{{index}}</view>
							</view>
						</view>
						<view v-else>
							<view class="business-list-info clearfix">
								<view>—</view>
								<view>—</view>
								<view>—</view>
							</view>
						</view>
					</view>
				</view>
				<view class="clear30"></view>
				<view class="clear30"></view>
				<view class="clear30"></view>
				<view class="clear15"></view>
				<view class="business-trade clearfix">
					<view class="business-trade-box business-trade-left">
						<view class="business-btn-buy business-btn" @click="toSecMarket('buy')">我要买入</view>
					</view>
					<view class="business-trade-box business-trade-right">
						<view class="business-btn-sell business-btn" @click="toSecMarket('sell')">我要卖出</view>
					</view>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				// mescroll: null, //mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的常用配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效(native: true, 则需在pages.json中配置"enablePullDownRefresh":true)
				},
				// 上拉加载的常用配置
				upOption: {
					use: false, // 是否启用上拉加载; 默认true
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				},
				
				title:"金莱花通证",
				// 买卖记录
				dataList:{
					price:"1",
					balance:0,
					buylist:[],
					selllist:[]
				},
				
				
				
			}
		},
		onLoad: function (option) { 
			uni.showLoading()
			if(!this.hasLogin){
				uni.hideLoading()
				uni.navigateTo({
					url: '/pages/my/login/login'
				})
				return
			}
			this.getBusinessInfo()
		},
		onShow: function (option) {
			uni.showLoading()
			if(!this.hasLogin){
				uni.hideLoading()
				uni.navigateTo({
					url: '/pages/my/login/login'
				})
				return
			}
			this.getBusinessInfo()
		},
		methods: {
			handleClickRight(){
				uni.navigateTo({
					url:'/pages/business/webview/webview'
				})
			},
			
			// 获取详情
			getBusinessInfo(){
				let userid = decode(this.userInfo.data);
				this.$API.getBusinessInfo({userid}).then(res => {
					uni.hideLoading()
					console.log("金莱花通证详情",res)
					if(res.statusCode == 200){
						if(res.data.state == 0){
							this.dataList = res.data.data;
						}else{
							uni.showToast({
								title:"获取详情失败，请稍后刷新重新",
								icon:"none"
							})
						}
					}else{
						uni.showToast({
							title:"获取详情失败，请稍后刷新重新",
							icon:"none"
						})
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
			},
			
			toSecMarket(opt){
				if(opt=="buy"){
					uni.navigateTo({
						url:'/pages/otc/iWillBuy/iWillBuy'
					})
					return
				}
				uni.navigateTo({
					url:'/pages/otc/iWillSell/iWillSell'
				})
			},
			
			// 下拉刷新
			downCallback(){
				setTimeout(() => {
					this.mescroll.endSuccess()
				},2000)
			},
			
		}
	}
</script>

<style>
.business-title,
.business-price,
.business-list,
.business-trade-title{
	border-bottom: 1px solid #12224C;
}
.business-title{
	color: #fcc44d;
	font-size: 36rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-weight: 400;
}
.business-price{
	color: #24dca3;
	font-size: 40rpx;
	line-height: 2;
	height: 90rpx;
	line-height: 90rpx;
	font-weight: 600;
}
.business-list{
	display: flex;
	padding: 20rpx 0;
}
.business-list-left,
.business-list-right{
	flex: 1;
}
.business-list-left{
	padding-right: 10rpx;
}
.business-list-right{
	padding-left: 10rpx;
}
.business-list-left-title,
.business-list-right-title,
.business-list-info{
	display: flex;
}
.business-list-left-title view,
.business-list-right-title view,
.business-list-info view{
	flex: auto;
	line-height: 1.6;
}
.business-list-left-title view:nth-child(3),
.business-list-right-title view:nth-child(2),
.business-list-right-title view:nth-child(3),
.business-list-left .business-list-info view:nth-child(3),
.business-list-right .business-list-info view:nth-child(2),
.business-list-right .business-list-info view:nth-child(3){
	text-align: right;
}
.business-list-left .business-list-info view:nth-child(3){
	color: #24dca3;
}
.business-list-right .business-list-info view:nth-child(1){
	color: #ff3e3e;
}

.business-trade{
	display: flex;
	position: fixed;
	bottom: 0;
	left: 0;
	padding-bottom: 20rpx;
	width: 100%;
}
.business-trade>view{
	flex: 1;
}
.business-trade-left{
	padding-right: 10rpx;
}
.business-trade-right{
	padding-left: 10rpx;
}
.business-btn{
	border-radius: 15rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
}
.business-btn.business-btn-buy{
	background: #24dca3;
}
.business-btn.business-btn-sell{
	background: #ff3e3e;
}
</style>
