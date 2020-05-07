<template>
	<view>
		<!-- 我的团队 team -->
		<auto-nav-bar
			leftShow
			title="我的团队"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>
		
		<view class="clear30"></view>
		<view class="main-box">
			<view class="team_my">
				<view class="team_my_lv">
					{{userInfo.accountinfo.data.nickname}}:
					<text>
						{{userInfo.accountinfo.data.cmc_grade == 0?"普通用户":
						userInfo.accountinfo.data.cmc_grade == 1?"普通会员":
						userInfo.accountinfo.data.cmc_grade == 2?"区级代理":
						userInfo.accountinfo.data.cmc_grade == 3?"市级代理":
						userInfo.accountinfo.data.cmc_grade == 4?"省级代理":
						userInfo.accountinfo.data.cmc_grade == 5?"合伙人":
						"商务董事"}}
					</text>
				</view>
				<view class="team_my_info">
					<view>
						<text>我的收益</text>
						<text>{{myInfo.reward||0}}</text>
					</view>
					<view>
						<text>团队人数</text>
						<text>{{myInfo.count||0}}</text>
					</view>
				</view>
			</view>
			<view class="clear30"></view>
			<view class="team_box">
				<xw-empty :isShow="emptyShow" text="暂无下级" textColor="#ddd"></xw-empty>
				<view class="team_item clearfix" v-for="(item, index) in teamList" :key="index" @click="toSecLv(item.uid)">
					<view class="team_name">
						<text>{{item.nickname}}</text>
						<text>{{item.utel}}</text>
					</view>
					<!-- <view class="team_lv" v-html="item.setnumber">{{item.setnumber}}</view> -->
					<view class="team_num">
						<text>认购通证数量:</text><br/>{{item.setnumber}}
					</view>
				</view>
			</view>
		</view>
		<view class="clear30"></view>
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
				myInfo:{},
				teamList:[],
				
				// 无商品状态
				emptyShow:false, //true显示，false隐藏
			}
		},
		onLoad:function(){
			this.getMyTeam()
			this.getSubordinate()
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 跳转二级列表
			toSecLv(uid){
				uni.navigateTo({
					url:'/pages/my/team/secLv/secLv?uid='+ uid,
				})
			},
			
			// 获取我的团队收益
			getMyTeam(){
				let userid = decode(this.userInfo.data);
				this.$API.getMyTeam({userid}).then(res => {
					console.log("获取我的团队收益",res)
					if(res.statusCode == 200){
						if(res.data.state == 0){
							this.myInfo = res.data.data;
						}
					}else{
						uni.showToast({
							title:"获取我的收益失败，请稍后重新",
							icon:"none"
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
			
			// 获取团队列表
			getSubordinate(){
				uni.showLoading()
				let userid = decode(this.userInfo.data);
				this.$API.getSubordinate({userid}).then(res => {
					uni.hideLoading()
					// console.log("获取团队列表",res)
					if(res.statusCode == 200){
						if(res.data.data.length>0){
							this.teamList = res.data.data;
						}else{
							this.emptyShow = true
						}
					}else{
						this.emptyShow = true
						uni.showToast({
							title:"获取团队列表失败，请稍后重新",
							icon:"none"
						})
					}
				}).catch(err => {
					// error
					this.emptyShow = true
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
			}
		}
	}
</script>

<style>
.team_my{
	padding: 30rpx 20rpx;
}
.team_box,.team_my{
	border-radius: 15rpx;
	background: #091941;
}
.team_item{
	border-bottom: 1rpx solid #12224C;
	padding: 20rpx 20rpx;
}
.team_item:last-child{
	border-bottom: none;
}
/* .team_pic{
	float: left;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	overflow: hidden;
}
.team_pic image{
	width: 100%;
	height: 100%;
	border-radius: 50%;
} */
.team_name,
.team_lv{
	float: left;
	margin-left: 20rpx;
}
.team_name text{
	display: block;
}
.team_name text:nth-child(2){
	color: #999;
	font-size: 28rpx;
}
/* .team_lv{
	float: right;
	border-radius: 6rpx;
	border: 1px solid #fcc44d;
	color: #fcc44d;
	font-size: 24rpx;
	padding: 0 10rpx;
	line-height: 1.4;
	margin-top: 38rpx;
} */
.team_num{
	float: right;
	text-align: right;
	color: #FCC44D;
}
.team_num text{
	font-size: 28rpx;
}

.team_my_lv{
	border-bottom: 1rpx solid #12224C;
	padding-bottom: 30rpx;
}
.team_my_lv text{
	border-radius: 10rpx;
	color: #FCC44D;
	font-size: 24rpx;
	border:1px solid #FCC44D;
	padding: 0 10rpx;
	margin-left: 20rpx;
}
.team_my_info{
	display: flex;
	padding: 40rpx 0 0;
}
.team_my_info>view{
	flex: 1;
}
.team_my_info>view:nth-child(2){
	border-left: 1px solid #12224C;
}
.team_my_info view text{
	display: block;
	text-align: center;
	font-size: 28rpx;
}
.team_my_info view text:nth-child(2){
	color: #FCC44D;
	padding-top: 10rpx;
}

</style>
