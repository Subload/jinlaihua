<template>
	<view class="pro-list-box" @tap="onClickBtn">
		<view class="pro-list-thumb" v-if="thumb">
			<image class="pro-list-img" :src="thumb"></image>
		</view>
		<view class="pro-list-title" >{{title}}</view>
		<view class="pro-list-right">
			<image class="pro-list-img" src="/static/my/arrow@3x.png"></image>
		</view>
		<view class="pro-list-text">{{text}}</view>
	</view>
</template>

<script>
	export default {
		name:"ProjectList",
		props:{
			thumb:{
				type: String,
				default:''
			},
			title:{
				type: String,
				default:''
			},
			text:{
				type: String,
				default:''
			},
		},
		mounted(){
			// let _this=this;
			// _this.$nextTick(function(){
			// 	console.log(_this._props);
			// })
		},
		methods: {
			onClickBtn() {
				this.$emit("clickBtn");
			},
		}
	}
</script>

<style scoped>
	.pro-list-box{
		height: 90rpx;
		line-height: 90rpx;
		padding: 0 10rpx 0 15rpx;
		background: #091941;
		border-radius: 15rpx;
		margin-top: 30rpx;
	}
	.pro-list-thumb{
		display: block;
		float: left;
		width: 46rpx;
		height: 46rpx;
		margin-right: 15rpx;
		padding-top: 10rpx;
	}
	.pro-list-title{
		float: left;
		font-size: 32rpx;
		color: #fff;
	}
	.pro-list-right{
		float: right;
		width: 46rpx;
		height: 46rpx;
		padding-top: 10rpx;
	}
	.pro-list-img{
		width: 100%;
		height: 100%;
	}
	.pro-list-text{
		float: right;
		font-size: 28rpx;
		color: #999999;
	}
</style>
