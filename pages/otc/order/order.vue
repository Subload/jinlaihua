<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="订单记录"
		>
		</auto-nav-bar>	
		
		<view class="container999">
			<view class='nav'>
				<navTab ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab>
			</view>
			<view class="clear30"></view>
			<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
			<mescroll-body style="min-height:auto;height: calc(100vh - 224rpx - var(--status-bar-height));" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
				<swiper style="height: calc(100vh - 224rpx - var(--status-bar-height));" :current="currentTab" @change="swiperTab">
					<swiper-item v-for="(listItem,listIndex) in list" :key="listIndex">
						<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower" scroll-with-animation >
								<view class='content'>
									<view class='card' v-for="(item,index) in listItem" v-if="listItem.length > 0" :key="index">
										<view class="card-sj clearfix">
											时间：{{item.sj}}
											<view class="card-btn" v-if="item.state">{{item.state == "0"?"挂单中":item.state == "1"?"待买家付款":item.state == "2"?"待卖家确认收款":item.state == "3"?"已撤销":item.state == "5"?"已完成":item.state == "4"?"申诉中":"未知状态"}}</view>
											<view class="card-btn" v-else>已完成</view>
										</view>
										<view class="clearfix card-info" @click="jumpTo(item)">
											<view class="card-info-left">
												<view><text>{{item.type=='0'?"买入":"出售"}}</text>{{item.symbol}}</view>
												<view v-if="item.ordernumber">订单号：{{item.ordernumber}}</view>
												<view v-if="item.buyer">
													<view v-if="item.buyer">买入：{{item.buyer}}</view>
													<view v-if="item.seller">卖出：{{item.seller}}</view>
												</view>
												<view v-else>
													<view v-if="item.type">{{item.type=='0'?"出售方":"买入方"}}：{{item.name}}</view>
												</view>
											</view>
											<view class="card-info-right">
												<view>¥<text>{{item.price?Number(item.price).toFixed(2):(item.cny/item.copyquantity).toFixed(2)}}</text></view>
												<view>X{{item.residuequantity?(item.residuequantity==item.copyquantity?item.copyquantity:item.residuequantity=='0.00'?item.quantity:item.residuequantity):(item.copyquantity?item.copyquantity:item.quantity)}}</view>
												<!-- <view class="card-info-total">总额：¥<text>{{item.cny?item.cny:item.tranprice?item.tranprice:(item.price*item.quantity).toFixed(2)}}</text></view> -->
												<view class="card-info-total">总额：¥<text>
												{{((item.price?Number(item.price).toFixed(2):(item.cny/item.copyquantity).toFixed(2))*(item.residuequantity?(item.residuequantity==item.copyquantity?item.copyquantity:item.residuequantity=='0.00'?item.quantity:item.residuequantity):(item.copyquantity?item.copyquantity:item.quantity))).toFixed(2)}}
												</text></view>
											</view>
										</view>
										<view class="card-btn-bot clearfix" v-if="item.state&&item.state=='0'">
											<view class="card-btn-btn" @click="cancelOrder(item.orderid)">撤销</view>
										</view>
									</view>
									<view class='noCard' v-if="listItem.length===0">
										暂无信息
									</view>
								</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import { throttle } from 'utils/util.js'
	import navTab from '@/components/navTab.vue';

// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {navTab},
	computed: mapState([ 'hasLogin','userInfo','firstTime']),
	data() {
		return {
			currentTab: 0, //sweiper所在页
			pages:[0,0,0,0,0], //第几页存储 
			tabTitle:['我的出售','我的购买','待处理','申诉中','历史成交'], //导航栏格式
			list: [
				[],
				[],
				[],
				[],
				[]
			] ,//数据格式
			
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
			// 提交
			parameter: {
				userid: "",
				type: "4", // 
				price: "0",
				quantity: "0",
				currid: "10",
				orderid: "0",
				tradpassword: "", // 交易密码
				wxpay: "0",
				alipay: "0",
				phone: "",
				nickname: ""
			},
		  };
	},
	onLoad:function(option){
		if(option.num){
			this.changeTab(2)
		}
		this.parameter.userid = decode(this.userInfo.data);
		this.parameter.phone = this.userInfo.accountinfo.data.phone
		this.parameter.nickname = this.userInfo.accountinfo.data.nickname
	},
	onShow:function(){
		uni.showLoading()
		this.getOrderRecord()
	},
	methods: {
		handleLeftClick(){
			uni.navigateBack()
		},
		changeTab(index){
			this.currentTab = index
		},
		
		/*下拉刷新的回调, 有三种处理方式:*/
		downCallback(){
			this.getOrderRecord()
		},
		
		// 点击跳转到详情或者主单列表
		jumpTo(item){
			if(item.master && item.master == '0'){
				uni.navigateTo({
					url:'/pages/otc/masterList/masterList?orderid=' + item.orderid
				})
			}else if(item.master && item.master == '1'){
				if(item.otherid){
					uni.navigateTo({
						url:'/pages/otc/orderDetails/orderDetails?slaveorderid=' + item.otherid
					})
				}else{
					uni.navigateTo({
						url:'/pages/otc/orderDetails/orderDetails?slaveorderid=' + item.orderid
					})
				}
				
			}else{
				uni.navigateTo({
					url:'/pages/otc/orderDetails/orderDetails?slaveorderid=' + item.otherid
				})
			}
		},
		
		// 取消订单
		cancelOrder(opt){
			let _this = this
			uni.showModal({
				content:"是否取消该挂单",
				confirmText:"是",
				cancelText:"否",
				success: (re) => {
					if(re.confirm){
						_this.parameter.orderid = opt
						_this.$API.c2ctransaction({ ..._this.parameter
						}).then(res => {
							uni.hideLoading()
							if (res.data.state == 0) {
								uni.showModal({
									content: "提交成功",
									showCancel: false,
									success: () => {
										_this.getOrderRecord()
									}
								})
							} else {
								if (res.data.message == "10111") {
									uni.showModal({
										content: "交易密码错误",
										showCancel: false
									})
								} else if (res.data.message == "10170") {
									uni.showModal({
										content: "网络错误，请稍后重试",
										showCancel: false
									})
								} else {
									uni.showModal({
										content: res.data.message,
										showCancel: false
									})
								}
							}
						
						}).catch(err => {
							// error
							uni.hideLoading()
							console.log(err)
							// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
							// 一个通用的错
						})
					}
				}
			})
		},
		
		// 初始化加载数据
		getOrderRecord(){
			const _this = this;
			let userid = decode(this.userInfo.data);
			// 我的出售
			_this.$API.getOrderRecord({userid,page:"0",type:"0"}).then(res=>{
				if(res.data.state == "0"&&res.statusCode == "200"){
					_this.list[0] = res.data.data
					_this.$forceUpdate() //二维数组，开启强制渲染
				}else{
					uni.showToast({
					    title: "网络错误，请稍后重试",
						icon: 'none',
					});
				}
				// resolve(newData)
			}).catch(err => {
				// error
				console.log(err)
				// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
				// 一个通用的错误提示组件就可以完成
			})
			_this.$API.getOrderRecord({userid,page:"0",type:"1"}).then(res=>{
				if(res.data.state == "0"&&res.statusCode == "200"){
					_this.list[1] = res.data.data
					_this.$forceUpdate() //二维数组，开启强制渲染
				}else{
					uni.showToast({
					    title: "网络错误，请稍后重试",
						icon: 'none',
					});
				}
				// resolve(newData)
			}).catch(err => {
				// error
				console.log(err)
				// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
				// 一个通用的错误提示组件就可以完成
			})
			_this.$API.getOrderRecord({userid,page:"0",type:"2"}).then(res=>{
				if(res.data.state == "0"&&res.statusCode == "200"){
					_this.list[2] = res.data.data
					_this.$forceUpdate() //二维数组，开启强制渲染
				}else{
					uni.showToast({
					    title: "网络错误，请稍后重试",
						icon: 'none',
					});
				}
				// resolve(newData)
			}).catch(err => {
				// error
				console.log(err)
				// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
				// 一个通用的错误提示组件就可以完成
			})
			_this.$API.getOrderRecord({userid,page:"0",type:"3"}).then(res=>{
				if(res.data.state == "0"&&res.statusCode == "200"){
					_this.list[3] = res.data.data
					_this.$forceUpdate() //二维数组，开启强制渲染
				}else{
					uni.showToast({
					    title: "网络错误，请稍后重试",
						icon: 'none',
					});
				}
				// resolve(newData)
			}).catch(err => {
				console.log(err)
				// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
				// 一个通用的错误提示组件就可以完成
			})
			_this.$API.getOrderRecord({userid,page:"0",type:"4"}).then(res=>{
				if(res.data.state == "0"&&res.statusCode == "200"){
					_this.list[4] = res.data.data
					_this.$forceUpdate() //二维数组，开启强制渲染
				}else{
					uni.showToast({
					    title: "网络错误，请稍后重试",
						icon: 'none',
					});
				}
				// resolve(newData)
			}).catch(err => {
				console.log(err)
				// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
				// 一个通用的错误提示组件就可以完成
			})
			
			_this.$forceUpdate() //二维数组，开启强制渲染
			uni.hideLoading()
			setTimeout(() => {
				this.mescroll.endSuccess()
			},1500)
		},
		
		// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
		isRequest(pages) {
			let userid = decode(this.userInfo.data);
			var that = this
			return new Promise((resolve, reject) => {
				that.$API.getOrderRecord({userid,page:that.pages[that.currentTab]+1,type:that.currentTab}).then(res=>{
					uni.hideLoading()
					resolve(res.data.data)
				}).catch(err => {
					// error
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				this.pages[this.currentTab]+=1
			})
		},
		// swiper 滑动
		swiperTab: function(e) {
			var index = e.detail.current //获取索引
			this.$refs.navTab.longClick(index);
		},
		// 加载更多 util.throttle为防抖函数
		lower: throttle(function(e) {
			console.log(`加载${this.currentTab}`)//currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数
			uni.showLoading({
				title: '加载中',
				mask:true
			})
			this.isRequest().then((res)=>{
				let tempList = this.list
				tempList[this.currentTab] = tempList[this.currentTab].concat(res)
				// console.log(tempList)
				this.list = tempList
				this.$forceUpdate() //二维数组，开启强制渲染
			})
		}, 300),
	}
};
</script>

<style lang="scss">
	uni-swiper{
		height: calc(100vh - 224rpx - var(--status-bar-height));
	}
	
	.container999 {
	  width: 100vw;
	  font-size: 28rpx;
	  box-sizing: border-box;
	  min-height: calc(100vh - 224rpx - var(--status-bar-height));
	  // overflow: hidden;
	  color: #6B8082;
	  position: relative;
	}
	.content {
		width: 100%;
	}
	
	.card {
		width: 90%;
		background-color: #091941;
		margin: 0 auto 42rpx auto;
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
		border-radius: 5px;
		position: relative;
		padding: 30rpx 0;
		
		.card-sj{
			border-bottom: 1px solid #12224C;
			padding: 0 20rpx 20rpx;
			color: #fff;
		}
		.card-info{
			padding: 20rpx;
			line-height: 1.6;
			border-bottom: 1px solid #12224C;
			
			.card-info-left{
				float: left;
				color: #fff;
				font-size: 32rpx;
				
				view:nth-child(2),
				view:nth-child(3){
					font-size: 24rpx;
				}
				text{
					color: #FCC44D;
					margin-right: 5rpx;
				}
			}
			.card-info-right{
				float: right;
				text-align: right;
				color: #fff;
				
				view:nth-child(1){
					font-size: 24rpx;
					text{
						margin-left: 10rpx;
						font-size: 32rpx;
					}
				}
				view:nth-child(2){
					font-size: 24rpx;
					color: #B7B7B7;
				}
				.card-info-total{
					font-size: 28rpx;
					text{
						margin-left: 5rpx;
						font-weight: 600;
						color: #FCC44D;
						font-size: 40rpx;
					}
				}
			}
		}
		
		
		.card-btn-bot{
			padding: 20rpx 20rpx 0;
			.card-btn-info{
				float: left;
				width: 50rpx;
				height: 30rpx;
				padding-top: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.card-btn-btn{
				float: right;
				border: 1rpx solid #A3A3A3;
				color: #A3A3A3;
				padding: 0 40rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
			}
		}
		.card-btn{
			float: right;
			border-radius: 15rpx;
			font-size: 24rpx;
			color: #FCC44D;
			border: 1px solid #FCC44D;
			padding: 0 20rpx;
		}
		
	}
	
	
	.noCard {
		width: 90%;
		height: 200rpx;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.10);
		border-radius: 10rpx;
	}
	
	
	.nav {
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 28rpx;
		z-index: 996;
	}
</style>
