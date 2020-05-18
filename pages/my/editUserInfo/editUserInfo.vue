<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="个人中心"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view>
			<view class="paymentMethod_list clearfix" @click="editPortrait">
				<text class="paymentMethod_name" style="line-height: 100rpx;">头像</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set icon">
					<image :src="userInfo.accountinfo.data.icon?userInfo.accountinfo.data.icon:'/static/logo.png'"  mode="aspectFill"></image>
				</view>
			</view>
			<view class="paymentMethod_list clearfix" @click="editNickName">
				<text class="paymentMethod_name">昵称</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">{{userInfo.accountinfo.data.nickname}}</view>
			</view>
			<view class="paymentMethod_list clearfix">
				<text class="paymentMethod_name">手机号</text>
				<view class="paymentMethod_set" style="margin-right: 50rpx;">{{userInfo.accountinfo.data.phone}}</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				
			}
		},
		onLoad:function(){
			
		},
		methods: {
			...mapMutations(['login']),
			
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 修改头像
			editPortrait(){
				uni.navigateTo({
					url: '/pages/my/editPortrait/editPortrait'
				});
			},
			// 修改昵称
			editNickName(){
				uni.navigateTo({
					url: '/pages/my/editNickName/editNickName'
				});
			},
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
.paymentMethod_name,
.paymentMethod_set{
	line-height: 80rpx;
	margin: 0 15rpx;
}
.paymentMethod_set{
	float: right;
	color: #ccc;
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
.paymentMethod_set.icon{
	width: 100rpx;
	height: 100rpx;
	overflow: hidden;
	border-radius: 20rpx;
	background: #2C405A;
}
.paymentMethod_set.icon image{
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}
</style>
