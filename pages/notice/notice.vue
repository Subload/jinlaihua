<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			title="快讯"
		></auto-nav-bar>	
		
		<view class="main-box">
			<view class="clear30"  v-if="gonggao.length>0"></view>
			<!-- 轮播图 -->
			<view class="store-swiper" v-if="gonggao.length>0" style="overflow: hidden;">
				<swiper class="swiper" indicator="false" autoplay="autoplay" interval="2000" duration="500">
					<swiper-item v-for="(item,index) in gonggao" :key="index">
						<view class="notice-list clearfix gonggao"  @click="handleNavigateTo(item)">
							<view class="logo">
								<image src="/static/logo.png" mode="aspectFill"></image>
							</view>
							<view class="clearfix text">
								<view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.cmc_title}}</view>
								<view>
									{{removeHTMLTag(item.contents,40)}}
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" style="min-height: calc(100vh - var(--status-bar-height) - 403rpx);">

				<!-- <xw-empty :isShow="noticeList.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty> -->
				
				<view v-for="(item,index) in noticeList" :key="index">
					<view class="clear30"></view>
					<view class="notice-list clearfix" @click="handleNavigateTo(item)">
						<image class="notice-img" src="/static/notice.png"></image>
						<view class="notice-text">
							<text class="notice-name">{{item.cmc_title}}</text>
							<text class="notice-des">{{removeHTMLTag(item.contents,40)}}</text>
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
	import { decode } from '@/utils/des3.js' // 参数加密方法
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
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 ,// 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				noticeList:[],
				gonggao:[]
			}
		},
		onLoad:function(){
			if (this.hasLogin) {
				setTimeout(()=>{
					this.realName()
				},800)
			}
			this.getnotice()
			this.getgonggao()
		},
		methods: {
			handleNavigateTo(item){
				uni.navigateTo({
					url: "/pages/notice/noticeDetails/noticeDetails?item=" + encodeURIComponent(JSON.stringify(item)),
				});
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.upOption.page={
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 20 // 每页数据的数量,默认10
				}
				this.getnotice();
			},
			/*上拉加载的回调*/
			upCallback(page) {
				this.getnotice(page);
			},
			/*移除HTML标签代码*/
			removeHTMLTag(str,num) {
				str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
				str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
				str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
				str = str.replace(/ /ig,'');//去掉 
				str = this.escape2Html(str);
				str = str.substring(0,num) + '...'
				return str;
			},
			//转意符换成普通字符
			escape2Html(str) { 
				var arrEntities={'lt':'<','gt':'>','nbsp':'','amp':'&','quot':'"'}; 
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
			}, 
			// 获取公告列表
			getnotice(opt){
				let pages={start:0,limit:10,type:0}
				if(opt){
					pages = {
						start:opt.options.up.page.num,
						limit:opt.options.up.page.size,
						type:0
					}
				}
				
				this.$API.getnotice(pages).then(res => {
					if(res.statusCode != '200' || res.data.state != '0'){
						uni.showToast({
						    title: "加载失败，请稍后重试",
							icon: 'none',
						});
						return
					}
					if(opt){
						this.noticeList=this.noticeList.concat(res.data.data);
						this.mescroll.endSuccess(this.noticeList.length);
						//设置列表数据
					}else{
						this.noticeList = res.data.data;
						setTimeout(()=>{
							this.mescroll.endSuccess()
						},1500)
					}
				}).catch(err => {
					// error
					this.mescroll.endErr()
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			// 获取公告
			getgonggao(){
				this.$API.getnotice({start:0,limit:10,type:1}).then(res => {
					// console.log("公告列表",res)
					if(res.statusCode != '200'||res.data.state != '0'){
						uni.showToast({
						    title: "公告加载失败，请稍后重试",
							icon: 'none',
						});
						return
					}
					this.gonggao = res.data.data;
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
			// 监测实名
			realName(){
				if(this.userInfo.accountinfo.data.senior == '0'){
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
				if(this.userInfo.accountinfo.data.senior == '2'){
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
				// 已经实名
				if(this.userInfo.accountinfo.data.senior == '3'){
					this.hasPending()
				}
			},
			// 是否有待处理
			hasPending(){
				let userid = decode(this.userInfo.data);
				this.$API.getOrderRecord({userid,page:"0",type:"2"}).then(res=>{
					if(res.data.state == "0"&&res.statusCode == "200"){
						if(res.data.data.length>0){
							uni.showModal({
								content:"您有订单尚未处理，请尽快处理",
								showCancel:false,
								confirmText:"去处理",
								success: (res) => {
									if(res.confirm){
										uni.navigateTo({
											url: "/pages/otc/order/order?num=" + '处理'
										});
									}
								}
							})
						}
					}
				}).catch(err => {
					// error
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
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
	
	// 公告
	.gonggao .logo{
		float: left;
		width: 200rpx;
		height: 200rpx;
		background: #091941;
	}
	.gonggao .logo image{
		width: 100%;
		height: 100%;
	}
	.gonggao .text view:nth-child(1){
		line-height: 2;
		font-size: 34rpx;
	}
	.gonggao .text view:nth-child(2){
		font-size: 28rpx;
	}
</style>
