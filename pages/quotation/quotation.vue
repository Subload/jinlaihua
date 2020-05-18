<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			title="行情"
		></auto-nav-bar>	
		
		<view class="uni-flex uni-row tab-header" >
			<view class="flex-item" style="text-align: left;">名称</view>
			<view class="flex-item">价格</view>
			<view class="flex-item">成交额</view>
			<view class="flex-item" style="text-align: right;">成交量</view>
		</view>
			
		<xw-empty :isShow="lists.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty>
		
		<view v-for="(item, index) in lists" :key="index" class="uni-flex uni-row tab-list" @click="linkTo(item)">
			<view class="flex-item" style="text-align: left;color: #fcc44d;">
				{{item.cmc_name}}
			</view>
			<view class="flex-item">{{item.cmc_price}}</view>
			<view class="flex-item">{{item.sum}}</view>
			<view class="flex-item" style="text-align: right;color: #fcc44d;">{{item.transquantity}}</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	
	let timerQuotation;
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		data() {
			return {
				lists:[],
			}
		},
		onLoad:function(){
			uni.showLoading()
			this.gettrade()
		},
		onShow:function(){
			timerQuotation = setInterval(()=>{
				this.gettrade()
			},10000)
		},
		onHide:function(){
			clearInterval(timerQuotation)
		},
		methods: {
			
			// 跳转内页
			linkTo(item){
				if(!this.hasLogin){
					uni.showModal({
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/login/login"
								});
							}
						}
					})
					return
				}
				
				if(this.userInfo.accountinfo.data.senior == '0'){
					uni.showModal({
						content:"您还未实名认证，请先至我的->安全中心进行实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == '1'){
					uni.showModal({
						content:"您的账号实名审核中，完成审核后方可进行此操作",
						showCancel:false,
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == '2'){
					uni.showModal({
						content:"您的账号实名审核失败，请重新实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
					return
				}
				
				// 判断是子票还是母票
				if(item.shrapnel == 0){
					uni.switchTab({
					    url: "/pages/business/business"
					});
					return
				}
				uni.navigateTo({
				    url: "/pages/quotation/product/product?item=" + encodeURIComponent(JSON.stringify(item))
				});
			},
			
			// 获取行情
			gettrade(){
				this.$API.gettrade().then(res => {
					uni.hideLoading()
					if(res.statusCode != '200' || res.data.state != '0'){
						uni.showToast({
						    title: "加载失败，请稍后重试",
							icon: 'none',
						});
						return
					}
					this.lists = res.data.data
				}).catch(err => {
					uni.hideLoading();
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
		}
	}
</script>

<style scoped>
	.tab-header{
		border-bottom: 1px solid #12224c;
		line-height: 90rpx;
	}
	.tab-header .flex-item{
		font-size: 30rpx;
	}
	.uni-row{
		display: flex;
		padding: 0 30rpx;
	}
	.flex-item{
		width: 25%;
		font-size: 28rpx;
		text-align: center;
	}
	.flex-item text{
		display: block;
	}
	.tab-list{
		height: 120rpx;
		line-height: 120rpx;
	}
	.tab-list .flex-item{
		border-bottom: 1px solid #12224c;
	}
	
</style>
