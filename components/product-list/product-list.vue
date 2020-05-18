<template>
	<view :class="['pro-list-pro',price=='0'?'active':'']"  @tap="onHandleClick">
		<view class="pro-list-pro-pic">
			<image class="pro-list-pro-img" :src="picUrl" mode="aspectFill"></image>
		</view>
		<view class="pro-list-pro-title">{{title}}</view>
		<view class="pro-list-pro-price">{{price=='0'?'待上架':'¥'+price}}</view>
	</view>
</template>

<script>
	export default {
		name:"ProductList",
		props:{
			title:{
				type:String,
				default:""
			},
			picUrl:{
				type:String,
				default:""
			},
			price:{
				type:Number,
				default:""
			}
		},
		methods: {
			onHandleClick() {
				this.$emit("handleClick");
			}
		}
	}
</script>

<style scoped>
	.pro-list-pro{
		float: left;
		width: 330rpx;
		background: #091941;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.pro-list-pro.active{
		filter: grayscale(70%);
	}
	.pro-list-pro:nth-child(even){
		margin-left: 30rpx;
	}
	.pro-list-pro-pic{
		height: 330rpx;
		overflow: hidden;
	}
	.pro-list-pro-title{
		padding: 15rpx 15rpx 0 15rpx;
		font-size: 30rpx;
	}
	.pro-list-pro-price{
		padding: 0 15rpx;
		color: #ff3e3e;
		font-size: 30rpx;
		padding-bottom: 15rpx;
	}
	.pro-list-pro-img{
		width: 330rpx;
		height: 330rpx;
	}
</style>
