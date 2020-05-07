<template>
	<view>
		<!-- 邀请 -->
		<auto-nav-bar
			leftShow
			title="我要邀请"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="clear30"></view>
		
		<view class="main-box">
			<view class="invite_box">
				<view>
					<view>
						<tki-qrcode v-if="ifShow" cid="qrcode" ref="qrcode" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground" :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
					</view>
				</view>
				<view class="invite_btn" @click="saveQrcode">保存二维码</view>
				<view>
					<view class="invite_url">{{val}}</view>
					<view class="invite_cope" @click="paste">复制地址</view>
				</view>
			</view>
			
			<view class="clear30"></view>
			
			<view class="invite_text">
				<text>投资金莱花<br/>让财富有另一种可能</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState(['userInfo']),
		components: {
			tkiQrcode
		},
		data() {
			return {
				ifShow: true,
				val: '', // 要生成的二维码值
				size: 150, // 二维码大小
				unit: 'px', // 单位
				background: '#fff', // 背景色
				foreground: '#000', // 前景色
				pdground: '#000', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '' // 二维码生成后的图片地址或base64
			}
		},
		onLoad:function(){
			uni.showLoading();
			this.getShareUrl();
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 获取邀请链接
			getShareUrl(){
				let userid = decode(this.userInfo.data)
				this.$API.getShareUrl({userid}).then(res => {
					console.log("邀请界面",res)
					this.val = res.data.data;
					this.icon = this.userInfo.icon || "/static/logo.png"
					this.creatQrcode()
					uni.hideLoading()
				}).catch(err => {
					// error
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			// 生成二维码
			creatQrcode() {
				this.$refs.qrcode._makeCode()
			},
			// 保存到图库
			saveQrcode() {
				this.$refs.qrcode._saveCode()
			},
			// 点击复制url
			paste() {
				uni.setClipboardData({
					data: this.val,
				});
			}
		}
	}
</script>

<style>
.invite_box{
	background: #091941;
	border-radius: 15rpx;
	text-align: center;
	padding: 120rpx 0 110rpx;
}
.invite_box>view:nth-child(1){
	width: 150px;
	height: 150px;
	margin: 0 auto 20rpx;
	background: #fff;
	position: relative;
	padding: 10px;
}
.invite_box image{
	/* padding-top: 10rpx;
	width: calc(100% - 10rpx);
	height: calc(100% - 10rpx); */
}
.invite_btn{
	width: 270rpx;
	display: block;
	margin: 20rpx auto;
	background: #263b6f;
	line-height: 2;
	border-radius: 10rpx;
}
.invite_url{
	font-size: 24rpx;
	width: 90%;
	white-space: pre-wrap;
	margin: 0 auto 15rpx;
}
.invite_cope{
	color: #fcc44d;
	font-size: 28rpx;
}
.invite_text{
	color: #999;
	font-size: 24rpx;
	line-height: 1.6;
	text-align: justify;
}

</style>
