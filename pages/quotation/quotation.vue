<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			title="行情"
		></auto-nav-bar>	
		
		<view class="uni-flex uni-row tab-header" >
			<view class="flex-item" style="text-align: left;">名称/代码</view>
			<view class="flex-item">价格</view>
			<view class="flex-item">成交额</view>
			<view class="flex-item" style="text-align: right;">成交量</view>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
			<!-- <view> @init="mescrollInit" @down="downCallback" @up="upCallback"为固定值,不可删改(与mescroll-mixins保持一致) </view>
			<view> 此处支持写入原生组件 </view> -->
			
			<xw-empty :isShow="lists.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty>
			
			<view v-for="(item, index) in lists" :key="index" class="uni-flex uni-row tab-list" @click="linkTo(item)">
				<view class="flex-item" style="text-align: left;color: #fcc44d; line-height: 1.2;padding-top: 26rpx;">
					<text>{{item.cmc_name}}</text>
					<text style="font-size: 24rpx;">{{item.cmc_code}}</text>
				</view>
				<view class="flex-item">{{item.cmc_price}}</view>
				<view class="flex-item">{{item.sum}}</view>
				<view class="flex-item" style="text-align: right;color: #fcc44d;">{{item.transquantity}}</view>
			</view>
		</mescroll-body>
		
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
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
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				lists:[],
				emptyShow:false//true显示，false隐藏
			}
		},
		onLoad:function(){
			uni.showLoading()
			this.gettrade()
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
				
				if(this.userInfo.accountinfo.data.senior == 0){
					uni.showModal({
						content:"您还未实名认证，请先实名认证",
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
				if(this.userInfo.accountinfo.data.senior == 1){
					uni.showModal({
						content:"您的账号实名审核中，完成审核后方可进行此操作",
						showCancel:false,
					})
					return
				}
				if(this.userInfo.accountinfo.data.senior == 2){
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
			
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			// mescrollInit(mescroll) {
			// 	this.mescroll = mescroll;
			// },
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.gettrade();
			},
			/*上拉加载的回调*/
			// upCallback(page) {
			// 	setTimeout(() => {
			// 		this.mescroll.endSuccess()
			// 	},5000)
				// let pageNum = page.num; // 页码, 默认从1开始
				// let pageSize = page.size; // 页长, 默认每页10条
				// uni.request({
				// 	url: 'xxxx?pageNum='+pageNum+'&pageSize='+pageSize,
				// 	success: (data) => {
				// 		// 接口返回的当前页数据列表 (数组)
				// 		let curPageData = data.xxx; 
				// 		// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
				// 		let curPageLen = curPageData.length; 
				// 		// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
				// 		let totalPage = data.xxx; 
				// 		// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
				// 		let totalSize = data.xxx; 
				// 		// 接口返回的是否有下一页 (true/false)
				// 		let hasNext = data.xxx; 
						
				// 		//设置列表数据
				// 		if(page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				// 		this.dataList = this.dataList.concat(curPageData); //追加新数据
						
				// 		// 请求成功,隐藏加载状态
				// 		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				// 		this.mescroll.endByPage(curPageLen, totalPage); 
						
				// 		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				// 		//this.mescroll.endBySize(curPageLen, totalSize); 
						
				// 		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
				// 		//this.mescroll.endSuccess(curPageLen, hasNext); 
						
				// 		//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
				// 		//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
				// 		//如果传了hasNext,则翻到第二页即可显示无更多数据.
				// 		//this.mescroll.endSuccess(curPageLen);
						
				// 		// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				// 		this.$nextTick(()=>{
				// 			this.mescroll.endSuccess(curPageLen)
				// 		})
						
				// 		//curPageLen必传的原因:
				// 		// 1. 使配置的noMoreSize 和 empty生效
				// 		// 2. 判断是否有下一页的首要依据: 
				// 		//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
				// 		//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
				// 		// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
				// 		// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
						
				// 		// 提示: 您无需额外维护页码和判断显示空布局,mescroll已自动处理好.
				// 		// 当您发现结果和预期不一样时, 建议再认真检查以上参数是否传正确
				// 	},
				// 	fail: () => {
				// 		//  请求失败,隐藏加载状态
				// 		this.mescroll.endErr()
				// 	}
				// })
			// }
			// 获取行情
			gettrade(){
				this.$API.gettrade().then(res => {
					uni.hideLoading()
					setTimeout(() => {
						this.mescroll.endSuccess()
					},2000)
					
					console.log("行情",res)
					if(res.statusCode == 200){
						this.lists = res.data.data
					}
					if(res.data.data.length>0){
						this.emptyShow = false;
					}
					// uni.hideLoading()
					// if(res.data.data.length){
					// 	this.emptyShow = false;
					// 	this.addressData = res.data.data;
					// }
				}).catch(err => {
					uni.hideLoading();
					setTimeout(() => {
						this.mescroll.endSuccess()
					},5000)
					// error
					this.lists = [];
					this.emptyShow = true;
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
