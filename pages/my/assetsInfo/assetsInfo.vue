<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="资产详情"
		>
		</auto-nav-bar>
		<view class="clear30"></view>
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
				<xw-empty :isShow="assetsList.length>0?false:true" text="暂无资产信息" textColor="#ddd"></xw-empty>
				
				<view class="assetsListBox">
					<view class="assetslist clearfix" v-for="(item, index) in assetsList" :key="index">
						<view>
							<text>{{item.cmcMsg}}</text>
							<text>{{item.cmcDate | timeStamp}}</text>
						</view>
						<view>{{item.cmcNumber>0?'+'+item.cmcNumber:item.cmcNumber}}</view>
					</view>
				</view>
				
			</mescroll-body>
		</view>
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
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
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
					
				},
				assetsList:[],
				
				// 无列表状态
				emptyShow:false, //true显示，false隐藏
				
				// 参数
				cmcCommunicid:"",
				pageNum:0,
				pageSize:10
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
		onLoad:function(option){
			this.cmcCommunicid = option.cmcCommunicid
			uni.showLoading()
			this.getlist()
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack();
			},
			
			// 资产详细记录
			getlist(){
				let userid = decode(this.userInfo.data);
				this.$API.getlist({
					userid,
					cmcCommunicid:this.cmcCommunicid,
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				}).then(res => {
					uni.hideLoading()
					setTimeout(() => {
						this.mescroll.endSuccess()
					},2000)
					console.log("资产详细记录",res)
					if(res.statusCode == 200){
						if(res.data.total>0){
							this.assetsList = res.data.data;
						}else{
							this.emptyShow = true
						}
					}else{
						uni.showToast({
							title:"资产详细记录，请稍后刷新重新",
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
			// 下拉刷新
			downCallback(){
				this.getlist();
			},
			
		}
	}
</script>

<style>
.assetsListBox{
	background: #091941;
	border-radius: 15rpx;
	padding: 0 20rpx;
}
.assetslist{
	border-bottom: 1px solid #12224C;
	padding: 20rpx 0;
}
.assetslist>view:nth-child(1){
	float: left;
	line-height: 1.6;
}
.assetslist>view:nth-child(1) text{
	display: block;
}
.assetslist>view:nth-child(1) text:nth-child(2){
	font-size: 28rpx;
	color: #ccc;
}
.assetslist>view:nth-child(2){
	float: right;
	line-height: 3.2;
	color: #FCC44D;
}
</style>
