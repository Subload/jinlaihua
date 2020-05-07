<template>
	<view>
		<view class="status_bar" :style="{position:fixed}"> 
			<view class="top_view" :style="{backgroundColor:bgColor}">
				<view v-if="leftShow" class="goback" @tap="onClickLeft">
					<image class="back-list" src="/static/nav/back@3x.png" ></image>
				</view>
				<view class="title">
					{{title}}
					<slot name="title" />
				</view>
				<view v-if="rightText" class="menu" @tap="onClickRight">{{rightText}}</view>
				<view v-if="rightSearch" class="menu-icon" @tap="onClickRight">
					<image class="back-list" src="/static/nav/search@3x.png"></image>
				</view>
				<view v-if="rightBusiness" class="menu-icon" @tap="onClickRight">
					<image class="back-list" src="/static/nav/QuotationPress@3x.png"></image>
				</view>
				<view v-if="rightShare" class="menu-icon" @tap="onClickRight">
					<image class="back-list" src="/static/proDetails/share@3x.png"></image>
				</view>
				<view v-if="rightSet" class="menu-icon" @tap="onClickRight">
					<image class="back-list" src="/static/my/set@3x.png"></image>
				</view>
				<view v-if="rightOrder" class="menu-icon" @tap="onClickRight">
					<image class="back-list" src="/static/order.png"></image>
				</view>
			</view>  
		</view>  
		<mz-network-error fixed></mz-network-error>
	</view>
</template>

<script>
	export default {
		name: "AutoNavBar",
		props:{
			title: {
				type: String,
				default: ""
			},
			rightText: {
				type: String,
				default: ""
			},
			leftShow: {
				type: [Boolean, String],
				default: false
			},
			// 搜索
			rightSearch: {
				type: [Boolean, String],
				default: false
			},
			// 交易
			rightBusiness: {
				type: [Boolean, String],
				default: false
			},
			// 分享
			rightShare: {
				type: [Boolean, String],
				default: false
			},
			// 设置
			rightSet: {
				type: [Boolean, String],
				default: false
			},
			// 设置
			rightOrder: {
				type: [Boolean, String],
				default: false
			},
			// 背景颜色
			bgColor:{
				type: String,
				default:"#091941"
			},
			fixed:{
				type: String,
				default:"relative"
			}
		},
		// mounted() {
		//   if(uni.report && this.title !== '') {
		// 	  console.log(title)
		//       uni.report('title', this.title)
		//   }                             
		// },
		methods: {
			onClickLeft() {
				this.$emit("clickLeft");
			},
			onClickRight() {
				this.$emit("clickRight");
			}
		}
	}
</script>

<style scoped>
.status_bar {  
    padding-top: var(--status-bar-height);  
	height: 88rpx;
    width: 100%; 
	position: relative;
	z-index: 999;
}  
.top_view {  
	padding-top: var(--status-bar-height);
    height: 88rpx;  
    width: 100%;  
    position: fixed;  
    top: 0;  
    z-index: 999;  
} 
.back-list{
	width: 100%;
	height: 100%;
}
.title,
.goback,
.menu{
	line-height: 88rpx;
	font-size: 36rpx;
}
.title{
	text-align: center;
	max-width: 400rpx;
	margin: 0 auto;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.goback{
	position: absolute;
	left: 31rpx;
	bottom: 35rpx;
	width: 42rpx;
	height: 42rpx;
}
.menu{
	position: absolute;
	right: 31rpx;
	bottom: 0;
	font-size: 32rpx;
	line-height: 88rpx;
}
.menu-icon{
	position: absolute;
	right: 31rpx;
	bottom: 20rpx;
	width: 42rpx;
	height: 42rpx;
}
</style>
