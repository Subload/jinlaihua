<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="收款方式"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view>
			<view class="paymentMethod_list clearfix" v-for="(item, index) in paymentMethod" :key="index" @click="handleToSet(item)">
				<view class="paymentMethod_logo">
					<image :src="item.logo" mode="aspectFit"></image>
				</view>
				<text class="paymentMethod_name">{{item.name}}</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<text class="paymentMethod_set">
					<text v-if="item.name=='支付宝'">{{userInfo.accountinfo.data.payinfo.zfbrealname?"已设置":"未设置"}}</text>
					<text v-if="item.name=='微信'">{{userInfo.accountinfo.data.payinfo.wxrealname?"已设置":"未设置"}}</text>
					<text v-if="item.name=='银行卡'">{{userInfo.accountinfo.data.payinfo.bankrealname?"已设置":"未设置"}}</text>
				</text>
			</view>
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
				paymentMethod:[{
					uid:"0",
					name:"支付宝",
					logo:"/static/pay/aliPay@3x.png",
				},
				// {
				// 	uid:"1",
				// 	name:"微信",
				// 	logo:"/static/pay/wxPay@3x.png",
				// },
				{
					uid:"2",
					name:"银行卡",
					logo:"/static/pay/balancePay@3x.png",
				}]
			}
		},
		onLoad:function(){
			
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			handleToSet(item){
				if(item.state == 1) return;
				uni.navigateTo({
					url: "/pages/my/addPaymentMethod/addPaymentMethod?item=" + encodeURIComponent(JSON.stringify(item)),
				});
			}
		}
	}
</script>

<style>
.paymentMethod_list{
	border-bottom: 1px solid #12224C;
	padding: 20rpx 0 20rpx 30rpx;
	font-size: 32rpx;
	background: #091941;
}
.paymentMethod_list>*{
	float: left;
}
.paymentMethod_logo{
	margin-top: 10rpx;
	width: 60rpx;
	height: 60rpx;
}
.paymentMethod_logo image{
	width: 100%;
	height: 100%;
}
.paymentMethod_name,
.paymentMethod_set{
	line-height: 80rpx;
	margin: 0 15rpx;
}
.paymentMethod_set{
	float: right;
	color: #D89D1E;
	font-size: 28rpx;
}
.paymentMethod_right{
	float: right;
	margin-top: 15rpx;
	width: 60rpx;
	height: 60rpx;
}
.paymentMethod_right image{
	width: 100%;
	height: 100%;
}
</style>
