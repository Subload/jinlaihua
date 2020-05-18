<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="我要买入"
		>
		</auto-nav-bar>	
		
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" style="min-height:calc(100vh - var(--status-bar-height) - 328rpx)">
				<view class="clear30"></view>
				
				<view  class="buylist" v-for="(item,index) in buyList" :key="index">
					<view class="clearfix list-top">
						<view class="list-top-img">
							<image :src="item.ownericon?item.ownericon:'/static/logo.png'" mode="aspectFill"></image>
							<text>{{item.nickname}}</text>
						</view>
						<!-- <view class="list-top-text">
							{{item.orderNum}}  |  {{item.percentage}}
						</view> -->
					</view>
					<view class="clearfix list-mod">
						<view class="list-mod-text">
							<view>数量  {{item.quantity}} JLH.MP</view>
							<view>限额  {{userInfo.accountinfo.data.min}}个  ~  {{item.quantity}}个</view>
						</view>
						<view class="list-mod-pri">
							<view>单价</view>
							<view>¥<text>{{item.price}}</text></view>
						</view>
					</view>
					<view class="clearfix list-bot">
						<view class="list-bot-img">
							<image src="/static/pay/aliPay@3x.png" v-if="item.zfbrealname" mode="aspectFill"></image>
							<image src="/static/pay/wxPay@3x.png" v-if="item.wxrealname" mode="aspectFill"></image>
							<image src="/static/pay/balancePay@3x.png" v-if="item.bankreal" mode="aspectFill"></image>
						</view>
						<view class="list-bot-btn" @click="getPopup(item)">购买</view>
					</view>
				</view>
			</mescroll-body>
			<view class="clear30"></view>
		</view>
		
		<!-- <view class="zhezhao_box" v-if="showzhezhao">
			<view class="zhezhao" @click="handleZhezhao"></view>
			<view class="zhezhao_info">
				<view class="clearfix" @click="handleIwillbuy('0')">
					<view><image src="/static/release.png" mode="aspectFill"></image></view>
					<view>挂单买入</view>
				</view>
				<view class="clearfix" @click="handleOrder">
					<view><image src="/static/order.png" mode="aspectFill"></image></view>
					<view>订单记录</view>
				</view>
			</view>
		</view> -->
		
		<view class="clear30"></view>
		<view class="clear30"></view>
		<view class="clear30"></view>
		<view class="clear30"></view>
		
		<view class="otc_btn">
			<view @click="handleIwillbuy('0')">挂单买入</view>
		</view>
		
		
		<uni-popup ref="payment" type="bottom" >
			<view class="order_payment">
				<view class="order_payment_top">
					<view class="order_payment_cancel" @click="cancel"><image src="/static/pay/close@3x.png" mode="aspectFill"></image></view>
					<text>购买JLH.MP</text>
				</view>
				<view class="main-box pay-type-box">
					<view class="buy-danjia">单价 <text>¥{{parameter.price}}</text></view>
					<!-- <view class="clearfix pay-type">
						<view :class="emptionType=='money'?'active':''" @click="changeEmptionType('money')">按金额购买</view>
						<view :class="emptionType=='num'?'active':''" @click="changeEmptionType('num')">按数量购买</view>
					</view> -->
					<view class="pay-type-input pay-type-money" v-if="emptionType=='money'">
						<input type="number" placeholder="请输入购买金额" />
					</view>
					<view class="pay-type-input pay-type-num" v-else>
						<input type="number" v-model="parameter.quantity" @change="toTrunc" placeholder="请输入购买数量" />
					</view>
					<view class="pay-type-quota">
						<view>限额：{{userInfo.accountinfo.data.min}}个  ~  {{checkedInfo.quantity}}个</view>
						<view>交易数量 {{parameter.quantity}} JLH.MP</view>
					</view>
					<view class="clearfix pay-type-Disbursements">
						<text>实付款：</text>
						<view>¥<text>{{(parameter.quantity*parameter.price).toFixed(2)}}</text></view>
					</view>
					<view class="clearfix pay-type-btn-box">
						<view class="pay-type-btn pay-type-btn-right" @click="placeOrder">下单</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<passkeyborad ref="passwordBox" :show="show" @close="closePasskeyborad" @toParent="getPaymentPassword"></passkeyborad>
		
	</view>
</template>

<script>
	import passkeyborad from '@/components/yzc-paykeyboard/yzc-paykeyboard.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {
		mapState,
	} from 'vuex';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		computed: mapState([ 'hasLogin','userInfo','firstTime']),
		components: {
			uniPopup,
			passkeyborad
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
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				buyList:[],
				// 列表点击的item
				checkedInfo:{},
				// 购买方式：金额/数量
				emptionType:"num",
				
				// 右上角遮罩显隐
				showzhezhao:false,
				
				// 提交购买
				parameter:{
					userid:"",
					type:"0", // 0-买入(已有卖单) 1-卖出(已有买单)
					price:"",
					quantity:"",
					currid:"10",
					orderid:"0",
					tradpassword:"", // 交易密码
					wxpay:"0",
					alipay:"0",
					bankpay:"0",
					phone:"",
					nickname:""
				},
				
				// 是否设置交易密码
				tradpassword:false,
				
				// 交易密码框
				show:false
				
			}
		},
		onLoad:function(){
			this.parameter.userid = decode(this.userInfo.data);
			this.parameter.phone = this.userInfo.accountinfo.data.phone
			this.parameter.nickname = this.userInfo.accountinfo.data.nickname
		},
		onShow:function(){
			if(this.userInfo.accountinfo.data.tradpassword == '1'){
				this.tradpassword = true
			}
			this.selllist()
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// handleRightClick(){
			// 	this.showzhezhao = true;
			// },
			
			// 转为整数
			toTrunc(){
				this.parameter.quantity = Math.trunc(this.parameter.quantity)
			},
			
			// // 点击遮罩层
			// handleZhezhao(){
			// 	this.showzhezhao = false;
			// },
			// // 点击我要出售/我要购买
			handleIwillbuy(opt){
				// this.handleZhezhao()
				uni.navigateTo({
					url:'/pages/otc/release/release?type=' + opt
				})
			},
			// // 点击订单记录
			// handleOrder(){
			// 	this.handleZhezhao()
			// 	uni.navigateTo({
			// 		url:'/pages/otc/order/order'
			// 	})
			// },
			
			// 拉起popup
			getPopup(item){
				this.checkedInfo = item;
				this.parameter.price = item.currencyprice
				this.parameter.quantity = item.quantity
				this.parameter.orderid = item.orderid
				this.$refs['payment'].open()
			},
			cancel(type) {
				this.$refs['payment'].close()
			},
			
			// 点击下单
			placeOrder(){
				if(!this.tradpassword){
					uni.showModal({
						content:"您还未设置交易密码，是否去设置",
						confirmText:"去设置",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/my/editTradePassword/editTradePassword'
								})
							}
						}
					})
					return
				}
				if(this.parameter.quantity==""){
					uni.showModal({
						content:"请输入购买数量",
						showCancel:false
					})
					return
				}
				if(this.parameter.quantity>this.checkedInfo.quantity){
					uni.showModal({
						content:"不得超出最大购买数量！",
						showCancel:false
					})
					return
				}if(this.parameter.quantity<this.userInfo.accountinfo.data.min){
					uni.showModal({
						content:"不得低于最小购买数量！",
						showCancel:false
					})
					return
				}
				
				// 隐藏popup
				this.cancel()
				// 显示密码框
				this.show = !this.show
			},
			
			
			// 输入交易密码后提交
			c2ctransaction(){
				uni.showLoading()
				this.$API.c2ctransaction(this.parameter).then(res=>{
					uni.hideLoading()
					// console.log(res)
					if(res.data.state==0){
						uni.showModal({
							content:"提交成功",
							showCancel:false,
							success: () => {
								// 成功后跳转订单详情
								uni.navigateTo({
									url:"/pages/otc/orderDetails/orderDetails?slaveorderid="+res.data.data.slaveorderid
								})
							}
						})
					}else{
						if(res.data.message=="10111"){
							uni.showModal({
								content:"交易密码错误",
								showCancel:false
							})
						}else if(res.data.message=="10170"){
							uni.showModal({
								content:"网络错误，请稍后重试",
								showCancel:false
							})
						}else{
							uni.showModal({
								content:res.data.message,
								showCancel:false
							})
						}
					}
					
				}).catch(err => {
					// error
					uni.hideLoading()
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错
				})
			},
			
			// 支付密码
			// 关闭密码框
			closePasskeyborad(opt){
				this.show = false;
			},
			// 拿到交易密码 并提交支付
			getPaymentPassword(opt){
				// console.log(opt)
				this.parameter.tradpassword = opt;
				this.closePasskeyborad;
				setTimeout(()=>{
					// 提交
					this.c2ctransaction();
				},300)
			},
			
			// 更改购买方式
			changeEmptionType(opt){
				this.emptionType = opt
			},
			
			// 获取列表数据
			selllist(opt){
				let pages = {page:0}
				if(opt){
					pages = {page:opt.options.up.page.num}
				}
				this.$API.selllist(pages).then(res=>{
					if(res.statusCode != "200" || res.data.state != '0'){
						uni.showModal({
							content:"加载失败，请稍后重试",
							showCancel:false,
							success: () => {
								uni.navigateBack()
							}
						})
						return
					}
					if(opt){
						this.buyList=this.buyList.concat(res.data.data);
						this.mescroll.endSuccess(this.buyList.length);
						//设置列表数据
					}else{
						this.buyList = res.data.data;
						setTimeout(()=>{
							this.mescroll.endSuccess()
						},1500)
					}
					
				}).catch(err => {
					this.mescroll.endErr()
					// error
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.upOption.page={
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 20 // 每页数据的数量,默认10
				}
				this.selllist()
			},
			// 上拉刷新
			upCallback(page) {
				this.selllist(page)
			},
			
			
			
		}
	}
</script>

<style>
.buylist{
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
	background: #24dca3;
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
	/* width: 345rpx; */
	width: 100%;
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
	/* margin-left: 20rpx; */
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
	transform: translateY(6rpx);
	width: 40rpx;
	height: 40rpx;
}
.zhezhao_info view view:nth-child(2){
	margin-left: 10rpx;
}

.otc_btn{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background: #081432;
	padding: 20rpx;
	box-sizing: border-box;
}
.otc_btn view{
	width: 100%;
	border-radius: 15rpx;
	background: #FCC44D;
	color: #fff;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
	font-weight: 600;
}
</style>
