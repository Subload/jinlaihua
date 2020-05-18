<template>
	<view>
		<!-- 我的订单 -->
		<auto-nav-bar
			leftShow
			title="商品订单"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="clear30"></view>
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
				<view class="order-list clearfix" v-for="(orderItem, index) in orderData" :key="index">
					<view class="order-list-box clearfix">
						<view class="order-list-pic">
							<image :src="orderItem.icon?orderItem.icon:'/static/logo.png'" mode="aspectFit"></image>
						</view>
						<view class="order-list-info">
							<view class="order-list-name">{{orderItem.comditytitle}}</view>
							<view class="order-list-quantity">数量*{{orderItem.commditynum}}</view>
							<view class="order-list-price">¥ {{orderItem.danprice}}</view>
						</view>
						<view class="order-list-state" v-if="orderItem.paymentstate == 0||orderItem.paymentstate == 2">{{orderItem.paymentstatemessage}}</view>
						<view class="order-list-state" v-if="orderItem.paymentstate == 1">{{orderItem.fahuomessage}}</view>
					</view>
					<view class="order-list-title">订单号：{{ orderItem.ordernumber }}</view>
					<view class="order-list-title">下单时间：{{ orderItem.purchasedate.time | timeStamp}}</view>
				</view>
			</mescroll-body>
			<view class="clear30"></view>
		</view>
		
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState([ 'userInfo']),
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				orderData:[], // 数据
				emptyShow:false,
				
				// mescroll: null, //mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的常用配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效(native: true, 则需在pages.json中配置"enablePullDownRefresh":true)
				},
				// 上拉加载的常用配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
			}
		},
		filters: {
			timeStamp: function(value) { //具体到时分秒
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				// 返回
				return result;
			}
		},
		onLoad: function(){
			uni.showLoading();
			this.orderforGoodsAll();
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 下啦刷新
			downCallback(){
				this.upOption.page={
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				}
				this.orderforGoodsAll()
			},
			upCallback(page){
				this.orderforGoodsAll(page);
			},
			
			// 获取订单
			orderforGoodsAll(opt){
				let userid = decode(this.userInfo.data)
				let pages={userid,start:0,limit:10}
				if(opt){
					pages = {
						userid,
						start:opt.options.up.page.num*opt.options.up.page.size,
						limit:opt.options.up.page.size
					}
				}
				
				this.$API.orderforGoodsAll(pages).then(res => {
					// console.log("我的订单",res)
					uni.hideLoading();
					if(res.statusCode != '200' || res.data.state != '0'){
						uni.showToast({
						    title: "获取订单列表失败，请稍后重试",
							icon: 'none',
						});
						return
					}
					if(opt){
						this.orderData=this.orderData.concat(res.data.data);
						this.mescroll.endSuccess(this.orderData.length);
						//设置列表数据
					}else{
						this.orderData = res.data.data;
						setTimeout(()=>{
							this.mescroll.endSuccess()
						},1500)
					}
				}).catch(err => {
					// error
					uni.hideLoading();
					this.mescroll.endErr()
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			}
			
		}
	}
</script>

<style>
.order-list{
	background: #091941;
	border-radius: 15rpx;
	margin-bottom: 30rpx;
	padding: 20rpx;
}
.order-list-box{
	padding-bottom: 10rpx;
	border-bottom: 1px solid #12224C;
	margin-bottom: 20rpx;
}
.order-list-title{
	color: #A3A3A3;
	font-size: 26rpx;
	line-height: 1.4;
	
}
.order-list-pic{
	float: left;
	width: 160rpx;
	height: 160rpx;
}
.order-list-pic image{
	float: left;
	width: 100%;
	height: 100%;
}
.order-list-info{
	float: left;
	margin-left: 20rpx;
	line-height: 1.4;
	padding-top: 26rpx;
	width: 300rpx;
}
.order-list-name{
	font-size: 32rpx;
}
.order-list-quantity{
	font-size: 26rpx;
	color: #999;
}
.order-list-price{
	font-size: 26rpx;
	
}
.order-list-state{
	float: right;
	padding-top: 60rpx;
	color: #fcc44d;
}
</style>
