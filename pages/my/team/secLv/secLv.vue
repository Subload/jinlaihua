<template>
	<view>
		<auto-nav-bar
			leftShow
			title="二级团队"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>
		<view class="main-box">
			<view class="clear30"></view>
			<view class="team_box">
				<xw-empty :isShow="emptyShow" text="暂无下级" textColor="#ddd"></xw-empty>
				
				<view class="team_item clearfix" v-for="(item, index) in teamList" :key="index">
					<view class="team_name">
						<text>{{item.nickname}}</text>
						<text>{{item.utel}}</text>
					</view>
					<!-- <view class="team_lv" v-html="item.setnumber">{{item.setnumber}}</view> -->
					<view class="team_num">
						<text>认购JLH.MP数量:</text><br/>{{item.setnumber}}
					</view>
				</view>
			</view>
		</view>
		<view class="clear30"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:"",
				teamList:[],
				// 无商品状态
				emptyShow:false, //true显示，false隐藏
			}
		},
		onLoad:function(option){
			this.uid = option.uid;
			this.getSubordinate(option.uid);
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({});
			},
			
			// 获取团队列表
			getSubordinate(uid){
				uni.showLoading()
				this.$API.getSubordinate({userid:uid}).then(res => {
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
.team_box{
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
.team_name{
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
.team_num{
	float: right;
	text-align: right;
	color: #FCC44D;
}
.team_num text{
	font-size: 28rpx;
}
</style>
