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
										<view class="card-sj">时间：{{item.sj}}</view>
										<view class="clearfix card-info">
											<view class="card-info-left">
												<view><text>{{item.type?"出售":"购买"}}</text>{{item.symbol}}</view>
												<view>订单号：{{item.ordernumber}}</view>
												<view>{{item.type?"购买方":"出售方"}}：{{item.name}}</view>
											</view>
											<view class="card-info-right">
												<view>¥<text>{{item.price}}</text></view>
												<view>X{{item.copyquantity}}</view>
												<view class="card-info-total">总额：¥<text>{{item.cny}}</text></view>
											</view>
										</view>
										<view class="card-btn clearfix">
											<view>{{item.state == "0"?"撤销":"1"?"去支付":"3"?"已撤销":"5"?"已完成":""}}</view>
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
	
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {navTab},
	data() {
		return {
			currentTab: 0, //sweiper所在页
			pages:[1,1,1,1], //第几页存储 
			tabTitle:['我的出售','我的购买','待处理','历史成交'], //导航栏格式
			list: [
				[{
					"otherid": 0,
					"orderid": 72,
					"symbol": "JLH",
					"name": "",
					"ordernumber": "Trade20200511698309",
					"state": "0",
					"orderstate": "挂单中",
					"type": 0,
					"price": "100",
					"sj": "14:44 05/07",
					"copyquantity": "100",
					"cny": "10000"
				}],
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
		  };
	},
	onLoad(e) {
		
	},
	onShow() {},
	onHide() {},
	methods: {
		handleLeftClick(){
			uni.navigateBack()
		},
		changeTab(index){
			this.currentTab = index
		},
		
		/*下拉刷新的回调, 有三种处理方式:*/
		downCallback(){
			setTimeout(() => {
				this.mescroll.endSuccess()
			},2000)
		},
		
		// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
		isRequest(pages) {
			return new Promise((resolve, reject) => {
				this.pages[this.currentTab]++
				var that = this
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: `请求第${that.currentTab + 1 }个导航栏的第${that.pages[that.currentTab]}页数据成功`
					})
					let newData = ['新数据1','新数据2','新数据3']
					resolve(newData)
				}, 1000)
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
				console.log(tempList)
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
	  overflow: hidden;
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
			
			.card-info-left{
				float: left;
				color: #fff;
				font-size: 32rpx;
				
				view:nth-child(2),
				view:nth-child(3){
					font-size: 28rpx;
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
		.card-btn{
			padding: 0 20rpx;
			view{
				float: right;
				border: 1rpx solid #A3A3A3;
				color: #A3A3A3;
				padding: 0 40rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
			}
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
