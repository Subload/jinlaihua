<template>
	<view>
		<!-- 自定义navbar -->
		<auto-nav-bar
			rightSet
			title="我的"
			@clickRight="handleRightClick"
		></auto-nav-bar>	
		
		<view class="main-box">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
				<view class="clear30"></view>
				
				<!-- 头像昵称 -->
				<view class="user-info clearfix" v-if="!this.hasLogin" @click="handleGologin">
					<view class="user-portrait">
						<image class="user-portrait-img" src="/static/logo.png"></image>
					</view>
					<view class="user-info-text">
						<view class="user-info-name">
							<text>暂未登录</text>
						</view>
					</view>
				</view>
				<view v-else class="user-info clearfix" @click="setUserInfo">
					<view class="user-portrait">
						<image class="user-portrait-img" :src="userInfo.accountinfo.data.icon ? userInfo.accountinfo.data.icon : '/static/logo.png'" mode="aspectFill"></image>
					</view>
					<view class="user-info-text">
						<view class="user-info-name">
							<text>{{userInfo.accountinfo.data.nickname}}</text>
							<text class="user-info-lv">
								{{userInfo.accountinfo.data.cmc_grade == 0?"普通用户":
								userInfo.accountinfo.data.cmc_grade == 1?"普通会员":
								userInfo.accountinfo.data.cmc_grade == 2?"区级代理":
								userInfo.accountinfo.data.cmc_grade == 3?"市级代理":
								userInfo.accountinfo.data.cmc_grade == 4?"省级代理":
								userInfo.accountinfo.data.cmc_grade == 5?"合伙人":
								"商务董事"}}
							</text>
						</view>
						<text class="user-info-phone">{{userInfo.accountinfo.data.phone}}</text>
					</view>
				</view>
				
				<view class="clear30"></view>
				
				<!-- 通证数量 -->
				<view class="user-tz" v-if="this.hasLogin">
					<view class="user-tz-eye clearfix">
						<text>当前资产</text>
						<view @click="handleShowAssets">
							<image :src="showAssets?'/static/login/show@3x.png':'/static/login/hide@3x.png'" mode="aspectFill"></image>
						</view>
					</view>
					<view v-if="passCardInfo && passCardInfo.length>0">
						<scroll-view class="user-tz-swiper clearfix" scroll-x="true">
							<view class="clearfix user-tz-swiper-view" v-for="(item, index) in passCardInfo" :key="index" @click="handleClickAssets(item.symbol)">
								<view class="user-tz-title">{{item.cmc_name}}</view>
								<view class="user-tz-num">{{ showAssets ? item.ye : '**·****'}}</view>
							</view>
						</scroll-view>
					</view>
					<view v-else>
						暂无资产
					</view>
				</view>
				
				<!-- 操作列表 -->
				<project-list
					v-for="(item,index) in proList"
					:key="index"
					:thumb="item.icon"
					:title="item.title"
					@clickBtn="handleProjectList(item.url)"
				/>
				<view class="clear30"></view>
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
		mapMutations
	} from 'vuex';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		computed: mapState([ 'hasLogin','userInfo','firstTime']),
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
				// 资产是否显示
				showAssets:true,
				passCardInfo:[],
				// 列表
				proList:[{
					title:"我的认赠",
					icon:"/static/my/recognition@3x.png",
					url:"recognition",
				},{
					title:"我的订单",
					icon:"/static/my/order@3x.png",
					url:"order",
				},{
					title:"收货地址",
					icon:"/static/my/address@3x.png",
					url:"address",
					
				},{
					title:"收款方式",
					icon:"/static/my/entry@3x.png",
					url:"paymentMethod"
				},{
					title:"安全中心",
					icon:"/static/my/safe@3x.png",
					url:"safetyCenter"
				},{
					title:"我的分享",
					icon:"/static/my/Invite@3x.png",
					url:"invitation"
				},{
					title:"我的团队",
					icon:"/static/my/team@3x.png",
					url:"team"
				}]
			}
		},
		onLoad: function(){
			uni.showLoading()
			let hasLogin = uni.getStorageSync('hasLogin') || '';
			if(!hasLogin){
				uni.hideLoading()
				uni.navigateTo({
					url: '/pages/my/login/login'
				})
				return
			}
			this.getcommunicassetsList();
		},
		onShow: function(){
			uni.showLoading()
			let hasLogin = uni.getStorageSync('hasLogin') || '';
			if(!hasLogin){
				uni.hideLoading()
				uni.navigateTo({
					url: '/pages/my/login/login'
				})
				return
			}
			this.getcommunicassetsList();
			this.hasRealName()
		},
		methods: {
			...mapMutations(['login']),
			// 导航右侧按钮
			handleRightClick(){
				uni.navigateTo({
				    url: '/pages/my/set/set',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 去登陆
			handleGologin(){
				uni.navigateTo({
				    url: '/pages/my/login/login',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 查看（更改）个人信息
			setUserInfo(){
				uni.navigateTo({
				    url: '/pages/my/editUserInfo/editUserInfo',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 点击列表项目
			handleProjectList(url){
				switch(url)
				{
					case 'recognition':   // 我的认赠
						uni.navigateTo({
							url: '/pages/my/recognition/recognition',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'order':   // 订单页
						uni.navigateTo({
							url: '/pages/my/order/order',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'address':   //订单页
						uni.navigateTo({
							url: './address/address',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'paymentMethod':   //收款方式
						uni.navigateTo({
							url: '/pages/my/paymentMethod/paymentMethod',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'safetyCenter':   //安全中心
						uni.navigateTo({
							url: '/pages/my/safetyCenter/safetyCenter',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'invitation':   //我要邀请
						uni.navigateTo({
							url: '/pages/my/invitation/invitation',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
					case 'team':   //我的团队
						uni.navigateTo({
							url: '/pages/my/team/team',
							fail: (res) => {
								console.log(res)
							}
						});
					break;
				}
			},
			// 资产显隐
			handleShowAssets(){
				this.showAssets = !this.showAssets;
			},
			
			// 判断是否实名
			hasRealName(){
				const _this = this
				if(!this.$store.state.firstTime){
					return
				}
				if(this.userInfo.accountinfo.data.senior == 0){
					uni.showModal({
						content:"您还未实名认证，请先实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							_this.$store.state.firstTime = false;
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
				}
				if(this.userInfo.accountinfo.data.senior == 2){
					uni.showModal({
						content:"您的账号实名审核失败，请重新实名认证",
						showCancel:false,
						confirmText:"去实名",
						success: (res) => {
							_this.$store.state.firstTime = false;
							if(res.confirm){
								uni.navigateTo({
									url: "/pages/my/editRealName/editRealName"
								});
							}
						}
					})
				}
			},
			
			// 用户资产列表
			getcommunicassetsList(){
				let userid = decode(this.userInfo.data);
				this.$API.getcommunicassetsList({userid,start:0,limit:99}).then(res => {
					uni.hideLoading()
					if(res.statusCode == 200){
						if(res.data.data.length>0){
							this.passCardInfo = res.data.data;
						}
					}else{
						uni.showToast({
							title:"获取通证失败，请稍后刷新重新",
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
			// 资产点击
			handleClickAssets(item){
				uni.navigateTo({
					url:"/pages/my/assetsInfo/assetsInfo?cmcCommunicid=" + item,
				})
			},
			// 下拉刷新
			downCallback(){
				this.getAccountInfo();
				this.getcommunicassetsList()
			},
			// 重新获取用户信息
			getAccountInfo(){
				let userid = decode(this.userInfo.data);
				this.$API.getAccountInfo({userid}).then(res => {
					if(res.statusCode == 200){
						this.$store.state.userInfo = res.data;
						this.login(res.data);
					}
					setTimeout(()=>{
						this.mescroll.endSuccess()
					},2000)
				}).catch(err => {
					// error
					uni.showToast({
						title: err.text,
						icon: 'none',
					});
					this.mescroll.endSuccess()
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			
		}
	}
</script>

<style>
	.user-info,
	.user-tz{
		background: #091941;
		border-radius: 15rpx;
		padding: 24rpx;
	}
	.user-portrait{
		float: left;
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		overflow: hidden;
		/* border: 1rpx solid #fff; */
		margin-right: 20rpx;
		background: #2C405A;
	}
	.user-portrait-img{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}
	.user-info-text{
		float: left;
		padding-top: 10rpx;
	}
	.user-info-name{
		font-size: 32rpx;
		margin-bottom: 10rpx;
	}
	.user-info-lv{
		color: #fcc44d;
		font-size: 24rpx;
		border-radius: 6rpx;
		border: 1px solid #fcc44d;
		padding: 0 10rpx;
		margin-left: 40rpx;
	}
	.user-info-phone{
		font-size: 26rpx;
	}
	.user-tz-eye{
		margin-bottom: 20rpx;
		font-size: 32rpx;
	}
	.user-tz-eye text{
		float: left;
	}
	.user-tz-eye view{
		float: left;
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
		padding-top: 4rpx;
	}
	.user-tz-eye view image{
		width: 100%;
		height: 100%;
	}
	.user-tz-swiper{
		white-space: nowrap;
		width: 100%;
	}
	.user-tz-swiper .user-tz-swiper-view{
		display: inline-block;
		width: 40%;
		text-align: center;
		position: relative;
		border-left: 1px solid #666;
	}
	/* .user-tz-swiper .user-tz-swiper-view::before{
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 60%;
		width: 50rpx;
		background: #fff;
		border-left: 1rpx solid #999;
	} */
	.user-tz-swiper .user-tz-swiper-view:nth-child(1){
		border-left: none;
	}
	/* .user-tz-swiper .user-tz-swiper-view:nth-child(1)::before{
		border-left: none;
	} */
	.user-tz-title{
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}
	.user-tz-num{
		font-size: 28rpx;
		color: #999999;
	}
</style>
