<template>
	<view>
		<!-- 收款方式 paymentMethod -->
		<auto-nav-bar
			leftShow
			title="安全中心"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view>
			<view class="paymentMethod_list clearfix" @click="editPhone">
				<text class="paymentMethod_name">绑定手机号</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">绑定</view>
			</view>
			<view class="paymentMethod_list clearfix" @click="editPassword">
				<text class="paymentMethod_name">登录密码</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">修改</view>
			</view>
			<view class="clear15"></view>
			<view class="paymentMethod_list clearfix" @click="editTradePassword">
				<text class="paymentMethod_name">交易密码</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">{{userInfo.accountinfo.data.tradpassword == 0?"未设置":"修改"}}</view>
			</view>
			<view v-if="userInfo.accountinfo.data.senior == 0 ||userInfo.accountinfo.data.senior == 2"  class="paymentMethod_list clearfix" @click="editRealName">
				<text class="paymentMethod_name">实名认证</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">{{userInfo.accountinfo.data.senior == 0?"未实名":"审核失败"}}</view>
			</view>
			<view  v-if="userInfo.accountinfo.data.senior == 1 ||userInfo.accountinfo.data.senior == 3"  class="paymentMethod_list clearfix" >
				<text class="paymentMethod_name">实名认证</text>
				<view class="paymentMethod_right">
					<image class="pro-list-img" src="/static/my/arrow@3x.png" mode="aspectFit"></image>
				</view>
				<view class="paymentMethod_set">{{userInfo.accountinfo.data.senior == 1?"审核中":"已审核"}}</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		
		data() {
			return {
				
			}
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 修改密码
			editPassword(){
				uni.navigateTo({
					url: '/pages/my/editPassword/editPassword',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 修改交易密码
			editTradePassword(){
				uni.navigateTo({
					url: '/pages/my/editTradePassword/editTradePassword',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 修改交易密码
			editPhone(){
				uni.navigateTo({
					url: '/pages/my/editPhone/editPhone',
					fail: (res) => {
						console.log(res)
					}
				});
			},
			// 修改交易密码
			editRealName(){
				uni.navigateTo({
					url: '/pages/my/editRealName/editRealName',
					fail: (res) => {
						console.log(res)
					}
				});
			}
		}
	}
</script>

<style>
.paymentMethod_list{
	border-bottom: 1px solid #12224C;
	padding: 20rpx 0 20rpx 30rpx;
	font-size: 32rpx;
	background: #091941;
}
.paymentMethod_name,
.paymentMethod_set{
	line-height: 80rpx;
	margin: 0 15rpx;
}
.paymentMethod_set{
	float: right;
	color: #D89D1E;
	font-size: 28rpx;
}
.paymentMethod_right{
	float: right;
	margin-top: 15rpx;
	width: 60rpx;
	height: 60rpx;
}
.paymentMethod_right image{
	width: 100%;
	height: 100%;
}
</style>
