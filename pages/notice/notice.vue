<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			title="快讯"
		></auto-nav-bar>	
		
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >

				<xw-empty :isShow="noticeList.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty>
				
				<view v-for="(item,index) in noticeList" :key="index">
					<view class="clear30"></view>
					<view class="notice-list clearfix" @click="handleNavigateTo(item)">
						<image class="notice-img" src="/static/notice.png"></image>
						<view class="notice-text">
							<text class="notice-name">{{item.cmc_title}}</text>
							<text class="notice-des">{{removeHTMLTag(item.contents)}}</text>
							<text class="notice-time">{{item.cmc_sj}}</text>
						</view>
					</view>
				</view>
			</mescroll-body>
			<view class="clear30"></view>
		</view>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		
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
				noticeList:[]
			}
		},
		onLoad:function(){
			try {
			    const hasLogin = uni.getStorageSync('hasLogin')||'';
			    const userInfo = uni.getStorageSync('userInfo')||'';
			    if (hasLogin) {
					let _this = this;
					setTimeout(()=>{
						_this.realName()
					},800)
				}
				this.getnotice()
			} catch (e) {
			    // error
			}
		},
		// onShow:function(){
		// 	uni.showLoading()
		// 	this.getnotice()
		// },
		methods: {
			handleNavigateTo(item){
				uni.navigateTo({
					url: "/pages/notice/noticeDetails/noticeDetails?item=" + encodeURIComponent(JSON.stringify(item)),
				});
			},
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			// mescrollInit(mescroll) {
			// 	this.mescroll = mescroll;
			// },
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				// setTimeout(() => {
				// 	this.mescroll.endSuccess()
				// },5000)
				this.getnotice();
			},
			/*上拉加载的回调*/
			// upCallback(page) {
			// 	setTimeout(() => {
			// 		this.mescroll.endSuccess()
			// 	},5000)
				
			// }
			/*移除HTML标签代码*/
			removeHTMLTag(str) {
				str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
				str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
				str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
				str = str.replace(/ /ig,'');//去掉 
				str = this.escape2Html(str);
				str = str.substring(0,40) + '...'
				return str;
			},
			//转意符换成普通字符
			escape2Html(str) { 
				var arrEntities={'lt':'<','gt':'>','nbsp':'','amp':'&','quot':'"'}; 
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
			}, 
			// 获取公告列表
			getnotice(){
				this.$API.getnotice({start:0,limit:10}).then(res => {
					console.log("公告列表",res)
					this.mescroll.endSuccess()
					if(res.statusCode != 200){
						this.emptyShow = true
						uni.showToast({
						    title: "加载失败，请稍后重试",
							icon: 'none',
						});
						return
					}
					if(res.data.data.length>0){
						this.noticeList = res.data.data;
					}else{
						this.emptyShow = true;
					}
				}).catch(err => {
					// error
					this.noticeList = []
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
			// 监测实名
			realName(){
				const hasLogin = uni.getStorageSync('hasLogin')||'';
				const userInfo = uni.getStorageSync('userInfo')||'';
				if (hasLogin) {
					if(userInfo.accountinfo.data.senior == 0){
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
					}
					if(userInfo.accountinfo.data.senior == 2){
						uni.showModal({
							content:"您的账号实名审核失败，请重新认证",
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
					}
				}
			}
		}
	}
</script>

<style>
	.notice-list{
		background: #091941;
		border-radius: 15rpx;
		padding: 20rpx 20rpx 15rpx 25rpx;
		transition: all 500ms;
	}
	.notice-img{
		float: left;
		width: 50rpx;
		height: 50rpx;
	}
	.notice-text{
		float: right;
		width: 570rpx;
	}
	.notice-name,
	.notice-des,
	.notice-time{
		display: block;
		width: 100%;
		line-height: 1.8;
	}
	.notice-name{
		font-size: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.notice-des,
	.notice-time{
		font-size: 28rpx;
		color: #999;
		text-align: justify;
	}
	.notice-time{
		text-align: right;
		line-height: normal;
	}
	
</style>
