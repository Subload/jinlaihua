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
				// let p = new Promise(function(reslove,reject){
				// 	getnotice();
				// 	reject('失败1')
				// })
				// p.then((data) => {
				// 	this.mescroll.endSuccess()
				// })
				// 第1种: 请求具体接口
				// uni.request({
				// 	url: 'xxxx',
				// 	success: () => {
				// 		// 请求成功,隐藏加载状态
				// 		this.mescroll.endSuccess()
				// 	},
				// 	fail: () => {
				// 		// 请求失败,隐藏加载状态
				// 		this.mescroll.endErr()
				// 	}
				// })
				// // 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				// this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// // 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
				// this.mescroll.endSuccess()
				// 若整个downCallback方法仅调用mescroll.resetUpScroll(),则downCallback方法可删 (mixins已默认)
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
