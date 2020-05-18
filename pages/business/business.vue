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
								<view>{{index+1}}</view>
								<view>{{buyItem.quantity}}</view>
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
								<view>{{sellItem.quantity}}</view>
								<view>{{index+1}}</view>
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
			</mescroll-body>
			
			<view class="business-trade clearfix" v-if="dataList.isopen && dataList.isopen=='1'">
				<view class="business-trade-box business-trade-left">
					<view class="business-btn-buy business-btn" @click="toSecMarket('buy')">买入</view>
				</view>
				<view class="business-trade-box business-trade-right">
					<view class="business-btn-sell business-btn" @click="toSecMarket('sell')">卖出</view>
				</view>
			</view>
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
	let timer;
	
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
				
				title:"JLH.MP",
				// 买卖记录
				dataList:{
					price:"1",
					balance:0,
					buylist:[],
					selllist:[],
					isopen:"0" // 是否开启otc
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
			// this.getBusinessInfo()
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
			timer = setInterval(()=>{
				this.getBusinessInfo()
			},10000)
		},
		onHide:function(){
			clearInterval(timer)
		},
		methods: {
			handleClickRight(){
				uni.navigateTo({
					url:'/pages/business/kline/kline'
				})
			},
			
			
			// 获取详情
			getBusinessInfo(){
				let userid = decode(this.userInfo.data);
				this.$API.getBusinessInfo({userid}).then(res => {
					uni.hideLoading()
					if(res.statusCode != '200' || res.data.state != '0'){
						uni.showToast({
							title:"加载失败，请稍后刷新重试",
							icon:"none"
						})
						return
					}
					this.dataList = res.data.data;
					setTimeout(()=>{
						this.mescroll.endSuccess()
					},1500)
				}).catch(err => {
					// error
					this.mescroll.endErr()
					console.log(err)
				})
			},
			
			toSecMarket(opt){
				if(this.userInfo.accountinfo.data.senior == '0'){
					uni.showModal({
						content:"您还未进行实名认证，请先实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/my/editRealName/editRealName'
								})
							}
						}
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == '1'){
					uni.showModal({
						content:"您实名认证审核中，请等待实名完成后操作",
						showCancel:false,
						confirmText:"确定",
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == '2'){
					uni.showModal({
						content:"您的实名认证审核失败，请重新实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/my/editRealName/editRealName'
								})
							}
						}
					})
					return
				}
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
				this.getBusinessInfo()
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
	left: 20rpx;
	padding-bottom: 20rpx;
	width: calc(100% - 40rpx);
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
