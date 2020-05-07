<template>
	<view class="guide">
		<image src="/static/APP016.jpg" mode=" center"></image>
		<view class="top" @click="go">{{time}}</view>
		<view class="btn" @click="go">立即进入</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time:'5'
			}
		},
		onShow:function(){
		},
		onReady:function(){
			var goTime = setInterval(()=>{
				this.time-=1;
				if(this.time == 1){
					clearInterval(goTime)
					this.time='✘'
				}
			},1000)
		},
		methods: {
			go(){
				setTimeout(()=>{
					uni.switchTab({
						url:"/pages/notice/notice"
					})
				},1000)
			}
		}
	}
</script>

<style>
.guide{
	width: 100%;
	height: 100vh;
	position: relative;
	overflow: hidden;
	transition: all 500ms;
}
.guide image{
	width: 100%;
	height: 100%;
}
.guide>view{
	z-index: 99999;
	text-align: center;
	position: absolute;
}
.top{
	top: 100rpx;
	right: 30rpx;
	border: 1px solid #FCC44D;
	color: #FCC44D;
	font-size: 30rpx;
	font-weight: 600;
	padding: 0 15rpx;
	border-radius: 20rpx;
}
.btn{
	position: absolute;
	left: 50%;
	bottom: 100rpx;
	transform: translateX(-50%);
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 40rpx;
	border-radius: 30rpx;
	font-size: 36rpx;
	font-weight: 600;
}
</style>
