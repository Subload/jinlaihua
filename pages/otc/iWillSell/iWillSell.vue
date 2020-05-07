<template>
	<view>
		<auto-nav-bar
			leftShow
			rightOrder
			@clickLeft="handleLeftClick"
			@clickRight="handleRightClick"
			title="我要卖"
		>
		</auto-nav-bar>	
		
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
			
				<view class="clear30"></view>
				<xw-empty :isShow="sellList.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty>
				
				<view class="selllist" v-for="(item,index) in sellList" :key="index">
					<view class="clearfix list-top">
						<view class="list-top-img">
							<image :src="item.icon?item.icon:'/static/logo.png'" mode="aspectFill"></image>
							<text>{{item.username}}</text>
						</view>
						<view class="list-top-text">
							{{item.orderNum}}  |  {{item.percentage}}
						</view>
					</view>
					<view class="clearfix list-mod">
						<view class="list-mod-text">
							<view>数量  {{item.num}}  JLH</view>
							<view>限额  ¥{{item.quota}}  -  ¥{{item.num*item.price}}</view>
						</view>
						<view class="list-mod-pri">
							<view>单价</view>
							<view>¥<text>{{item.price}}</text></view>
						</view>
					</view>
					<view class="clearfix list-bot">
						<view class="list-bot-img" v-if="item.paytype == 0">
							<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-img" v-else-if="item.paytype == 1">
							<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-img" v-else>
							<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>
							<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>
						</view>
						<view class="list-bot-btn" @click="getPopup(item)">出售</view>
					</view>
				</view>
			</mescroll-body>
			<view class="clear30"></view>
		</view>
		
		<view class="zhezhao_box" v-if="showzhezhao">
			<view class="zhezhao" @click="handleZhezhao"></view>
			<view class="zhezhao_info">
				<view class="clearfix" @click="handleIwillbuy('buy')">
					<view><image src="/static/release.png" mode="aspectFill"></image></view>
					<view>我要购买</view>
				</view>
				<view class="clearfix" @click="handleOrder">
					<view><image src="/static/order.png" mode="aspectFill"></image></view>
					<view>订单记录</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="payment" type="bottom" >
			<view class="order_payment">
				<view class="order_payment_top">
					<view class="order_payment_cancel" @click="cancel"><image src="/static/pay/close@3x.png" mode="aspectFill"></image></view>
					<text>出售JLH</text>
				</view>
				<view class="main-box pay-type-box">
					<view class="buy-danjia">单价 <text>¥{{checkedInfo.price}}</text></view>
					<!-- <view class="clearfix pay-type">
						<view :class="emptionType=='money'?'active':''" @click="changeEmptionType('money')">按金额购买</view>
						<view :class="emptionType=='num'?'active':''" @click="changeEmptionType('num')">按数量购买</view>
					</view> -->
					<view class="pay-type-input pay-type-money" v-if="emptionType=='money'">
						<input type="number" placeholder="请输入购买金额" />
					</view>
					<view class="pay-type-input pay-type-num" v-else>
						<input type="number" placeholder="请输入购买数量" />
					</view>
					<view class="pay-type-quota">
						<view>限额：¥{{checkedInfo.quota}}  ~  ¥{{checkedInfo.num*checkedInfo.price}}</view>
						<view>交易数量 0.0000 JLH</view>
					</view>
					<view class="clearfix pay-type-Disbursements">
						<text>实付款</text>
						<view>¥<text>0.00</text></view>
					</view>
					<view class="clearfix pay-type-btn-box">
						<view class="pay-type-btn pay-type-btn-left">{{cancelOrderText}}</view>
						<view class="pay-type-btn pay-type-btn-right">下单</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	var timer;
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			uniPopup
		},
		data() {
			return {
				emptyShow:false,
				// mescroll: null, //mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的常用配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效(native: true, 则需在pages.json中配置"enablePullDownRefresh":true)
				},
				// 上拉加载的常用配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
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
				sellList:[
					{
						id:"0",
						icon:"", // 头像
						username:"", // 用户名
						price:"1.01", // 单价
						num:"5000", // 数量
						quota:"1000", // 限额
						paytype:"0", // 支付方式
						orderNum:"1234", // 单子数量
						percentage:"92%" // 百分比
					}
				],
				// 列表点击的item
				checkedInfo:{},
				// 购买方式：金额/数量
				emptionType:"num",
				// 60s后取消订单
				cancelOrderText:"60S后自动取消",
				
				// 右上角遮罩显隐
				showzhezhao:false
			}
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			handleRightClick(){
				this.showzhezhao = true;
				
			},
			// 点击遮罩层
			handleZhezhao(){
				this.showzhezhao = false;
			},
			// 点击我要出售/我要购买
			handleIwillbuy(opt){
				this.handleZhezhao()
				uni.navigateTo({
					url:'/pages/otc/release/release?title='+opt
				})
			},
			// 点击订单记录
			handleOrder(){
				this.handleZhezhao()
				uni.navigateTo({
					url:'/pages/otc/order/order'
				})
			},
			
			
			// 60s倒计时
			cancelOrder(){
				let num = 60
				this.cancelOrderText = num + "S后取消订单";
				timer = setInterval(()=>{
					this.cancelOrderText = num + "S后取消订单";
					num--;
					if(num == -1){
						clearInterval(timer)
						return
					}
				},1000)
			},
			
			
			// 拉起popup
			getPopup(item){
				this.checkedInfo = item;
				this.$refs['payment'].open()
				this.cancelOrder()
			},
			cancel(type) {
				this.$refs['payment'].close(timer)
				clearInterval(timer)
			},
			
			// 更改购买方式
			changeEmptionType(opt){
				this.emptionType = opt
			},
			
			
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				setTimeout(() => {
					this.mescroll.endSuccess()
				},5000)
			},
			// 上拉刷新
			upCallback(page) {
				setTimeout(() => {
					this.mescroll.endSuccess()
				},5000)
			},
			
		}
	}
</script>

<style>
.selllist{
	border-bottom: 1px solid #12224C;
	background: #091941;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 15rpx 15rpx 0 0;
}
.list-top,
.list-mod{
	margin-bottom: 10rpx;
}
.list-top-img{
	float: left;
}
.list-top-text{
	float: right;
	line-height: 60rpx;
	font-size: 28rpx;
	color: #b7b7b7;
}
.list-top-img image{
	width: 60rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: #263B6F;
	overflow: hidden;
}
.list-top-img text{
	float: right;
	margin-left: 10rpx;
	color: #fff;
	font-weight: 500;
	line-height: 60rpx;
	font-size: 32rpx;
}
.list-mod-text{
	float: left;
	font-size: 28rpx;
	line-height: 1.4;
}
.list-mod-pri{
	float: right;
	text-align: right;
	font-size: 28rpx;
	line-height: 1.2;
}
.list-mod-pri view:nth-child(2){
	font-size: 30rpx;
	font-weight: 600;
	color: #FCC44D;
}
.list-mod-pri view:nth-child(2) text{
	font-size: 40rpx;
	margin-left: 5rpx;
}
.list-bot-img{
	float: left;
	padding-top: 15rpx;
}
.list-bot-img image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
}
.list-bot-btn{
	float: right;
	background: #ff3e3e;
	height: 80rpx;
	width: 200rpx;
	line-height: 80rpx;
	border-radius: 10rpx;
	text-align: center;
}

/* 弹出层 */
.order_payment{
	background: #091941;
	border-radius: 30rpx 30rpx 0 0;
}
.order_payment_top{
	border-bottom: 1rpx solid #12224C;
	font-size: 36rpx;
	text-align: center;
	position: relative;
	padding: 20rpx 0;
}
.order_payment_cancel{
	position: absolute;
	left: 30rpx;
	top: 20rpx;
	width: 30rpx;
	height: 30rpx;
}
.order_payment_cancel image{
	width: 100%;
	height: 100%;
}

.buy-danjia{
	color: #fff;
	padding: 10rpx 0;
}
.buy-danjia text{
	color: #FCC44D;
	padding-left: 10rpx;
}
.pay-type{
	margin-bottom: 20rpx;
}
.pay-type view{
	float: left;
	padding: 10rpx 30rpx;
	font-size: 28rpx;
	border-bottom: 2px solid #12224C;
}
.pay-type view.active{
	color: #FCC44D;
	border-bottom: 2px solid #FCC44D;
}
.pay-type-input{
	margin-bottom: 20rpx;
}
.pay-type-input input{
	border: 1px solid #ccc;
	padding: 0 10rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 15rpx;
}
.pay-type-quota{
	line-height: 1.2;
}
.pay-type-quota view:nth-child(2){
	font-size: 24rpx;
	text-align: right;
}
.pay-type-Disbursements{
	line-height: 1.8;
}
.pay-type-Disbursements>text{
	float: left;
	font-size: 32rpx;
}
.pay-type-Disbursements view{
	float: right;
	color: #FCC44D;
	font-size: 32rpx;
	font-weight: 600;
}
.pay-type-Disbursements view text{
	font-size: 40rpx;
}

.pay-type-box{
	padding: 20rpx 20rpx 30rpx;
}
.pay-type-btn-box{
	display: flex;
}
.pay-type-btn{
	width: 345rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	border-radius: 15rpx;
}
.pay-type-btn-left{
	background: #808080;
}
.pay-type-btn-right{
	background: #24DCA3;
	margin-left: 20rpx;
}

/* 遮罩层 */
.zhezhao_box{
	position: fixed;
	left: 0;
	top: 0;
	z-index: 999999;
	height: 100vh;
	width: 100vw;
}
.zhezhao{
	background: rgba(0,0,0,0.5);
	height: 100%;
	width: 100%;
}
.zhezhao_info{
	position: absolute;
	right: 30rpx;
	top: calc(var(--status-bar-height) + 88rpx);
	background: #091941;
	padding: 0 40rpx 30rpx;
}
.zhezhao_info>view{
	padding: 30rpx 0 0;
}
.zhezhao_info view view{
	float: left;
	line-height: 50rpx;
}
.zhezhao_info image{
	width: 40rpx;
	height: 40rpx;
}
.zhezhao_info view view:nth-child(2){
	margin-left: 10rpx;
}


</style>
