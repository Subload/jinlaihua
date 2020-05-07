<template>
	<view>
		<auto-nav-bar
			leftShow
			title="金莱花通证"
			@clickLeft="handleClickLeft"
		>
		</auto-nav-bar>
		<!-- <web-view src="/hybrid/html/index.html"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function(){
			uni.showLoading({
				title:'加载中···',
			})
			setTimeout(()=>{
				uni.hideLoading()
				uni.showModal({
					content:"暂无K线数据",
					showCancel:false,
					success: () => {
						uni.navigateBack({
							delta:1
						})
					}
				})
			},5000)
		},
		onReady:function(){
			// #ifdef APP-PLUS
			// let wv = plus.webview.create("","custom-webview",{
			// 	plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
			// 	'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
			// 	top:uni.getSystemInfoSync().statusBarHeight+44 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
			// })
			// wv.loadURL("/hybrid/html/index.html")
			// var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			// currentWebview.append(wv);//一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			// setTimeout(function() {
			// 	console.log(wv.getStyle())
			// 	uni.hideLoading()
			// }, 1000);//如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
			// #endif
		},
		
		methods: {
			handleClickLeft(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	
</style>
