<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="我的订单"
		>
		</auto-nav-bar>	
		
		
		<view class="clear30"></view>
		<view class="main-box masterOrderDetailBox">
			<view>· 总计挂单：{{Number(masterOrderDetail.totalquantity).toFixed(2)}}{{masterOrderDetail.cname}}</view>
			<view>· 设置价格：¥ {{Number(masterOrderDetail.price).toFixed(2)}}</view>
			<view class="tab" v-if="masterOrderDetail.orderstate=='5'">· 已结束交易</view>
			<view v-if="masterOrderDetail.orderstate!='5'">· 剩余挂单：{{Number(masterOrderDetail.residuequantity).toFixed(2)}}{{masterOrderDetail.cname}}</view>
			<view class="tab" v-if="masterOrderDetail.orderstate=='5'&&Number(masterOrderDetail.residuequantity)<40">剩余不足40{{masterOrderDetail.cname}},已自动取消挂单，剩余数量已退回账户。</view>
		</view>
		<view class="clear30"></view>
		<view class="">
			<xw-empty :isShow="slaveOrdersDetail.length>0?false:true" text="暂无子订单" textColor="#ddd"></xw-empty>
			<view class="">
				<view class="card clearfix slaveOrdersDetailBox" v-for="(item,index) in slaveOrdersDetail" :key="index" @click="jumpTo(item)">
					<view class="card-sj clearfix">
						时间：{{item.sj}}
						<!-- <view class="card-btn" v-if="item.state">{{item.state == "0"?"挂单中":item.state == "1"?"待买家付款":item.state == "2"?"待卖家确认收款":item.state == "3"?"已撤销":item.state == "5"?"已完成":"未知状态"}}</view>
						<view class="card-btn" v-else>已完成</view> -->
						<view class="card-btn">{{item.orderstate}}</view>
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
							<view>X{{item.copyquantity?item.copyquantity:item.quantity}}</view>
							<view class="card-info-total">总额：¥<text>{{item.cny?item.cny:(item.price*item.quantity).toFixed(2)}}</text></view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 主单详情
				masterOrderDetail:{
					"selledquantity": "0",
					"selledcny": "0",
					"price": "0",
					"sj": "",
					"cname": "JLH.MP",
					"leftquantity": "0",
					"leftcny": "0",
					"residuequantity": "0",
					"orderstate": "0",
					"totalcny": "0",
					"totalquantity": "0",
					"copyquantity": "0"
				},
				// 从单列表
				slaveOrdersDetail:[]
			}
		},
		onLoad:function(option){
			this.getMasterOrderDetail(option.orderid)
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack()
			},
			
			// 点击跳转到详情或者主单列表
			jumpTo(item){
				uni.navigateTo({
					url:'/pages/otc/orderDetails/orderDetails?slaveorderid=' + item.orderid
				})
			},
			
			
			// 获取主单详情和从单列表
			getMasterOrderDetail(opt){
				this.$API.getMasterOrderDetail({orderid:opt}).then(res=>{
					if(res.statusCode == '200' && res.data.state == "0"){
						this.masterOrderDetail = res.data.data.masterOrderDetail
						this.slaveOrdersDetail =  res.data.data.slaveOrdersDetail
					}else{
						uni.showModal({
							content:"网络错误，请稍后重试",
							showCancel:false,
							success: () => {
								uni.navigateBack()
							}
						})
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
			
		}
	}
</script>

<style lang="scss">
// .masterOrderDetailBox{
// 	background: #091941;
// 	padding: 30rpx 20rpx;
// 	border-radius: 15rpx;
// }
.masterOrderDetailBox{
	font-size: 30rpx;
}
.masterOrderDetailBox view{
	line-height: 2;
	padding-left: 10rpx;
	border-bottom: 1px solid #12224C;
}
.masterOrderDetailBox .tab{
	color: #FCC44D;
	font-size: 28rpx;
}
.slaveOrdersDetailBox{
	background: #091941;
	border-bottom: 1px solid #12224C;
}

.card{
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
	
		
	
</style>
