<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
		>
		<text slot="title">{{noticeDetails.cmc_title}}</text>
		</auto-nav-bar>	
		
		<view class="main-box">
			<view class="clear30"></view>
			<view class="notice-details">
				<view class="notice-details-title">{{noticeDetails.cmc_title}}</view>
				<view class="notice-details-time">{{noticeDetails.cmc_sj}}</view>
				<view class="notice-details-line"></view>
				<view class="notice-details-info" v-html="noticeDetails.contents">{{noticeDetails.contents}}</view>
			</view>
			<view class="clear30"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeDetails:{}
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			 this.noticeDetails=JSON.parse(decodeURIComponent(option.item));
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
		}
	}
</script>

<style>
	.notice-details{
		padding: 20rpx;
		background: #091941;
		border-radius: 15rpx;
	}
	.notice-details-title{
		font-size: 36rpx;
		margin-bottom: 10rpx;
	}
	.notice-details-time{
		font-size: 28rpx;
		color: #999;
	}
	.notice-details-info{
		font-size: 32rpx;
		line-height: 2;
	}
	.notice-details-line{
		border-bottom: 1px solid #12224c;
		margin: 15rpx 0;
	}
</style>
