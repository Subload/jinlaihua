<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="我的认赠"
		>
		</auto-nav-bar>
		<view class="clear30"></view>
		<view class="">
			<!-- <view class="main-box">
				<view class="toBeReleased">
					当前待释放：<text>{{recognitionList.remain}}</text>
				</view>
			</view> -->
			
			<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" center aniType="extend"
				type="hang" sliderColor="#fcc44d" textColor="#fcc44d" selectColor="#fcc44d" ref="tabs2" class="tabs"
				:sliderMargin="20" 
				>
			</cl-tabs>
			
			<view class="clear30"></view>
			
			<swiper
				class="swiper" 
				:duration="300"
				@transition="transition"
				@change="changeCurrent" 
				:current="tabCurrentIndex"
				@animationfinish="animationfinish">
				
				<swiper-item>
					<view class="main-box">
						<view class="recognitionList">
							<xw-empty :isShow="recognitionList.remain.length>0?false:true" text="暂无待释放" textColor="#ddd"></xw-empty>
							
							<view class="listItem clearfix" v-for="(remain,index) in recognitionList.remain" :key="index">
								<view>
									<text>{{remain.cmc_name}}</text>
									<text>{{remain.cmc_code}}</text>
								</view>
								<view>
									<text>待释放</text>
									<text>{{remain.remain}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="main-box">
						<view>
							<xw-empty :isShow="recognitionList.list.length>0?false:true" text="暂无认赠" textColor="#ddd"></xw-empty>
							
							<view class="recognitionItem clearfix" v-for="(listItem,index) in recognitionList.list" :key="index">
								<view class="recognitionItem_info clearfix">
									<view class="">
										<view>{{listItem.cmc_name}}<text v-if="!listItem.cmc_state">(释放中)</text></view>
										<view>{{listItem.cmc_code}}</view>
									</view>
									<view class="">
										<view>认赠数量:<text>{{listItem.cmc_setnumber}}</text></view>
										<view>已释放:<text>{{listItem.cmc_give_balance}}</text></view>
									</view>
								</view>
								<view class="recognitionItem_re">认赠时间：{{listItem.cmc_renzengdate.time|timeStamp}}</view>
								<view class="recognitionItem_re" v-if="listItem.cmc_state">已结束：{{listItem.cmc_enddate.time|timeStamp}}</view>
								<!-- <view class="recognitionItem_re" v-else>释放中</view> -->
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="main-box">
						<view class="recognitionList">
							<xw-empty :isShow="recognitionList.yesterday.length>0?false:true" text="今日暂无收益" textColor="#ddd"></xw-empty>
							
							<view class="listItem clearfix" v-for="(yesterday,index) in recognitionList.yesterday" :key="index">
								<view>
									<text>{{yesterday.cmc_name}}</text>
									<text>{{yesterday.cmc_code}}</text>
								</view>
								<view>
									<text>今日收益</text>
									<text>{{yesterday.history}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="main-box">
						<view class="recognitionList">
							<xw-empty :isShow="recognitionList.history.length>0?false:true" text="暂无收益" textColor="#ddd"></xw-empty>
							
							<view class="listItem clearfix" v-for="(history,index) in recognitionList.history" :key="index">
								<view>
									<text>{{history.cmc_name}}</text>
									<text>{{history.cmc_code}}</text>
								</view>
								<view>
									<text>历史收益</text>
									<text>{{history.history}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
				
			</swiper>
		</view>
		
	</view>
</template>

<script>
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState,
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				recognitionList:{
					remain:[], // 待释放
					list:[], // 用户的认赠列表  不分页 所有的
					yesterday:[], // 昨日收益  是个 列表 有可能有好几种
					history:[] // 历史总收益 也是列表
				},
				
				// 列表为空状态显隐
				remainShow:false,
				listShow:false,
				yesterdayShow:false,
				historyShow:false,
				
				// tabs数据
				tabBars:['待释放','我的认赠','今日收益','历史收益'],
				tabCurrentIndex:-1,
				sysWidth:0,
				source:'touch',
				fristTouch:false,
			}
		},
		filters: {
			timeStamp: function(value) { //具体到时分秒
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				// var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute ;
				// 返回
				return result;
			}
		},
		onLoad:function(){
			this.sysWidth = uni.getSystemInfoSync().screenWidth;
			uni.showLoading()
			this.getRecognition()
		},
		mounted(){
			this.tabCurrentIndex = 0
		},
		methods: {
			// 返回
			handleLeftClick(){
				uni.navigateBack();
			},
			// 获取详细
			getRecognition(){
				let userid = decode(this.userInfo.data)
				this.$API.recognition({userid}).then(res => {
					console.log("我的认赠",res)
					uni.hideLoading()
					if(res.statusCode == 200){
						if(res.data.state == 0){
							this.recognitionList = res.data.data;
						}else{
							uni.showModal({
								content:"网络错误，请稍后重试",
								showCancel:false,
								success: () => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}
					}else{
						uni.showModal({
							content:"网络错误，请稍后重试",
							showCancel:false,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}
				}).catch(err => {
					// error
					uni.showModal({
						content:err.text,
						showCancel:false,
						success: () => {
							uni.navigateBack({
								delta:1
							})
						}
					})
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
			// tabs 方法
			tabChange(e){
				this.tabCurrentIndex = e
			},
			changeCurrent(e){
				this.source = e.detail.source
				// 每次滑动回到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0,
				});
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

<style scoped>
uni-swiper{
	min-height: 100vh;
}
.recognitionList{
	border-radius: 15rpx;
	background: #091941;
	padding: 20rpx;
}
.listItem{
	border-bottom: 1px solid #12224C;
	padding: 20rpx 0;
}
.listItem>view:nth-child(1){
	float: left;
}
.listItem>view:nth-child(2){
	float: right;
	text-align: right;
}
.listItem text{
	display: block;
	font-size: 28rpx;
	line-height: 1.6;
}
.listItem>view:nth-child(2) text:nth-child(2){
	color: #FCC44D;
}
.recognitionItem{
	border-radius: 15rpx;
	background: #091941;
	margin-bottom: 30rpx;
	padding: 20rpx;
}
.recognitionItem_info{
	border-bottom: 1px solid #12224C;
	padding-bottom: 10rpx;
	margin-bottom: 10rpx;
	font-size: 32rpx;
	line-height: 1.6;
}
.recognitionItem_info>view:nth-child(1){
	float: left;
}
.recognitionItem_info>view:nth-child(1) text{
	font-size: 24rpx;
}
.recognitionItem_info>view:nth-child(2){
	float: right;
	text-align: right;
}
.recognitionItem_info text{
	color: #FCC44D;
	margin-left: 20rpx;
}
.recognitionItem_re{
	color: #A3A3A3;
	font-size: 26rpx;
	line-height: 1.4;
}
</style>
