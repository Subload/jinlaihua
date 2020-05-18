<template>
	<view>
		<!-- 编辑收货地址 -->
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			@clickRight="handleDelete"
		>
			<view slot="title">{{title}}</view>
		</auto-nav-bar>	
		
		<view class="main-box">
			<view class="consignee_list clearfix">
				<label>收货人</label>
				<input class="uni-input" placeholder="请输入收货人姓名" v-model="consigneeData.username"  />
			</view>
			<view class="consignee_list clearfix">
				<label>手机号码</label>
				<input class="uni-input" type="number" pattern="[0-9]*" placeholder="请输入手机号码" v-model="consigneeData.phone" />
			</view>
			<view class="consignee_list clearfix">
				<label>所在地址</label>
				<input class="uni-input" disabled @click="btnClick" type="text" placeholder="请输入地区" :value="consigneeData.province + consigneeData.city + consigneeData.area" />
			</view>
			<view class="consignee_list clearfix">
				<label>详细地址</label>
				<input class="uni-input"  placeholder="请输入详细地址" v-model="consigneeData.address"  />
			</view>
			<view class="consignee_list clearfix address_tag">
				<label>设置为默认地址</label>
				<view class="consignee_list_m">
					<switch color="#d89d1e" style="transform:scale(0.7)" :checked="consigneeData.consent==0?true:false"  @change="setDefaultAdd" />
				</view>
			</view>
		</view>
		
		<view class="clear30"></view>
		<view class="clear30"></view>
		
		<view class="btn consignee_btn" @click="handleConfirm">保存</view>
		<selectAddress ref='selectAddress' @selectAddress="successSelectAddress"></selectAddress>
	</view>
</template>

<script>
	import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue'
	import { regPhone } from '@/utils/util.js'
	import { decode } from '@/utils/des3.js' // 参数加密方法
	import {
		mapState
	} from 'vuex';
	export default {
		computed: mapState([ 'userInfo']),
		components: {
			selectAddress
		},
		data() {
			return {
				title:"新建收货人",
				showClearIcon: false,
				consigneeData:{
					submit: 0, // 0添加 1 修改
					uid: "",
					userid:"",
					address: "",
					province: "",
					city: "",
					area: "",
					phone: "",
					username: "",
					consent: 1 // 0 默认地址 1非默认
				},
			}
		},
		onLoad:function(option){
			if(option.item){
				this.title = "编辑联系人"
				this.consigneeData=JSON.parse(decodeURIComponent(option.item));
			}
		},
		methods: {
			// 返回
			handleLeftClick(){
				uni.navigateBack({});
			},
			// 删除
			handleDelete(){
				console.log("删除操作")
			},
			// 保存
			handleConfirm(){
				let that = this;
				this.consigneeData.userid = decode(that.userInfo.data)
				if(that.title == "新建收货人"){
					that.consigneeData.submit = 0;
				}else {
					that.consigneeData.submit = 1;
				}
				
				// 这里验证数据正确性
				if(regPhone(this.consigneeData.phone)){
					uni.showModal({
						content:"请输入正确手机号",
						showCancel:false
					})
					return
				}
				
				if(this.consigneeData.address == ""||this.consigneeData.province == ""||this.consigneeData.phone == ""||this.consigneeData.username == ""){
					uni.showModal({
						content:"请完善信息",
						showCancel:false
					})
					return
				}
				
				this.$API.setupaddress(that.consigneeData).then(res => {
					if(res.data.state == 0){
						uni.showToast({
							title:res.data.message,
							icon:"none",
							success: () => {
								setTimeout(() => {
									that.handleLeftClick()
								},2000)
							}
						})
					}
					// console.log("添加收货地址",res)
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
			
			// 显示地址选择
			btnClick() {
				this.$refs.selectAddress.show()
			},
			// 选择地址
			successSelectAddress(address){
				// console.log(address)
				this.consigneeData = {
					...this.consigneeData,
					province:address,
					city: "",
					area: ""
				}
			},
			// 设置默认地址
			setDefaultAdd(e){
				// console.log(e.target.value)
				if(e.target.value){
					this.consigneeData.consent = 0;
					return
				}
				this.consigneeData.consent = 1;
			},
		}
	}
</script>

<style>
	.consignee_btn{
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		z-index: 999;
	}
	.consignee_list{
		border-bottom: 1px solid #12224C;
		padding: 30rpx 0;
		display: flex;
	}
	.consignee_list.address_tag{
		display: block;
	}
	.consignee_list label{
		float: left;
		font-size: 28rpx;
		min-width: 130rpx;
	}
	.consignee_list .uni-input{
		flex: auto;
		font-size: 28rpx;
	}
	.consignee_list.address_tag .uni-label-pointer{
		transform: translateY(10rpx);
	}
	.consignee_list_m{
		float: right;
		display: inline-block;
	}
</style>
