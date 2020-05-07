<template>
	<view>
		<!-- 编辑收货地址 -->
		<auto-nav-bar
			leftShow
			rightText="完成"
			@clickLeft="handleLeftClick"
			@clickRight="handleDefine"
			title="修改昵称"
		>
		</auto-nav-bar>	
		
		<view class="main-box">
			<view class="consignee_list clearfix">
				<label>昵称</label>
				<input class="uni-input" placeholder="请输入昵称" v-model="nickName"  />
			</view>
		</view>
	</view>
</template>

<script>
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapMutations,
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState([ 'userInfo']),
		data() {
			return {
				nickName:""
			}
		},
		onLoad:function(){
			this.nickName = this.userInfo.accountinfo.data.nickname;
		},
		methods: {
			...mapMutations(['login']),
			handleLeftClick(){
				uni.navigateBack({
					delta:1
				})
			},
			// 提交api 更新缓存，返回上一页
			handleDefine(){
				let _this = this
				console.log(this.nickName)
				if(!this.nickName){
					uni.showToast({
						title:"昵称不可为空！",
						icon:"none"
					})
					return
				}
				uni.showLoading()
				let userid = decode(this.userInfo.data);
				let image = this.userInfo.accountinfo.data.icon;
				this.$API.updatenickname({img:"",nickname:this.nickName,userid}).then(res => {
					console.log("更新昵称",res)
					uni.hideLoading()
					if(res.statusCode == 200){
						uni.showToast({
							title:"成功",
							icon:"none"
						})
						console.log(this.nickName)
						this.$store.state.userInfo.accountinfo.data.nickname = this.nickName;
						this.login(this.userInfo)
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title:"系统错误",
							icon:"none"
						})
					}
				}).catch(err => {
					uni.hideLoading()
					// error
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
.consignee_list{
		border-bottom: 1px solid #12224C;
		padding: 40rpx 0 20rpx;
		display: flex;
	}
	.consignee_list.address_tag{
		display: block;
	}
	.consignee_list label{
		float: left;
		font-size: 32rpx;
		min-width: 130rpx;
	}
	.consignee_list .uni-input{
		flex: auto;
		font-size: 32rpx;
	}
</style>
