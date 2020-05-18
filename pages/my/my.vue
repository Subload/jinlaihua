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
								{{userInfo.accountinfo.data.cmc_grade == 0?"花粉":
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
						<text>资产详情</text>
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
		
		<view class="notice" v-if="noticeShow">
			<view class="notice-box">
				<view class="notice-text">
					投资有风险,入市需谨慎。<br/>
					请先仔细阅读并理解<text @click="getNotice">《风险告知书》</text>
				</view>
				<view class="clearfix notice-btn">
					<view class="btn" @click="jujue">拒绝</view>
					<view class="btn" @click="setcidzt">我已仔细阅读</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import { decode,encode } from '@/utils/des3.js' // 参数加密方法
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
					title:"商品订单",
					icon:"/static/my/order@3x.png",
					url:"order",
				},{
					title:"JLH.MP订单",
					icon:"/static/piao.png",
					url:"jlhorder",
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
				}],
				noticeShow:false
			}
		},
		onLoad: function(){
			uni.showLoading()
			// let hasLogin = uni.getStorageSync('hasLogin') || '';
			if(!this.hasLogin){
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
			// let hasLogin = uni.getStorageSync('hasLogin') || '';
			if(!this.hasLogin){
				uni.hideLoading()
				uni.navigateTo({
					url: '/pages/my/login/login'
				})
				return
			}
			this.getcommunicassetsList();
			
			if(this.userInfo.accountinfo.data.cidzt == "0"){
				this.noticeShow = true
			}else{
				this.hasRealName()
			}
		},
		methods: {
			...mapMutations(['login']),
			// 导航右侧按钮
			handleRightClick(){
				uni.navigateTo({
				    url: '/pages/my/set/set'
				});
			},
			// 去登陆
			handleGologin(){
				uni.navigateTo({
				    url: '/pages/my/login/login'
				});
			},
			
			// 查看风险告知书
			getNotice(){
				uni.navigateTo({
					url:"/pages/agreement/agreement"
				})
			},
			// 拒绝直接退出
			jujue(){
				if (uni.getSystemInfoSync().platform=='android') {
					plus.runtime.quit();
				}else{
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				}
			},
			// 同意
			setcidzt(){
				this.$API.setcidzt({userid:decode(this.userInfo.data)}).then(res=>{
					if(res.statusCode == "200" && res.data.state=="0"){
						this.noticeShow = false
						this.$store.state.userInfo.accountinfo.data.cidzt = "1";
						this.login(this.userInfo)
						this.hasRealName()
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
			
			// 查看（更改）个人信息
			setUserInfo(){
				uni.navigateTo({
				    url: '/pages/my/editUserInfo/editUserInfo'
				});
			},
			// 点击列表项目
			handleProjectList(url){
				switch(url)
				{
					case 'recognition':   // 我的认赠
						uni.navigateTo({
							url: '/pages/my/recognition/recognition'
						});
					break;
					case 'order':   // 订单页
						uni.navigateTo({
							url: '/pages/my/order/order'
						});
					break;
					case 'jlhorder':   // 订单页
						uni.navigateTo({
							url: '/pages/otc/order/order'
						});
					break;
					case 'address':   //订单页
						uni.navigateTo({
							url: './address/address'
						});
					break;
					case 'paymentMethod':   //收款方式
						uni.navigateTo({
							url: '/pages/my/paymentMethod/paymentMethod'
						});
					break;
					case 'safetyCenter':   //安全中心
						uni.navigateTo({
							url: '/pages/my/safetyCenter/safetyCenter'
						});
					break;
					case 'invitation':   //我要邀请
						uni.navigateTo({
							url: '/pages/my/invitation/invitation'
						});
					break;
					case 'team':   //我的团队
						uni.navigateTo({
							url: '/pages/my/team/team'
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
				
				if(this.userInfo.accountinfo.data.senior == '0'){
					uni.showModal({
						content:"您还未实名认证，请先至我的->安全中心进行实名认证",
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
				if(this.userInfo.accountinfo.data.senior == '2'){
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
							title:"获取TZ失败，请稍后刷新重新",
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
					},1500)
				}).catch(err => {
					// error
					this.mescroll.endErr()
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
	
	.notice{
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 99999;
		background: rgba(0,0,0,.5);
	}
	.notice-box{
		border-radius: 15rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: #fff;
		width: 80vw;
		height: 30vh;
		margin: auto;
	}
	.notice-text{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding-top: 13%;
		font-size: 34rpx;
		text-align: center;
		color: #000;
		line-height: 1.6;
	}
	.notice-text text{
		color: #FCC44D;
		font-weight: bold;
		text-decoration: underline;
	}
	.notice-btn{
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding-bottom: 30rpx;
	}
	.notice-btn view{
		flex: 1;
		float: left;
		margin: 0 20rpx;
		border-radius: 10rpx;
		font-size: 32rpx;
	}
	.notice-btn view:nth-child(1){
		background: #999999;
	}
</style>
