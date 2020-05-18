<template>
	<view>
		<auto-nav-bar leftShow @clickLeft="handleLeftClick" title="订单详情">
		</auto-nav-bar>

		<view class="main-box">
			<!-- type 0为买 1为卖 -->
			<view class="order-info-time" v-if="orderInfo.type == '0'">
				<!-- //orderInfo.orderstate状态 0-委托中 1-待付款 2-待收款 3-取消（大盘订单0,3）4-申诉中 5 - 已完成-->
				<view class="clearfix" v-if="orderInfo.exacid == parameter.userid">
					<image src="/static/jishi.png"></image>
					{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"请支付":orderInfo.orderstate == "2"?"等待卖家确认收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
				</view>
				<view class="clearfix" v-else>
					<image src="/static/jishi.png"></image>
					{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"等待买家付款":orderInfo.orderstate == "2"?"请确认收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
				</view>
				<view v-if="orderInfo.orderstate == '1'">买家请于{{shengyushichang|getDuration}}内付款并确认，否则将自动取消订单</view>
			</view>
			<view class="order-info-time" v-if="orderInfo.type == '1'">
				<!-- //orderInfo.orderstate状态 0-委托中 1-待付款 2-待收款 3-取消（大盘订单0,3）4-申诉中 5 - 已完成-->
				<view class="clearfix" v-if="orderInfo.exacid == parameter.userid">
					<image src="/static/jishi.png"></image>
					{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"等待买家付款":orderInfo.orderstate == "2"?"请确认收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
				</view>
				<view class="clearfix" v-else>
					<image src="/static/jishi.png"></image>
					{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"请支付":orderInfo.orderstate == "2"?"等待卖家确认收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
				</view>
				<view v-if="orderInfo.orderstate == '1'">买家请于{{shengyushichang|getDuration}}内付款并确认，否则将自动取消订单</view>
			</view>
			<!-- 订单金额 -->
			<view class="order-info-price" v-if="orderInfo.orderstate == '5'">
				<view class="zongjia">¥{{(orderInfo.copyquantity*orderInfo.price).toFixed(2)}}</view>
				<view class="danjia"><text>单价</text>¥{{orderInfo.price}}</view>
				<view class="shuliang"><text>数量</text>{{orderInfo.copyquantity}}JLH.MP</view>
				<view class="danjia"><text>订单号</text>{{orderInfo.ordernumber}}</view>
				<view class="danjia"><text>交易时间</text>{{orderInfo.sj.time | riqi}}</view>
			</view>
			<view class="order-info-price" v-else>
				<view class="zongjia">¥{{(orderInfo.quantity*orderInfo.price).toFixed(2)}}</view>
				<view class="danjia"><text>单价</text>¥{{orderInfo.price}}</view>
				<view class="shuliang"><text>数量</text>{{orderInfo.quantity}}JLH.MP</view>
				<view class="danjia"><text>订单号</text>{{orderInfo.ordernumber}}</view>
				<view class="danjia"><text>交易时间</text>{{orderInfo.sj.time|riqi}}</view>
			</view>
			<!-- 支付双方信息 -->
			<view class="order-info" v-if="orderInfo.orderstate == '1' || orderInfo.orderstate == '2' || orderInfo.orderstate == '5'">
				<view class="order-info-box first clearfix" v-if="orderInfo.orderstate == '5'">
					买家收款信息：
				</view>
				<view class="order-info-box first clearfix" v-else>
					请使用本人（<text class="name">{{userInfo.accountinfo.data.realname}}</text>）<text>{{items[current].name}}</text>向以下账号自行转账
				</view>
				<view class="order-info-box zhifutype clearfix" @click="getPopup">
					<view v-if="items[current].name == '微信'">
						<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>微信
					</view>
					<view v-else-if="items[current].name == '支付宝'">
						<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>支付宝
					</view>
					<view v-else>
						<image src="/static/pay/balancePay@3x.png" mode="aspectFill"></image>银行卡
					</view>
					<view></view>
					<view>
						<image src="/static/my/arrow@3x.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="order-info-box clearfix" @click="paste(items[current].realname)">
					<view>收款人</view>
					<view>{{items[current].realname}}</view>
					<view><image src="/static/copy.png" mode="aspectFill"></image></view>
				</view>
				<view class="order-info-box clearfix" v-if="items[current].bankopeningline" @click="paste(items[current].bankopeningline)">
					<view>卡号</view>
					<view>{{items[current].bankopeningline}}</view>
					<view><image src="/static/copy.png" mode="aspectFill"></image></view>
				</view>
				<view class="order-info-box clearfix" @click="previewImage('erweima')">
					<view>{{items[current].name !='银行卡'?items[current].name+'收款码':items[current].name+'照片'}}</view>
					<view></view>
					<view>
						<image src="/static/erweima.png" mode="aspectFill" style="width: 50rpx;height:50rpx;transform: translate(5rpx,10rpx);"></image>
					</view>
				</view>
				<view class="order-info-box clearfix" @click="paste(orderInfo.ordernumber)">
					<view>订单号</view>
					<view>{{orderInfo.ordernumber}}</view>
					<view><image src="/static/copy.png" mode="aspectFill"></image></view>
				</view>
				<view class="order-info-box clearfix" v-if="orderInfo.img" @click="previewImage('pingzheng')">
					<view>支付凭证</view>
					<view>点击查看买家支付凭证</view>
					<view><image src="/static/my/arrow@3x.png" mode="aspectFill"></image></view>
				</view>
				<view class="order-info-box clearfix" v-else @click="uploadImage">
					<view>支付凭证</view>
					<view>请上传支付凭证</view>
					<view><image src="/static/my/arrow@3x.png" mode="aspectFill"></image></view>
				</view>
			</view>

			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
			<view class="clear30"></view>
		</view>
		<view class="orderInfo-btn-box">
			<view class="orderInfo-btn-text">
				在转账过程中请勿备注货币、通证等信息，防止汇款被拦截、银行卡被冻结等问题
			</view>
			<!-- 0 买 1 卖 -->
			<view v-if="orderInfo.type == '0'">
				<view class="clearfix orderInfo-btn-btn" v-if="orderInfo.exacid == parameter.userid">
					<view class="quxiao" v-if="orderInfo.orderstate=='0'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='1'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='2'" @click="subAppeal">申诉</view>
					<!-- <view class="quxiao" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"取消订单":orderInfo.orderstate == "1"?"取消":orderInfo.orderstate == "2"?"申诉":""}}
					</view> -->
					<view class="success" v-if="orderInfo.orderstate == '0'">挂单中</view>
					<view class="success" v-else-if="orderInfo.orderstate == '1'" @click="c2ctransaction('confirm','确认付款')">确认付款</view>
					<view class="success" v-else-if="orderInfo.orderstate == '2'">等待卖家收款</view>
					<!-- <view class="success" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"确认付款":orderInfo.orderstate == "2"?"等待卖家收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
					</view> -->
				</view>
				<view class="clearfix orderInfo-btn-btn" v-else>
					<view class="quxiao" v-if="orderInfo.orderstate=='0'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='1'" @click="subAppeal">申诉</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='2'" @click="subAppeal">申诉</view>
					<!-- <view class="quxiao" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"取消订单":orderInfo.orderstate == "1"?"申诉":orderInfo.orderstate == "2"?"申诉":""}}
					</view> -->
					<view class="success" v-if="orderInfo.orderstate == '0'">挂单中</view>
					<view class="success" v-else-if="orderInfo.orderstate == '1'" >等待买家付款</view>
					<view class="success" v-else-if="orderInfo.orderstate == '2'" @click="c2ctransaction('confirm','确认收款')">确认收款</view>
					<!-- <view class="success" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"等待买家付款":orderInfo.orderstate == "2"?"确认收款":""}}
					</view> -->
				</view>
			</view>
			<view v-if="orderInfo.type == '1'">
				<view class="clearfix orderInfo-btn-btn" v-if="orderInfo.exacid == parameter.userid">
					<view class="quxiao" v-if="orderInfo.orderstate=='0'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='1'" @click="subAppeal">申诉</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='2'" @click="subAppeal">申诉</view>
					<!-- <view class="quxiao" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"取消订单":orderInfo.orderstate == "1"?"申诉":orderInfo.orderstate == "2"?"申诉":""}}
					</view> -->
					<view class="success" v-if="orderInfo.orderstate == '0'">挂单中</view>
					<view class="success" v-else-if="orderInfo.orderstate == '1'">等待买家付款</view>
					<view class="success" v-else-if="orderInfo.orderstate == '2'" @click="c2ctransaction('confirm','确认收款')">确认收款</view>
					<!-- <view class="success" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"等待买家付款":orderInfo.orderstate == "2"?"确认收款":""}}
					</view> -->
				</view>
				<view class="clearfix orderInfo-btn-btn" v-else>
					<view class="quxiao" v-if="orderInfo.orderstate=='0'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='1'" @click="c2ctransaction('cancel','取消订单')">取消订单</view>
					<view class="quxiao" v-else-if="orderInfo.orderstate=='2'" @click="subAppeal">申诉</view>
					<!-- <view class="quxiao" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"取消订单":orderInfo.orderstate == "1"?"取消":orderInfo.orderstate == "2"?"申诉":""}}
					</view> -->
					<view class="success" v-if="orderInfo.orderstate == '0'">挂单中</view>
					<view class="success" v-else-if="orderInfo.orderstate == '1'" @click="c2ctransaction('confirm','确认付款')">确认付款</view>
					<view class="success" v-else-if="orderInfo.orderstate == '2'" >等待卖家收款</view>
					<!-- <view class="success" v-if="orderInfo.orderstate == '0'||orderInfo.orderstate == '1'||orderInfo.orderstate == '2'">
						{{orderInfo.orderstate == "0"?"挂单中":orderInfo.orderstate == "1"?"确认付款":orderInfo.orderstate == "2"?"等待卖家收款":orderInfo.orderstate == "3"?"已取消":orderInfo.orderstate == "4"?"申诉中":orderInfo.orderstate == "5"?"已交易完成":""}}
					</view> -->
				</view>
			</view>

		</view>

		<!-- 更改支付方式 -->
		<uni-popup ref="payment" type="bottom">
			<view class="order_payment">
				<view class="order_payment_top">
					<text>支付方式</text>
					<view class="order_payment_cancel" @click="cancel">完成</view>
				</view>
				<view class="main-box pay-type-box">
					<radio-group @change="radioChange">
						<label class="clear" v-for="(item, index) in items" :key="item.realname">
							<image :src="item.name=='微信'?'/static/pay/wxPay@3x.png':item.name=='支付宝'?'/static/pay/aliPay@3x.png':'/static/pay/balancePay@3x.png'" mode="aspectFill"></image>
							<text>{{item.name}}</text>
							<radio color="#FFCC33" :value="item.name" :checked="index === current" />
						</label>
					</radio-group>
				</view>
			</view>
		</uni-popup>


	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		decode,
		encode
	} from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	let timer;
	let timert;

	export default {
		computed: mapState(['hasLogin', 'userInfo', 'firstTime']),
		components: {
			uniPopup
		},
		data() {
			return {
				// 记录当前订单id
				orderid: "",
				// 当前订单信息
				orderInfo: {
					bankno: "",
					bankrealname: "",
					banktdcodeurl: "",
					copyquantity: "",
					currencyicon: "",
					currencyprice: "",
					exacid: "",
					nickname: "",
					orderid: "",
					ordernumber: "",
					orderstate: "",
					ownericon: "",
					price: "",
					quantity: "",
					type: "", // 0为买 1为卖
					sj: "",
					wx: "",
					wxrealname: "",
					wxtdcodeurl: "",
					zfb: "",
					zfbrealname: "",
					zfbtdcodeurl: "",
					img:""
				},
				// 提交
				parameter: {
					userid: "",
					type: "", // 
					price: "0",
					quantity: "0",
					currid: "10",
					orderid: "0",
					tradpassword: "0", // 交易密码
					wxpay: "0",
					alipay: "0",
					bankpay: "0",
					phone: "",
					nickname: "",
					img:[]
				},

				// 剩余支付、确认时长
				shengyushichang: "", // 秒数

				// 选择的支付方式
				payType: "", // 0 微信 1 支付宝

				// 单选框支付方式
				items: [],
				current: 0,

				// 选中的支付方式
				zhifuInfo: {
					name: "",
					realname: "",
					tdcodeurl: "",
					bankopeningline: "" // 银行卡号
				}
			}
		},
		filters: {
			// 秒->分+秒
			getDuration: (value) => {
				var days = value / 60 / 60 / 24;
				var daysRound = Math.floor(days);
				var hours = value / 60 / 60 - (24 * daysRound);
				var hoursRound = Math.floor(hours);
				var minutes = value / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
				var minutesRound = Math.floor(minutes)
				var seconds = value - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
				var secondsRound = Math.floor(seconds);
				var time = minutesRound + ':' + secondsRound
				return time;
			},
			riqi: (value) => {
				let time = new Date(value);
				return time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()
			},
			
		},
		onLoad: function(option) {
			// console.log(option.slaveorderid)
			this.orderid = option.slaveorderid
			this.parameter.orderid = option.slaveorderid
			this.parameter.userid = decode(this.userInfo.data)
			this.parameter.phone = this.userInfo.accountinfo.data.phone
			this.parameter.nickname = this.userInfo.accountinfo.data.nickname
			this.getSlaveOrderDetail(this.orderid)
		},
		onShow:function(){
			if(this.orderInfo.orderstate == "1"){
				timert = setInterval(()=>{
					clearInterval(timer)
					this.items = []
					this.getSlaveOrderDetail(this.orderid)
				},15000)
			}
		},
		onUnload:function(){
			clearInterval(timer)
			clearInterval(timert)
		},
		onHide:function(){
			clearInterval(timer)
			clearInterval(timert)
		},
		methods: {
			handleLeftClick() {
				clearInterval(timer)
				clearInterval(timert)
				uni.navigateBack({
					delta:1
				})
			},
			
			// 提交申诉
			subAppeal(){
				uni.navigateTo({
					url:'/pages/otc/appeal/appeal?orderid=' + this.orderid
				})
			},

			// 取消或者确认
			c2ctransaction(opt,optText) {
				// opt confirm 确认 cancel 取消
				//orderInfo.orderstate状态 0-委托中 1-待付款 2-待收款 3-取消（大盘订单0,3）4-申诉中 5 - 已完成

				//parameter.type 2-买家已付款 点击已付款操作 3-卖家确认收款 点击确认收款操作 
				//  7-用户撤单(匹配中的订单)
				if (this.orderInfo.orderstate == "1") {
					if (opt == "cancel") {
						this.parameter.type = "7"
					} else {
						this.parameter.type = "2"
					}
				}
				if (this.orderInfo.orderstate == "2") {
					if (opt == "cancel") {
						this.parameter.type = "7"
					} else {
						this.parameter.type = "3"
					}
				}
				
				if(optText == '确认付款'){
					if(this.parameter.img.length=='0'){
						uni.showModal({
							content:"请上传支付凭证",
							showCancel:false,
						})
						return
					}
				}
				
				uni.showModal({
					content:"是否"+optText,
					success: (re) => {
						if(re.confirm){
							if(optText == '确认付款'){
								this.handleCollection()
							}else{
								this.handleC2cOperation()
							}
						}
					}
				})
			},
			
			// 其他的确认/取消操作（与确认收款区别）
			handleC2cOperation(){
				this.$API.c2ctransaction({ ...this.parameter
				}).then(res => {
					uni.hideLoading()
					// console.log(res)
					if (res.data.state == '0' || res.statusCode == '200') {
						uni.showModal({
							content: "提交成功",
							showCancel: false,
							success: () => {
								// 成功后刷新订单详情
								this.items = []
								this.getSlaveOrderDetail(this.orderid)
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
			},
			
			// 确认收款
			handleCollection(){
				let _this = this;
				console.log(this.parameter)
				uni.uploadFile({
					 // 需要上传的地址
					url: _this.$API.collection,
					 // filePath  需要上传的文件
					filePath: _this.parameter.img[0],
					name: 'img',
					formData:{
						userid:encode(_this.parameter.userid),
						type:encode(_this.parameter.type),
						price:encode(_this.parameter.price),
						quantity:encode(_this.parameter.quantity),
						currid:encode(_this.parameter.currid),
						orderid:encode(_this.parameter.orderid),
						tradpassword:encode(_this.parameter.tradpassword),
						wxpay:encode(_this.parameter.wxpay),
						alipay:encode(_this.parameter.alipay),
						bankpay:encode(_this.parameter.bankpay),
						phone:encode(_this.parameter.phone),
						nickname:encode(_this.parameter.nickname)
					},
					success:(res) => {
						console.log(res)
						let resData = JSON.parse(res.data)
						console.log(resData)
						
						if(res.statusCode != '200' || resData.state != '0'){
							uni.showModal({
								content:"提交失败，请稍后重试",
								showCancel:false
							})
							return
						}
						clearInterval(timer)
						clearInterval(timert)
						this.items = []
						this.getSlaveOrderDetail(this.orderid)
					},
					fail:()=>{
						uni.showModal({
							content:"提交失败,请重试",
							showCancel:false
						})
					}
				})
			},

			// 订单状态倒计时
			orderStateCountDown(){
				timer = setInterval(()=>{
					this.shengyushichang = Number(this.shengyushichang) - 1
					if(this.shengyushichang<0){
						clearInterval(timer)
						uni.showModal({
							content:"订单支付已超时",
							showCancel:false,
							success: () => {
								uni.navigateBack({
									delta:2
								})
							}
						})
					}
				},1000)
			},

			// OTC获取从单详情
			getSlaveOrderDetail(opt) {
				this.$API.getSlaveOrderDetail({
					orderid: opt
				}).then(res => {
					console.log("获取从单详情",res)
					if (res.data.state == "0") {
						this.orderInfo = res.data.data

						// 拿到数据后计算倒计时 、 判断是都已经完成或超时
						// 倒计时完成后 重新获取订单

						// 判断该订单状态 1-待付款 2-待收款
						if (res.data.data.orderstate == "1") {
							let t = res.data.data.sj.time + 900000
							let s = (new Date()).getTime() //当前时间戳
							this.shengyushichang = ((t - s) / 1000).toFixed(0)
							clearInterval(timer)
							clearInterval(timert)
							this.orderStateCountDown()
						}

						// 判断支付方式
						if (res.data.data.wxrealname) {
							let obj = {
								name: "微信",
								realname: res.data.data.wxrealname,
								tdcodeurl: res.data.data.wxtdcodeurl,
								bankopeningline: ''
							}
							this.zhifuInfo = obj
							this.items.push(obj)
						}
						if (res.data.data.zfbrealname) {
							let obj = {
								name: "支付宝",
								realname: res.data.data.zfbrealname,
								tdcodeurl: res.data.data.zfbtdcodeurl,
								bankopeningline: ''
							}
							this.zhifuInfo = obj
							this.items.push(obj)
						}
						if (res.data.data.bankrealname) {
							let obj = {
								name: "银行卡",
								realname: res.data.data.bankrealname,
								tdcodeurl: res.data.data.banktdcodeurl,
								bankopeningline: res.data.data.bankno
							}
							this.zhifuInfo = obj
							this.items.push(obj)
						}

					} else {
						uni.showModal({
							content: res.data.message,
							showCancel: false,
							success: () => {
								uni.navigateBack()
							}
						})
					}
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
			
			// 上传凭证
			uploadImage(){
				let _this = this
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
						console.log(_this.orderInfo,_this.parameter)
						_this.orderInfo.img = res.tempFilePaths[0]
						_this.parameter.img = res.tempFilePaths
				    }
				});
			},
			
			previewImage(opt) { //查看二维码或支付凭证截图
			console.log(opt)
				if(opt == 'pingzheng'){
					uni.previewImage({
					    urls: [this.orderInfo.img]
					});
				}else{
					uni.previewImage({
						urls: [this.items[this.current].tdcodeurl]
					});
				}
			},
			
			// 点击复制url
			paste(opt) {
				uni.setClipboardData({
					data: opt,
				});
			},

			// popup方法
			// 拉起popup
			getPopup(item) {
				this.$refs['payment'].open()
			},
			// 取消
			cancel(type) {
				this.$refs['payment'].close()
			},
			// 更改支付方式
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].name == evt.detail.value) {
						// console.log(this.items[i])
						this.current = i;
						this.zhifuInfo = this.items[i]
						return;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.order-info-time {
		margin-bottom: 30rpx;
		padding: 40rpx 20rpx 10rpx;

		view:nth-child(1) {
			font-size: 44rpx;
			font-weight: 600;
			margin-bottom: 10rpx;

			image {
				margin-right: 10rpx;
				float: left;
				width: 60rpx;
				height: 60rpx;
			}
		}

		view:nth-child(2) {
			font-size: 28rpx;
		}
	}

	.order-info-price {
		margin-bottom: 30rpx;
		padding: 20rpx;
		background: #091941;
		border-radius: 15rpx;

		.zongjia {
			white-space: .1em;
			color: #FCC44D;
			font-size: 44rpx;
			font-weight: 600;
			margin-bottom: 15rpx;
		}

		.danjia,
		.shuliang {
			font-size: 30rpx;

			text {
				margin-right: 20rpx;
				color: #999999;
			}
		}
	}


	.order-info {
		border-radius: 15rpx;
		overflow: hidden;
	}

	.order-info-box {
		border-bottom: 1px solid #12224C;
		background: #091941;
		padding: 20rpx;
		line-height: 60rpx;

		view:nth-child(1) {
			float: left;
			width: 6em;
			color: #999999;
			font-size: 28rpx;
		}

		view:nth-child(2) {
			float: left;
			width: calc(100% - 6em - 60rpx);
			font-size: 28rpx;
		}

		view:nth-child(3) {
			float: right;
			width: 60rpx;
			height: 60rpx;
		}

		image {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.order-info-box.first {
		font-size: 24rpx;

		.name {
			color: #FCC44D;
		}
	}

	.order-info-box:last-child {
		border-bottom: none;
	}

	.orderInfo-btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #081432;

		.orderInfo-btn-text {
			font-size: 28rpx;
			color: #FCC44D;
			padding: 20rpx 30rpx;
			background: #091941;
		}

		.orderInfo-btn-btn {
			padding: 20rpx 30rpx 30rpx;
			display: flex;

			view {
				border-radius: 15rpx;
				height: 88rpx;
				line-height: 88rpx;
				font-weight: 600;
				font-size: 32rpx;
			}

			.quxiao {
				width: 6em;
				background: #ccc;
				color: #333;
				text-align: center;
				margin-right: 20rpx;
			}

			.success {
				flex: 1;
				text-align: center;
				background: #FCC44D;
				color: #fff;
			}
		}
	}

	.order-info-box.zhifutype view:nth-child(1) {
		line-height: 66rpx;
		color: #fff;
	}

	.order-info-box.zhifutype view:nth-child(1) image {
		transform: translateY(10rpx);
		margin-right: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	/* 弹出层 */
	.order_payment {
		background: #091941;
		border-radius: 30rpx 30rpx 0 0;
	}

	.order_payment_top {
		border-bottom: 1rpx solid #12224C;
		font-size: 36rpx;
		text-align: center;
		position: relative;
		padding: 20rpx 0;
	}

	.order_payment_cancel {
		position: absolute;
		right: 30rpx;
		top: 20rpx;
		font-size: 32rpx;
		color: #007AFF;
	}

	.pay-type-box label {
		display: block;
		height: 80rpx;
		line-height: 80rpx;
		padding: 30rpx 0;
		position: relative;

		view {
			position: absolute;
			left: 0;
			top: 0;
			height: 140rpx;
			width: 100%;
			background: rgba(9, 25, 65, .8);
			z-index: 9999;
		}
	}

	.pay-type-box text {
		display: inline-block;
		height: 80rpx;
		line-height: 80rpx;
		float: left;
	}

	.pay-type-box image {
		display: inline-block;
		width: 80rpx;
		height: 80rpx;
		margin-right: 30rpx;
		float: left;
	}

	uni-checkbox .uni-checkbox-input {
		background-color: #091941;
		border: 1px solid #FCC44D;
		border-radius: 50%;
	}

	.pay-type-box radio {
		float: right;
	}
</style>
