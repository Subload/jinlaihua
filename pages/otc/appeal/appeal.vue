<template>
    <view class="page">
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
			title="申诉"
		>
		</auto-nav-bar>	
		
		<view class='feedback-title'>
		    <text>申诉类型</text>
		</view>
		<view class="feedback-body appealType" @click="chooseAppealtype">
		    {{appealtype[this.sendDate.appealtype]}}
			<view><image src="/static/details/Currencydetails@3x.png" mode="aspectFill"></image></view>
		</view>
        <view class='feedback-title'>
            <text>申诉原因</text>
            <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
        </view>
        <view class="feedback-body">
            <textarea placeholder="请详细描述你申诉的原因" v-model="sendDate.notes" class="feedback-textare" />
            </view>
        <view class='feedback-title'>
            <text>请提供可提供证明的截图（订单时间、收付款截图等）</text>
        </view>
        <view class="feedback-body feedback-uploader">
            <view class="uni-uploader">
                <view class="uni-uploader-head">
                    <view class="uni-uploader-title">点击预览图片</view>
                    <view class="uni-uploader-info">{{imageList.length}}/8</view>
                </view>
                <view class="uni-uploader-body">
                    <view class="uni-uploader__files">
                        <block v-for="(image,index) in imageList" :key="index">
                            <view class="uni-uploader__file" style="position: relative;">
                                <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
                                <view class="close-view" @click="close(index)">x</view>
                            </view>
                        </block>
                        <view class="uni-uploader__input-box" v-show="imageList.length < 8">
                        	<view class="uni-uploader__input" @tap="chooseImg"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class='feedback-title'>
            <text>手机号码</text>
        </view>
        <view class="feedback-body">
            <input class="feedback-input" v-model="sendDate.phone" placeholder="方便我们联系你" />
        </view>
		<view class="clear30"></view>
		<view class="clear30"></view>
		<view class="clear30"></view>
        <button type="primary"  class="feedback-submit" @tap="send">提交</button>
    </view>
</template>

<script>
	import {
		decode,encode
	} from '@/utils/des3.js' // 参数加密方法
	import { regPhone } from '@/utils/util.js'
	import {
		mapState,
	} from 'vuex';
	
    export default {
		computed: mapState(['userInfo']),
        data() {
            return {
                msgContents: ["我已付款，对方未确认收款", "对方长时间未付款"],
				appealtype:["对方未付款","对方未放行","对方无应答","对方有欺诈行为","其他"],
                imageList: [],
                sendDate: {
					userid:"",
					orderid:"",
					appealtype:"0", //  0对方未付款 1对方未放行 2对方无应答 3对方有欺诈行为 4其他
                    notes: "",
                    phone: ""
                }
            }
        },
        onLoad(opacity) {
			this.sendDate.orderid = opacity.orderid
			this.sendDate.userid = decode(this.userInfo.data)
        },
        methods: {
			handleLeftClick(){
				uni.navigateBack()
			},
            close(e){
                this.imageList.splice(e,1);
            },
			chooseAppealtype() { //类型
			    uni.showActionSheet({
			        itemList: this.appealtype,
			        success: (res) => {
						this.sendDate.appealtype = res.tapIndex;
			        }
			    })
			},
            chooseMsg() { //快速输入
                uni.showActionSheet({
                    itemList: this.msgContents,
                    success: (res) => {
						this.sendDate.notes = this.msgContents[res.tapIndex];
                    }
                })
            },
            chooseImg() { //选择图片
                uni.chooseImage({
                    sourceType: ["camera", "album"],
                    sizeType: "compressed",
                    count: 8 - this.imageList.length,
                    success: (res) => {
                        this.imageList = this.imageList.concat(res.tempFilePaths);
                    }
                })
            },
            previewImage() { //预览图片
                uni.previewImage({
                    urls: this.imageList
                });
            },
            send() { //发送反馈
				if(this.sendDate.notes==""){
					uni.showModal({
						showCancel:false,
						content:"请输入申诉原因"
					})
					return
				}
				if(this.imageList.length == "0"){
					uni.showModal({
						showCancel:false,
						content:"请上传证明截图，以便我们快速帮您处理"
					})
					return
				}
				if(regPhone(this.sendDate.phone)){
					uni.showModal({
						showCancel:false,
						content:"请输入正确手机号码，以便我们快速联系您"
					})
					return
				}
				
				uni.showLoading({
					title:"提交中···"
				})
                let imgs = this.imageList.map((value, index) => {
                    return {
                        name: "photos",
                        uri: value
                    }
                })
                uni.uploadFile({
                    url: this.$API.appeal,
                    files: imgs,
                    formData: encode(this.sendDate),
                    success: (res) => {
						// console.log(res)
						uni.hideLoading()
                        if (res.statusCode == "200") {
							let resData = JSON.parse(res.data)
							if(resData.state =="0" && resData.message =="10202"){
								this.imageList = [];
								this.sendDate = {
									...this.sendData,
								    notes: "",
								    phone: ""
								}
								uni.showModal({
									content:"提交成功，申诉结果将以短信下发至您的注册手机号",
									showCancel:false,
									success: () => {
										uni.navigateBack({
											delta:2
										})
									}
								})
							}else{
								uni.showModal({
									content:"网络错误，请稍后重试",
									showCancel:false
								})
							}
                        }
                    },
                    fail: (res) => {
						uni.hideLoading()
                        uni.showToast({
                            title: "提交失败",
                            icon:"none"
                        });
                        console.log(res)
                    }
                });
            }
        }
    }
</script>

<style>
    @font-face {
    	font-family: uniicons;
    	font-weight: normal;
    	font-style: normal;
    	src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
    }
    view{
        font-size: 28upx;
    }
    .input-view {
        font-size: 28upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* 上传 */
    .uni-uploader {
    	flex: 1;
    	flex-direction: column;
    }
    .uni-uploader-head {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    }
    .uni-uploader-info {
    	color: #B2B2B2;
    }
    .uni-uploader-body {
    	margin-top: 16upx;
    }
    .uni-uploader__files {
    	display: flex;
    	flex-direction: row;
    	flex-wrap: wrap;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__input-box {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 2upx solid #D9D9D9;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
    	width: 4upx;
    	height: 79upx;
    }
    .uni-uploader__input-box:after {
    	width: 79upx;
    	height: 4upx;
    }
    .uni-uploader__input-box:active {
    	border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
    	background-color: #999999;
    }
    .uni-uploader__input {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    
    /*问题反馈*/
    .feedback-title {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    	padding: 20upx;
    	color: #8f8f94;
    	font-size: 28upx;
    }
    .feedback-star-view.feedback-title {
    	justify-content: flex-start;
    	margin: 0;
    }
    .feedback-quick {
    	position: relative;
    	padding-right: 40upx;
    }
    .feedback-quick:after {
    	font-family: uniicons;
    	font-size: 40upx;
    	content: '\e581';
    	position: absolute;
    	right: 0;
    	top: 50%;
    	color: #bbb;
    	-webkit-transform: translateY(-50%);
    	transform: translateY(-50%);
    }
    .feedback-body {
    	background: #091941;
    }
    .feedback-textare {
    	height: 200upx;
    	font-size: 34upx;
    	line-height: 50upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .feedback-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 20upx;
    	line-height: 50upx;
    }
    .feedback-uploader {
    	padding: 22upx 20upx;
    }
    .feedback-star {
    	font-family: uniicons;
    	font-size: 40upx;
    	margin-left: 6upx;
    }
    .feedback-star-view {
    	margin-left: 20upx;
    }
    .feedback-star:after {
    	content: '\e408';
    }
    .feedback-star.active {
    	color: #FFB400;
    }
    .feedback-star.active:after {
    	content: '\e438';
    }
    .feedback-submit {
		position: fixed;
		width: calc(100% - 40rpx);
		left: 0;
		bottom: 20rpx;
    	background: #FCC44D;
    	color: #FFFFFF;
    	margin: 20rpx;
    }
	.appealType{
		padding: 20rpx;
	}
	.appealType view{
		float: right;
		width: 50rpx;
		height: 50rpx;
	}
	.appealType view image{
		width: 30rpx;
		height: 30rpx;
	}
</style>
