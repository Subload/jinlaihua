<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="发布需求"
		>
		</auto-nav-bar>
		
		<view class="clear30"></view>
		<view class="main-box">
			<view class="aLine clearfix">
				<view>发布类型</view>
				<view>
					<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
						<view class="uni-input">{{array[index].name}}</view>
					</picker>
				</view>
				<view><image src="/static/my/arrow@3x.png" mode="aspectFill"></image></view>
			</view>
			<view class="aLine clearfix">
				<view>需求种类</view>
				<view>JLH.MP</view>
			</view>
			<view class="aLine clearfix" @click="parameter.price = zhidaojia">
				<view>指导价</view>
				<view>{{zhidaojia}}</view>
			</view>
			<view v-if="index == 0">
				<view class="aLine clearfix">
					<view>买入价格</view>
					<view>
						<text>¥</text><input type="number" v-model="parameter.price"  @change="toTrunc('price')" placeholder="请输入您想买入的价格" />
					</view>
				</view>
				<view class="aLine clearfix">
					<view>买入数量</view>
					<view>
						<input type="number" v-model="parameter.quantity" @change="toTrunc('quantity')" placeholder="请输入您想买入的数量" />
					</view>
					<view>JLH.MP</view>
				</view>
			</view>
			<view v-else>
				<view class="aLine clearfix">
					<view>出售价格</view>
					<view>
						<text>¥</text><input type="number" v-model="parameter.price" @change="toTrunc('price')" placeholder="请输入您想出售的价格" />
					</view>
				</view>
				<view class="aLine clearfix">
					<view>出售数量</view>
					<view>
						<input type="number" v-model="parameter.quantity" @change="toTrunc('quantity')" placeholder="请输入您想出售的数量" />
					</view>
					<view>JLH.MP</view>
				</view>
				<view class="aLine clearfix" @click="parameter.quantity = (yeNum-userInfo.accountinfo.data.sxfprice>0?yeNum-userInfo.accountinfo.data.sxfprice:0)">
					<view>最大出售量</view>
					<view>{{yeNum-userInfo.accountinfo.data.sxfprice>0?yeNum-userInfo.accountinfo.data.sxfprice:0}}</view>
					<view>JLH.MP</view>
				</view>
			</view>
			<view class="clear15"></view>
			<view class="aLine clearfix" @click="getPopup">
				<view>{{index?'收款':'支付'}}方式</view>
				<view>
					<image v-if="parameter.alipay != '0'" src="/static/pay/aliPay@3x.png"></image>
					<image v-if="parameter.wxpay != '0'" src="/static/pay/wxPay@3x.png"></image>
					<image v-if="parameter.bankpay != '0'" src="/static/pay/balancePay@3x.png"></image>
					<text>   </text>
				</view>
				<view><image src="/static/my/arrow@3x.png" mode="aspectFill"></image></view>
			</view>
		</view>
		<view class="clear30"></view>
		<view class="release-tips">
			<view>温馨提示</view>
			<view>
				1.发布需求需要实名认证才可以发布。<br/>
				2.发布需求MP不能低于{{this.userInfo.accountinfo.data.min}}JLH.MP。<br/>
			</view>
		</view>
		
		<view class="clear30"></view>
		<view class="clear30"></view>
		<view class="btn release-btn" @click="releaseReq">发布需求</view>
		
		<uni-popup ref="payment" type="bottom" >
			<view class="order_payment">
				<view class="order_payment_top">
					<!-- <view class="order_payment_cancel" @click="cancel"><image src="/static/pay/close@3x.png" mode="aspectFill"></image></view> -->
					<text>{{index?'收款':'支付'}}方式</text>
					<view class="order_payment_cancel" @click="cancel">完成</view>
				</view>
				<view class="main-box pay-type-box">
					<checkbox-group  @change="checkboxChange">
						<label class="clearfix" >
							<view v-if="checkedDisabled.alipay">请先至‘我的->收款方式’添加</view>
							<image src="/static/pay/aliPay@3x.png" mode="aspectFill"></image>
							<text>支付宝</text>
							<checkbox value="2" color="#FFCC33" :checked="parameter.alipay != '0'?true:false" :disabled="checkedDisabled.alipay" />
						</label>
						<label class="clearfix">
							<!-- <view v-if="checkedDisabled.wxpay"></view> -->
							<view>暂无该方式</view>
							<image src="/static/pay/wxPay@3x.png" mode="aspectFill"></image>
							<text>微信</text>
							<checkbox value="1" color="#FFCC33" :checked="parameter.wxpay != '0'?true:false" :disabled="checkedDisabled.wxpay" />
						</label>
						<label class="clearfix">
							<view v-if="checkedDisabled.bankpay">请先至‘我的->收款方式’添加</view>
							<image src="/static/pay/balancePay@3x.png" mode="aspectFill"></image>
							<text>银行卡</text>
							<checkbox value="3" color="#FFCC33" :checked="parameter.bankpay != '0'?true:false" :disabled="checkedDisabled.bankpay" />
						</label>
					</checkbox-group>
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
	import {
		mapState,
	} from 'vuex';
	export default {
		computed: mapState([ 'hasLogin','userInfo','firstTime']),
		components:{uniPopup,passkeyborad},
		data() {
			return {
				index: 0,
				array: [{name:'我要买入'},{name: '我要出售'}],
				parameter:{
					userid:"",
					type:"5", // 5-当前用户挂买单 6-当前用户挂卖单 
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
				// 可用数量
				yeNum:"",
				// 指导价
				zhidaojia:"",
				// 是否禁用
				checkedDisabled:{
					wxpay:true,
					alipay:true,
					bankpay:true
				},
				// 交易密码框
				show:false,
				// 是否设置交易密码
				tradpassword:false
			}
		},
		onLoad:function(option){
			this.index = Number(option.type);
			if(option.type=='1'){
				this.parameter.type = "6"
			}
			this.parameter.userid = decode(this.userInfo.data);
			this.parameter.phone = this.userInfo.accountinfo.data.phone
			this.parameter.nickname = this.userInfo.accountinfo.data.nickname
		},
		onShow:function(){
			// if(this.userInfo.accountinfo.data.payinfo.wxrealname){
			// 	this.parameter.wxpay = "1"
			// 	this.checkedDisabled.wxpay = false
			// }
			if(this.userInfo.accountinfo.data.payinfo.zfbrealname){
				this.parameter.alipay = "2"
				this.checkedDisabled.alipay = false
			}
			if(this.userInfo.accountinfo.data.payinfo.bankrealname){
				this.parameter.bankpay = "3"
				this.checkedDisabled.bankpay = false
			}
			if(this.userInfo.accountinfo.data.tradpassword == '1'){
				this.tradpassword = true
			}
			this.getcommunicassetsList()
			this.getBusinessInfo()
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({
					delta:1
				})
			},
			
			// 提交
			releaseReq(){
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
				
				if(this.parameter.type=='5'){
					// console.log("买入")
					if(this.parameter.wxpay=='0'&&this.parameter.alipay=='0'&&this.parameter.bankpay=='0'){
						uni.showModal({
							content:"请先设置相应支付方式",
							showCancel:false,
							confirmText:"去设置",
							success: () => {
								uni.navigateTo({
									url:"/pages/my/paymentMethod/paymentMethod"
								})
							}
						})
						return
					}
					if(this.parameter.price==''){
						uni.showModal({
							content:"请输入买入价格",
							showCancel:false
						})
						return
					}
					if(this.parameter.quantity==''){
						uni.showModal({
							content:"请输入买入数量",
							showCancel:false
						})
						return
					}
					
					this.show = !this.show
					
				}else{
					if(this.parameter.wxpay=='0'&&this.parameter.alipay=='0'&&this.parameter.bankpay=='0'){
						uni.showModal({
							content:"请先设置相应收款方式",
							showCancel:false,
							confirmText:"去设置",
							success: () => {
								uni.navigateTo({
									url:"/pages/my/paymentMethod/paymentMethod"
								})
							}
						})
						return
					}
					if(this.parameter.price==''){
						uni.showModal({
							content:"请输入出售价格",
							showCancel:false
						})
						return
					}
					if(this.parameter.quantity==''){
						uni.showModal({
							content:"请输入出售数量",
							showCancel:false
						})
						return
					}
					if(this.parameter.quantity>this.yeNum-this.userInfo.accountinfo.data.sxfprice){
						uni.showModal({
							content: "最大出售量为"+(this.yeNum-this.userInfo.accountinfo.data.sxfprice>0?this.yeNum-this.userInfo.accountinfo.data.sxfprice:'0'),
							showCancel:false
						})
						return
					}
					uni.showModal({
						content:"每笔交易将从账户余额扣除手续费"+ this.userInfo.accountinfo.data.sxfprice +"JLH.MP",
						confirmText:"我已知晓",
						success:(res) => {
							if(res.confirm){
								this.show = !this.show
							}
						}
					})
				}
				
			},
			
			// 输入交易密码后提交
			c2ctransaction(){
				uni.showLoading()
				this.$API.c2ctransaction({...this.parameter}).then(res=>{
					uni.hideLoading()
					// console.log(res)
					if(res.data.state=='0'){
						uni.showModal({
							content:"提交成功",
							showCancel:false,
							success: () => {
								uni.navigateBack()
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
			
			// 转为整数
			toTrunc(opt){
				if(opt=='quantity'){
					this.parameter.quantity = Math.trunc(this.parameter.quantity)
				}else{
					this.parameter.price = Number(this.parameter.price).toFixed(2)
				}
			},
			
			// 更改需求
			bindPickerChange(e) {
				// console.log('picker发送选择改变，携带值为：' + e.detail.value)
				this.index = e.detail.value
				if(e.detail.value=="0"){
					this.parameter.type = "5"
				}else{
					this.parameter.type = "6"
				}
				// console.log(this.parameter)
			},
			
			// 获取母票详情
			getcommunicassetsList(){
				this.$API.getcommunicassetsList({userid:this.parameter.userid,start:0,limit:1}).then(res => {
					// console.log(res)
					if(res.statusCode == 200){
						this.yeNum = res.data.data[0].ye;
						this.yeNum = res.data.data[0].ye;
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
			
			// 获取金莱花价格详情
			getBusinessInfo(){
				let userid = decode(this.userInfo.data);
				this.$API.getBusinessInfo({userid}).then(res => {
					if(res.statusCode == 200){
						if(res.data.state == 0){
							this.zhidaojia = res.data.data.price;
						}else{
							uni.showToast({
								title:"网络错误，请稍后刷新重新",
								icon:"none"
							})
						}
					}else{
						uni.showToast({
							title:"网络错误，请稍后刷新重新",
							icon:"none"
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
			
			// 更改支付方式
			checkboxChange(e){
				var values = e.detail.value;
				this.parameter.wxpay = "0"
				this.parameter.alipay = "0"
				this.parameter.bankpay = "0"
				for(var i=0;i<values.length;i++){
					if(values[i]=="1"){
						this.parameter.wxpay = "1"
					}else if(values[i]=="2"){
						this.parameter.alipay = "2"
					}else if(values[i]=="3"){
						this.parameter.bankpay = "3"
					}
				}
			},
			// popup方法
			// 拉起popup
			getPopup(item){
				this.$refs['payment'].open()
			},
			// 取消
			cancel(type) {
				this.$refs['payment'].close()
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
			
		}
	}
</script>

<style lang="scss">
.main-box{
	background: #091941;
	padding-top: 20rpx;
	padding-bottom: 30rpx;
}
.aLine{
	padding: 10rpx 0;
	border-bottom: 1rpx solid #12224C;
	width: 100%;
}
.aLine>view{
	float: left;
	line-height: 60rpx;
}
.aLine>view:nth-child(1){
	width: 6em;
}
.aLine>view:nth-child(2){
	width: calc(100% - 9em);
	
	input{
		display: inline-block;
		height: 60rpx;
		line-height: 60rpx;
		width: calc(100% - 2em);
	}
	text{
		float: left;
		width: 1em;
		height: 60rpx;
		line-height: 60rpx;
	}
	image{
		float: left;
		margin-right: 10rpx;
	}
}
.aLine>view:nth-child(3){
	text-align: right;
	width: 3em;
}
.aLine image{
	width: 60rpx;
	height: 60rpx;
}
.release-tips{
	background: #091941;
	padding: 30rpx;
	view:nth-child(1){
		margin-bottom: 10rpx;
		font-size: 28rpx;
		color: #FCC44D;
	}
	view:nth-child(2){
		font-size: 24rpx;
		line-height: 1.6;
	}
}
.release-btn{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
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
// .order_payment_cancel{
// 	position: absolute;
// 	left: 30rpx;
// 	top: 20rpx;
// 	width: 30rpx;
// 	height: 30rpx;
// }
// .order_payment_cancel image{
// 	width: 100%;
// 	height: 100%;
// }
.order_payment_cancel{
	position: absolute;
	right: 30rpx;
	top: 20rpx;
	font-size: 32rpx;
	color: #007AFF;
}
.pay-type-box label{
	display: block;
	height: 80rpx;
	line-height: 80rpx;
	padding: 30rpx 0;
	position: relative;
	view{
		position: absolute;
		left: 0;
		top: 0;
		height: 140rpx;
		line-height: 140rpx;
		text-align: center;
		width: 100%;
		background: rgba(9,25,65,.8);
		z-index: 9999;
		color: #999;
	}
}
.pay-type-box text{
	display: inline-block;
	height: 80rpx;
	line-height: 80rpx;
	float: left;
}
.pay-type-box image{
	display: inline-block;
	width: 80rpx;
	height: 80rpx;
	margin-right: 30rpx;
	float: left;
}
uni-checkbox .uni-checkbox-input{
	background-color: #091941;
	border: 1px solid #FCC44D;
	border-radius: 50%;
}
.pay-type-box checkbox{
	float: right;
}

</style>
