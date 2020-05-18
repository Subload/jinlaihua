<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="购买金莱花"
		></auto-nav-bar>
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
		
			<view class="pic">
				<image src="/static/store/1@3x.png" mode="aspectFill"></image>
			</view>
			
			<view class="main-box">
				<view>
					<view class="title">{{shopData.cmc_name}}</view>
					<view class="progressBarBox clearfix">
						<view class="progressBar">
							<view :style="{width:getwidth}"></view>
						</view>
						<view class="proportion">{{getwidth}}</view>
					</view>
					<view class="quantity">
						<view>
							<text>{{shopData.totalcirculation | numChange}}</text>
							<text>总发行量</text>
						</view>
						<view>
							<text>{{shopData.daycirculation | numChange}}</text>
							<text>今日总发行量</text>
						</view>
						<view>
							<text>{{shopData.sold | numChange}}</text>
							<text>今日已认购</text>
						</view>
						<view>
							<text>{{shopData.daySurplussell | numChange}}</text>
							<text>今日剩余发行</text>
						</view>
					</view>
					
					<view class="price">
						<view class="priceTitle">当前价格：{{shopData.price}}元</view>
						<view class="priceInput">
							<input type="number" pattern="[0-9]*" v-model="quantity" @change="toTrunc" placeholder="购买量:请输入2000的倍数" />
						</view>
						<view class="priceTitle" style="color: #999;font-size: 24rpx;padding-top: 0;">您的最大可购买数量：{{shopData.availablenumber}}</view>
					</view>
					
					<!-- <view class="des">
						这里可以放一点描述
					</view> -->
					
				</view>
			</view>
		</mescroll-body>
		
		<view class="btn purchase" @click="purchase">买入</view>
		
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
		
	export default {
		mixins: [MescrollMixin], // 使用mixin
		computed:{
			...mapState([ 'hasLogin','userInfo']),
			// 长度
			getwidth(){
				let width = (this.shopData.sold*100/this.shopData.daycirculation).toFixed(1)+"%";	
				return width;
			}
		},
		data() {
			return {
				shopData:{
					"totalcirculation": 1,
					"sold": 1,
					"cmc_desc": "",
					"daycirculation": 1,
					"daySurplussell": 1,
					"price": 1,
					"cmc_code": "JLH",
					"cmc_name": "JLH.MP",
					"cmc_logo": "http://118.190.140.2/static/logo.png",
					"availablenumber": 0
				},
				quantity:"",
				
				// mescroll: null, //mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的常用配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效(native: true, 则需在pages.json中配置"enablePullDownRefresh":true)
				},
				// 上拉加载的常用配置
				upOption: {
					use: false, // 是否启用上拉加载; 默认true
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
			}
		},
		filters:{
			numChange: (value) => {
				var numb;
				if(value>9999){
					numb = (value/10000).toFixed(0)+'万'
				}else{
					numb = value
				}
				return numb
			}
		},
		onLoad:function(){
			uni.showLoading()
			this.shop();
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.switchTab({
				    url: "/pages/store/store"
				});
				return true; //阻止默认返回行为
			}
		},
		methods: {
			handleLeftClick(){
				uni.switchTab({
					url: "/pages/store/store"
				});
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				uni.showLoading()
				this.shop();
			},
			
			// 转为整数
			toTrunc(){
				this.quantity = (parseInt(Math.trunc(this.quantity)/2000)*2000).toFixed(0)
			},
			
			// 通证购买页面数据展示
			shop(){
				let userid = decode(this.userInfo.data);
				this.$API.shop({userid,communicid:10}).then((res) => {
					uni.hideLoading()
					if(res.statusCode != '200' || res.data.state != '0'){
						uni.showModal({
							content:res.data.message,
							showCancel:false,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
						return
					}
					this.shopData = res.data.data;
					setTimeout(() => {
						this.mescroll.endSuccess()
					},1500)
					
				}).catch(err => {
					// error
					uni.hideLoading();
					this.mescroll.endErr()
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
			// 点击买入按钮
			purchase(){
				if(this.shopData.availablenumber == 0){
					uni.showModal({
						content:"您当前可购买量为0",
						showCancel:false
					})
					return
				}
				if(this.quantity==""||this.quantity==0||this.quantity==null){
					uni.showModal({
						content:"请输入购买量",
						showCancel:false
					})
					return
				}
				if(this.quantity<2000||this.quantity%2000>0){
					uni.showModal({
						content:"购买量需大于2000，并为2000的倍数",
						showCancel:false
					})
					return
				}
				if(this.quantity>this.shopData.availablenumber){
					uni.showModal({
						content:"购买量已超出您的最大可购买量，请重新输入",
						showCancel:false
					})
					return
				}
				if(this.quantity>this.shopData.daySurplussell){
					uni.showModal({
						content:"今日剩余发行量不足，请重新输入",
						showCancel:false
					})
					return
				}
				uni.showModal({
					title:"提交支付",
					content:"将支付"+ this.quantity*this.shopData.price +"元",
					confirmText:"确定支付",
					success: (res) => {
						if (res.confirm) {
							this.shopCommit();
						}
					}
				})
			},
			// 去支付
			shopCommit(){
				uni.showLoading()
				let userid = decode(this.userInfo.data);
				this.$API.shopCommit({userid,communicid:10,num:this.quantity}).then(res => {
					// console.log(res)
					if(res.statusCode == 200){
						if(res.data.statestate == "1"){
							uni.showModal({
								content:res.data.message,
								showCancel:false
							})
							return
						}
						this.goAliPay(res.data.data);
					}else{
						uni.hideLoading()
						uni.showToast({
							title:"网络错误，请稍后重试",
							icon:"none"
						})
					}
				}).catch(err => {
					// error
					uni.hideLoading();
					uni.showToast({
					    title: err.text,
						icon: 'none',
					    duration: 2000
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			// 拉取支付宝
			goAliPay(data){
				let that = this;
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: data, //微信、支付宝订单数据
				    success: function (res) {
						// 返回主要信息
						let reData = res.rawdata;
						reData = JSON.parse(reData);
						uni.hideLoading()
						switch (reData.resultStatus) {
							case "9000":
								uni.showModal({
									content:"支付成功",
									showCancel:false,
									success:(re)=>{
										uni.switchTab({
											url: "/pages/store/store"
										});
									}
								})
								break;
							case "8000":
								uni.showToast({
									title:"正在处理中",
									icon:"none"
								})
								break;
							case "4000":
								uni.showToast({
									title:"订单支付失败",
									icon:"none"
								})
								break;
							case "5000":
								uni.showToast({
									title:"请勿重复支付",
									icon:"none"
								})
								break;
							case "6001":
								uni.showToast({
									title:"已取消支付",
									icon:"none"
								})
								break;
							case "6002":
								uni.showToast({
									title:"网络连接出错，支付失败，请稍后重试",
									icon:"none"
								})
								break;
							case "6004":
								uni.showToast({
									title:"支付结果未知",
									icon:"none"
								})
								break;
							default:
								uni.showToast({
									title:"支付失败",
									icon:"none"
								})
						}
						
				    },
				    fail: function (err) {
						// console.log(err)
						uni.hideLoading()
						uni.showToast({
							title:"支付失败",
							icon:"none"
						})
				        // console.log('fail:' + JSON.stringify(err));
				    }
				});
			},
		}
	}
</script>

<style>
	.pic image{
		width: 100%;
	}
	.pic{
		margin-bottom: 20rpx;
	}
.main-box{
	padding-left: 0;
	padding-right: 0;
}
.main-box>view{
	background: #091941;
	padding: 20rpx;
}
.title{
	margin-bottom: 10rpx;
	border-bottom: 1rpx solid #12224C;
	padding-bottom: 10rpx;
}
.purchase{
	position: fixed;
	bottom: 0;
	width: 100%;
}
.progressBar{
	float: left;
	width: 85%;
	height: 10rpx;
	border-radius: 5rpx;
	background: #ccc;
	transform: translateY(14rpx);
}
.progressBarBox{
	padding: 10rpx 0;
}
.progressBar view{
	height: 10rpx;
	border-radius: 5rpx;
	background: #fcc44d;
}
.proportion{
	float: right;
	width: 15%;
	text-align: right;
	line-height: 40rpx;
}
.quantity{
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #12224C;
	margin-bottom: 20rpx;
}
.quantity text{
	display: block;
}
.quantity view text:nth-child(1){
	font-size: 28rpx;
}
.quantity view text:nth-child(2){
	font-size: 24rpx;
	color: #999999;
}
.quantity view{
	position: relative;
	padding: 0 10rpx;
	text-align: center;
	flex: 1;
}
.quantity view::before{
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	height: 70%;
	border-left: 1rpx solid #999;
}
.quantity view:nth-child(1)::before{
		border-left: none;
	}
.priceTitle{
	border-bottom: 1rpx solid #12224C;
	padding: 10rpx 0 20rpx;
	margin-bottom: 20rpx;
}
.priceInput{
	margin-bottom: 10rpx;
}
.priceInput input{
	display: block;
	box-sizing: border-box;
	border-radius: 8rpx;
	padding: 0 20rpx;
	height: 80rpx;
	line-height: 80rpx;
	border: 1rpx solid #535b70;
}
</style>
