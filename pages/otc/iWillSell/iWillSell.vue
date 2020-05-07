<template>
	<view>
		<auto-nav-bar
			leftShow
			rightOrder
			@clickLeft="handleLeftClick"
			@clickRight="handleRightClick"
			title="我要卖"
		>
		</auto-nav-bar>	
		
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
			
				<view class="clear30"></view>
				<xw-empty :isShow="sellList.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty>
				
				<view class="selllist" v-for="(item,index) in sellList" :key="index">
					<view class="clearfix list-top">
						<view class="list-top-img">
							<image :src="item.icon?item.icon:'/static/logo.png'" mode="aspectFill"></image>
							<text>{{item.username}}</text>
						</view>
						<view class="list-top-text">
							{{item.orderNum}}  |  {{item.percentage}}
						</view>
					</view>
					<view class="clearfix list-mod">
						<view class="list-mod-text">
							<view>数量  {{item.num}}  JLH</view>
							<view>限额  ¥{{item.quota}}  -  ¥{{item.num*item.price}}</view>
						</view>
						<view class="list-mod-pri">
							<view>单价</view>
							<view>¥<text>{{item.price}}</text></view>
						</view>
					</view>
					<view class="clearfix list-bot">
						<view class="list-bot-img" v-if="item.paytype == 0">
							<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-img" v-else-if="item.paytype == 1">
							<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-img" v-else>
							<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>
							<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-btn">出售</view>
					</view>
				</view>
			</mescroll-body>
			<view class="clear30"></view>
		</view>
		
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		
		data() {
			return {
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
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				sellList:[
					{
						id:"0",
						icon:"", // 头像
						username:"", // 用户名
						price:"1.01", // 单价
						num:"5000", // 数量
						quota:"1000", // 限额
						paytype:"0", // 支付方式
						orderNum:"1234", // 单子数量
						percentage:"92%" // 百分比
					}
				]
			}
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			handleRightClick(){
				uni.navigateBack({});
			},
			
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				setTimeout(() => {
					this.mescroll.endSuccess()
				},5000)
			},
			// 上拉刷新
			upCallback(page) {
				setTimeout(() => {
					this.mescroll.endSuccess()
				},5000)
			},
			
		}
	}
</script>

<style>
.selllist{
	border-bottom: 1px solid #12224C;
	background: #091941;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 15rpx 15rpx 0 0;
}
.list-top,
.list-mod{
	margin-bottom: 10rpx;
}
.list-top-img{
	float: left;
}
.list-top-text{
	float: right;
	line-height: 60rpx;
	font-size: 28rpx;
	color: #b7b7b7;
}
.list-top-img image{
	width: 60rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: #263B6F;
	overflow: hidden;
}
.list-top-img text{
	float: right;
	margin-left: 10rpx;
	color: #fff;
	font-weight: 500;
	line-height: 60rpx;
	font-size: 32rpx;
}
.list-mod-text{
	float: left;
	font-size: 28rpx;
	line-height: 1.4;
}
.list-mod-pri{
	float: right;
	text-align: right;
	font-size: 28rpx;
	line-height: 1.2;
}
.list-mod-pri view:nth-child(2){
	font-size: 30rpx;
	font-weight: 600;
	color: #FCC44D;
}
.list-mod-pri view:nth-child(2) text{
	font-size: 40rpx;
	margin-left: 5rpx;
}
.list-bot-img{
	float: left;
	padding-top: 15rpx;
}
.list-bot-img image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
}
.list-bot-btn{
	float: right;
	background: #ff3e3e;
	height: 80rpx;
	width: 200rpx;
	line-height: 80rpx;
	border-radius: 10rpx;
	text-align: center;
}
</style>
