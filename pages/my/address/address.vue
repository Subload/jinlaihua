<template>
	<view>
		<!-- 收货地址 -->
		<auto-nav-bar
			leftShow
			title="收货地址"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="clear30"></view>
		
		<!-- <xw-empty :isShow="addressData.length>0?false:true" text="暂无相关数据" textColor="#ddd"></xw-empty> -->
		<xw-empty :isShow="emptyShow" text="暂无收货地址" textColor="#ddd"></xw-empty>
		
		<!-- <view class="main-box"> -->
			<view class="clearfix address_list" v-for="(item, index) in addressData" :key="index" >
				<view class="address_list_text" @click="getCoupon(item)">
					<view class="clearfix address_list_text_name">
						<text>{{item.username}}</text>
						<text>{{item.phone}}</text>
						<text class="address_list_text_tag" v-if="!item.consent">默认</text>
					</view>
					<view class="address_list_text_add">{{item.province + item.city + item.area + '  ' + item.address}}</view>
				</view>
				<view class="address_list_edit" @click="handleAddressEdit(item)">修改</view>
			</view>
			
			<view class="clear30"></view>
			<view class="clear30"></view>
		<!-- </view> -->
		<view class="btn address_btn" @click="handleAddressAdd">新建收货地址</view>
		
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue' // 标签
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState([ 'hasLogin','userInfo']),
		components:{uniTag},
		data() {
			return {
				addressData:[],
				emptyShow:false
			}
		},
		onLoad:function(){
			
		},
		onShow:function(){
			uni.showLoading()
			this.getreceivingAddressByidList()
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			handleAddressEdit(item){
				uni.navigateTo({
					url: "/pages/my/consignee/consignee?item=" + encodeURIComponent(JSON.stringify(item)),
				});
			},
			handleAddressAdd(){
				uni.navigateTo({
					url: "/pages/my/consignee/consignee",
				});
			},
			getCoupon(value){
				let pages = getCurrentPages();             //获取所有页面栈实例列表
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				if(!prevPage.$vm.address){
					return false;
				}
				prevPage.$vm.address = {...value};         //修改上一页data里面的couponNumber参数值为value
				uni.navigateBack({                         //uni.navigateTo跳转的返回，默认1为返回上一级
				    delta: 1
				});
			},
			getreceivingAddressByidList(){
				let userid = decode(this.userInfo.data)
				this.$API.getreceivingAddressByidList({userid,start:0,limit:99}).then(res => {
					// console.log("用户地址列表",res)
					uni.hideLoading()
					if(res.data.data && res.data.data.length>0){
						this.emptyShow = false;
						this.addressData = res.data.data;
					}else{
						this.emptyShow = true;
					}
				}).catch(err => {
					// error
					uni.hideLoading();
					this.emptyShow = true;
					uni.showToast({
					    title: err.text,
						icon: 'none',
					});
					console.log(err)
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			}
			
		}
	}
</script>

<style>
	.address_btn{
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		z-index: 999;
	}
	.address_list{
		border-bottom: 1px solid #12224C;
		padding: 20rpx 30rpx;
	}
	.address_list_text{
		float: left;
		width: 630rpx;
	}
	.address_list_edit{
		float: left;
		width: 60rpx;
		font-size: 28rpx;
		line-height: 70rpx;
	}
	.address_list_text_name{
		margin-bottom: 10rpx;
	}
	.address_list_text_name>*{
		float: left;
	}
	.address_list_text_name .address_list_text_tag{
		font-size: 20rpx;
		background: #FF3E3E;
		line-height: 1.6;
		padding: 0 10rpx;
		border-radius: 6rpx;
		transform: translateY(8rpx);
	}
	.address_list_text_name text{
		font-size: 32rpx;
		margin-right: 30rpx;
		line-height: 1.2;
	}
	.address_list_text_add{
		font-size: 24rpx;
		padding-top: 10rpx;
	}
</style>
