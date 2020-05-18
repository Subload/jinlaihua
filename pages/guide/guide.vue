<template>
	<view class="guide">
		<image class="bg" src="/static/APP016.jpg" mode=""></image>
		<view :class="['logo',show?'active':'']">
			<image src="/static/logo.png" mode="widthFix"></image>
		</view>
		<view :class="['bgtext',show?'active':'']">
			<image src="/static/1.png" mode="widthFix"></image>
			<image src="/static/2.png" mode="widthFix"></image>
		</view>
		
		<view :class="['btn',show?'active':'']" @click="go">立即进入</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false
			}
		},
		onShow:function(){
		},
		onReady:function(){
			this.show = true
		},
		methods: {
			go(){
				setTimeout(()=>{
					uni.switchTab({
						url:"/pages/notice/notice"
					})
				},800)
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
	background-color: #100f31;
}
.guide .bg{
	width: 100vw;
	height: 100vh;
}
.guide>view{
	z-index: 99999;
	text-align: center;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
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
	bottom: 150rpx;
	height: 75rpx;
	line-height: 75rpx;
	padding: 0 45rpx;
	border-radius: 15rpx;
	font-size: 36rpx;
	font-weight: 600;
	opacity: 0;
}
.logo{
	width: 300rpx;
	height: 300rpx;
	top: 250rpx;
	opacity: 0;
}
.logo image{
	width: 100%;
	height: 100%;
}
.bgtext{
	top: 700rpx;
	width: 90%;
	overflow: hidden;
	opacity: 0;
}
.bgtext image{
	width: 100%;
}
.logo.active{
	animation: logo 1.5s ease-in-out forwards;
}
.bgtext.active{
	animation: bgtext 1.5s 0.7s ease-in-out forwards;
}
.btn.active{
	animation: btn 1.5s 1.5s ease-in-out forwards;
}


@keyframes logo{
	from{opacity: 0;top: 350rpx;}
	to{opacity: 1;top: 250rpx;}
}
@keyframes bgtext{
	from{opacity: 0;top: 1000rpx;}
	to{opacity: 1;top: 700rpx;}
}
@keyframes btn{
	from{opacity: 0;bottom: 0;}
	to{opacity: 1;bottom: 100rpx;}
}

</style>
