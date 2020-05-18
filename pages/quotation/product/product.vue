<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
		>
			<view slot="title">{{dataInfo.cmc_name + '/' + dataInfo.cmc_code}}</view>
		</auto-nav-bar>
		
		<view class="">
			<view class="business-title main-box">{{dataInfo.cmc_name}}/{{dataInfo.cmc_code}}</view>
			
			<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" center aniType="extend"
				type="hang" sliderColor="#fcc44d" textColor="#fcc44d" selectColor="#fcc44d" ref="tabs2" class="tabs"
				:sliderMargin="20" 
				>
			</cl-tabs>
			
			<view class="clear15"></view>
			
			<swiper
				class="swiper" 
				:duration="300"
				@transition="transition"
				@change="changeCurrent" 
				:current="tabCurrentIndex"
				@animationfinish="animationfinish">
				
				<swiper-item>
					<view class="main-box">
						<!-- 买入 -->
						<view class="progressBarBox clearfix">
							<view class="progressBar">
								<view :style="{width:getwidth}"></view>
							</view>
							<view class="proportion">{{getwidth}}</view>
						</view>
						<view class="quantity">
							<view>
								<text>{{fromDataInfo.totalcirculation | numChange}}</text>
								<text>总发行量</text>
							</view>
							<view>
								<text>{{fromDataInfo.daycirculation | numChange}}</text>
								<text>今日总发行量</text>
							</view>
							<view>
								<text>{{fromDataInfo.sold | numChange}}</text>
								<text>今日已认购</text>
							</view>
							<view>
								<text>{{fromDataInfo.daySurplussell | numChange}}</text>
								<text>今日剩余发行</text>
							</view>
						</view>
						
						<view class="price">
							<view class="priceTitle">当前价格：{{fromDataInfo.price}}元</view>
						</view>
						
						<!-- <view class="business-trade-title"><text>买入</text></view> -->
						<view class="business-trade-box buy">
							<view></view>
							<view><input type="number" pattern="[0-9]*" v-model="purchaseQuantity" placeholder="买入数量" @change="toTrunc('purchaseQuantity')" /></view>
							<view>当前您可购买数为：{{fromDataInfo.availablenumber}}</view>
							<view class="btn business-btn" @click="shopCommit">我要买入</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="main-box">
						<!-- <view class="business-trade-title"><text>兑换</text></view> -->
						<!-- 兑换 -->
						<view class="business-trade-box exchange">
							<view class="clear15"></view>
							<view class="exchangeBtn">
								<view>{{exchangeData[1].cmc_name}}</view>
								<view class="exchangeBtnIcon" @click="exchangeBtn"><image src="/static/exchange.png" mode="aspectFill"></image></view>
								<view>{{exchangeData[0].cmc_name}}</view>
							</view>
							<view class="clear15"></view>
							<view><input type="number" pattern="[0-9]*" v-model="numberOfExchanges" @change="toTrunc('numberOfExchanges')" placeholder="请输入整数" /></view>
							<view>当前可兑换数：{{exchangeData[1].balance}}</view>
							<view class="btn business-btn" @click="exchangeCommit">我要兑换</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<passkeyborad ref="passwordBox" :show="show" @close="closePasskeyborad" @toParent="getPaymentPassword"></passkeyborad>
	</view>
</template>

<script>
	import passkeyborad from '@/components/yzc-paykeyboard/yzc-paykeyboard.vue'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	export default {
		computed: {
			...mapState([ 'hasLogin','userInfo']),
			getwidth(){
				let width = (this.fromDataInfo.sold/this.fromDataInfo.daycirculation).toFixed(4)*100+"%";	
				return width;
			}
		},
		components:{
			passkeyborad
		},
		data() {
			return {
				// 当前子票数据
				dataInfo:{},
				// 从接口获取的当前子票数据
				fromDataInfo:{
					"totalcirculation": 1,
					"sold": 1,
					"cmc_desc": "",
					"daycirculation": 1,
					"daySurplussell": 1,
					"price": 1,
					"cmc_code": "JLH",
					"cmc_name": "JLH.MP",
					"cmc_logo": "",
					"availablenumber": 0
				},
				// 兑换双方的数据
				exchangeData:[{
					balance: 0,
					cmc_code: "JLH",
					cmc_id: 10,
					cmc_name: "JLH.MP",
					cmc_price: 1.01,
					cmc_shrapnel: 0
				},{
					balance: 0,
					cmc_code: "JLH",
					cmc_id: 10,
					cmc_name: "JLH.MP",
					cmc_price: 1.01,
					cmc_shrapnel: 0
				}],
				// 是否设置交易密码
				existpass:false,
				
				// 兑换数量
				numberOfExchanges:"",
				// 买入数量
				purchaseQuantity:"",
				
				tabBars:['买入','兑换'],
				tabCurrentIndex:-1,
				sysWidth:0,
				source:'touch',
				fristTouch:false,
				
				// 支付密码框
				show:false,
				paymentPassword:""
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
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.dataInfo=JSON.parse(decodeURIComponent(option.item));
			this.sysWidth = uni.getSystemInfoSync().screenWidth;
			this.shop()
			this.exchange()
		},
		onShow:function(){
			// this.exchange()
		},
		mounted() {
			this.tabCurrentIndex = 0
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({
				    delta: getCurrentPages().length
				});
			},
			
			// 提交兑换
			exchangeCommit(){
				if(!this.existpass){
					uni.showModal({
						content:"请先设置交易密码！",
						confirmText:"去设置",
						success:(res) => {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/my/editTradePassword/editTradePassword'
								})
							}
						}
					})
					return
				}
				if(this.numberOfExchanges == ""){
					uni.showToast({
						title:"请输入兑换数量",
						icon:"none"
					})
					return
				}
				if(this.numberOfExchanges>this.exchangeData[1].balance){
					uni.showToast({
						title:"超出最大可兑换量",
						icon:"none"
					})
					return
				}
				this.show = !this.show
			},
			
			// 获取子票页面数据展示
			shop(){
				uni.showLoading()
				let _this = this
				this.$API.shop({userid:decode(_this.userInfo.data),communicid:_this.dataInfo.cmc_id}).then(res=>{
					// console.log("shop",res)
					uni.hideLoading()
					if(res.statusCode == 200){
						if(res.data.state == "1"){
							uni.showModal({
								content:res.data.message,
								showCancel:false,
								success: () => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}
						this.fromDataInfo = res.data.data
					}else{
						uni.showModal({
							content:"网络错误",
							showCancel:false,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}
					
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:"网络错误",
						icon:"none"
					})
					// error
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
			// 获取通证兑换页面数据展示
			exchange(){
				uni.showLoading()
				let _this = this
				this.$API.exchange({userid:decode(_this.userInfo.data),communicid:_this.dataInfo.cmc_id}).then(res=>{
					uni.hideLoading()
					if(res.statusCode == 200){
						if(res.data.state == "1"){
							uni.showModal({
								content:res.data.message,
								showCancel:false,
								success: () => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}
						_this.exchangeData = res.data.data.list
						_this.existpass = res.data.data.existpass
					}else{
						uni.showModal({
							content:"网络错误",
							showCancel:false,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}
					
				}).catch(err => {
					uni.hideLoading();
					// error
					this.emptyShow = true;
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},

			// 相互兑换
			exchangeBtn(){
				this.exchangeData[0] = this.exchangeData.splice(1,1,this.exchangeData[0])[0];
			},
			
			// 关闭密码框
			closePasskeyborad(opt){
				this.show = false;
			},
			
			// 拿到交易密码 并提交支付
			getPaymentPassword(opt){
				// console.log(opt)
				this.paymentPassword = opt;
				this.closePasskeyborad;
				setTimeout(()=>{
					this.toExchangeCommit();
				},300)
			},
			
			// 去兑换
			toExchangeCommit(){
				uni.showLoading()
				let _this = this;
				let userid = decode(this.userInfo.data);
				this.$API.exchangeCommit({
					userid,
					fromid:this.exchangeData[1].cmc_id,
					toid:this.exchangeData[0].cmc_id,
					num:this.numberOfExchanges,
					paypass:this.paymentPassword
				}).then(res => {
					// console.log("提交兑换",res)
					uni.hideLoading()
					if(res.statusCode == 200){
						uni.showModal({
							content:res.data.message,
							showCancel:false,
							success: () => {
								_this.numberOfExchanges = ""
								_this.exchange()
							}
						})
						// console.log(res.data)
					}else{
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
			
			// 去支付
			shopCommit(){
				if(this.purchaseQuantity == ""){
					uni.showModal({
						content:"请输入购买数量",
						showCancel:false
					})
					return
				}
				if(this.purchaseQuantity<2000 || this.purchaseQuantity%2000>0){
					uni.showModal({
						content:"请输入2000的倍数",
						showCancel:false
					})
					return
				}
				uni.showLoading()
				let userid = decode(this.userInfo.data);
				this.$API.shopCommit({userid,communicid:this.dataInfo.cmc_id,num:this.purchaseQuantity}).then(res => {
					// console.log(res)
					if(res.statusCode == 200){
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
						// console.log(reData)
						that.cancel()
						switch (reData.resultStatus) {
							case "9000":
								uni.showToast({
									title:"支付成功",
									icon:"none"
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
						console.log(err)
						that.cancel()
						uni.showToast({
							title:"支付失败",
							icon:"none"
						})
				        // console.log('fail:' + JSON.stringify(err));
				    }
				});
			},
			
			
			// 转为整数
			toTrunc(opt){
				if(opt == "numberOfExchanges"){
					this.numberOfExchanges = Math.trunc(this.numberOfExchanges)
				}else{
					this.purchaseQuantity = Math.trunc(this.purchaseQuantity)
				}
			},
			
			tabChange(e){
				this.tabCurrentIndex = e
			},
			changeCurrent(e){
				this.source = e.detail.source
			},
			transition(e){
				if(this.source==''){
					
				}else{
					if(this.fristTouch){
						this.$refs.tabs2.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
					}else{
						this.$refs.tabs2.move(e.detail.dx)
					}
				}
			},
			animationfinish(e){
				this.fristTouch = false
				this.source = 'touch'
				this.tabCurrentIndex = e.detail.current
			},
			
		}
	}
</script>

<style>
	uni-swiper{
		min-height: 800rpx;
	}
	.business-trade-title,
	.business-title{
		border-bottom: 1px solid #12224C;
	}
	.business-trade-title{
		height: 80rpx;
		line-height: 80rpx;
	}
	.business-trade-title text{
		display: inline-block;
		color: #fcc44d;
		font-size: 38rpx;
		font-weight: 400;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 2rpx solid #fcc44d;
	}
	.business-title{
		color: #fcc44d;
		font-size: 36rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-weight: 400;
	}
	
	.business-trade-box *{
		display: block;
		width: 100%;
	}
	.business-trade-box view{
		margin-bottom: 10rpx;
	}
	.business-trade-box input{
		display: block;
		box-sizing: border-box;
		border: 1rpx solid #535b70;
		height: 100rpx;
		line-height: 100rpx;
		padding: 0 15rpx;
	}
	.business-trade-box.buy>view:nth-child(3),
	.business-trade-box.exchange>view:nth-child(5),
	.business-trade-box.buy>view:nth-child(5){
		font-size: 28rpx;
		color: #a3a3a3;
		margin-bottom: 20rpx;
	}
	.business-btn{
		border-radius: 15rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}
	.exchangeBtn{
		display: flex;
		align-items:center;
		justify-content: space-between;
		text-align: center;
		border-bottom: 1px solid #12224C;
		padding-bottom: 20rpx;
		font-size: 40rpx;
	}
	.exchangeBtnIcon image{
		width: 70rpx;
		height: 70rpx;
		margin: 0 auto;
	}
	
	/* 与母票购买一致 */
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
		border-left: 1px solid #333;
	}
	.quantity view:nth-child(1)::before{
		border-left: none;
	}
	.priceTitle{
		border-bottom: 1rpx solid #12224C;
		padding: 10rpx 0 20rpx;
		margin-bottom: 20rpx;
	}
	
	
	
	

</style>
