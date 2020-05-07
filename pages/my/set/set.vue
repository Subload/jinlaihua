<template>
	<view>
		<auto-nav-bar
			leftShow
			title="设置"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="main-box">
			<!-- 设置内容 -->
			<project-list
				v-for="(item,index) in setList"
				:key="index"
				:title="item.title"
				:text="item.text"
				@clickBtn="handleClick(item)"
			/>
			<view style="position: absolute;left:0;bottom: 30rpx;font-size: 26rpx;text-align: center;width: 100%;text-decoration: underline;" @click="openAgreement">《风险告知书》</view>
		</view>
		
		
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	
	export default {
		data() {
			return {
				setList:[{
					title:"更新版本",
					// 版本号
					text:""
				},
				{
					title:"清理缓存",
					text:""
				},
				// {
				// 	title:"关于我们"
				// },
				// {
				// 	title:"留言反馈",
				// 	text:""
				// },
				{
					title:"退出登录",
					text:""
				}],
				fileSizeString:""
			}
		},
		onLoad:function(){
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				this.setList[0].text = 'v' + wgtinfo.version
			})
			this.formatSize()
		},
		methods: {
			...mapMutations(['logout']),
			handleLeftClick(){
				uni.navigateBack({});
			},
			
			// 点击协议
			openAgreement(){
				// plus.runtime.openURL("http://baidu.com")
				uni.navigateTo({
					url:"/pages/agreement/agreement"
				})
			},
			// 点击选项
			handleClick(item){
				switch(item.title)
				{
					case '退出登录':   // 订单页
						uni.showModal({
							content:"确定退出账号吗？",
							success:(res) => {
								if (res.confirm) {
									this.logout();
									uni.switchTab({
										url: "/pages/notice/notice"
									});
								}
							}
						})
						
					break;
					case '清理缓存':   // 清理缓存
						this.clearCache()
					break;
					case '更新版本':   // 更新版本
						uni.showLoading()
						let _this = this
						this.$API.getAppAzVersion().then((res)=>{
							console.log("检查版本信息",res)
							if(res.statusCode == 200){
								if(res.data.state == 0){
									uni.hideLoading()
									if(_this.setList[0].text != 'v'+res.data.data.version){
										uni.showModal({
											title:"更新提示",
											content:"是否更新至最新版金莱花",
											confirmText:"更新",
											success: (re) => {
												if (re.confirm) {
													console.log(res.data.data)
													plus.runtime.openURL(res.data.data.downurl)
												} else if (re.cancel) {
													console.log('用户点击取消');
												}
											}
										})
									}else{
										uni.showToast({
											title:"当前为最新版本",
											icon:"none"
										})
									}
								}else{
									uni.hideLoading()
									uni.showToast({
										title:"检查失败，请稍后重试",
										icon:"none"
									})
								}
							}else{
								uni.hideLoading()
								uni.showToast({
									title:"检查失败，请稍后重试",
									icon:"none"
								})
							}
						}).catch(err => {
							console.log(err)
							// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
							// 一个通用的错误提示组件就可以完成
						})
						// setTimeout(()=>{
						// 	uni.hideLoading()
						// 	uni.showToast({
						// 		title:"暂无更新版本",
						// 		icon:"none"
						// 	})
						// },3000)
					break;
				}
			},
			// 清理缓存
			clearCache() {
				uni.showLoading()
				let that = this;  
				let os = plus.os.name;  
				if (os == 'Android') {  
					let main = plus.android.runtimeMainActivity();  
					let sdRoot = main.getCacheDir();  
					let files = plus.android.invoke(sdRoot, "listFiles");  
					let len = files.length;  
					for (let i = 0; i < len; i++) {  
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {  
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.hideLoading()
									uni.showToast({  
										title: '缓存清理完成',
										icon:"none",
										duration: 2000  
									});  
									that.formatSize(); // 重新计算缓存  
								}, function(e) {
									uni.hideLoading()
									console.log(e.message)  
								});  
							} else {  
								entry.remove();  
							}  
						}, function(e) {
							uni.hideLoading()
							console.log('文件路径读取失败')  
						});  
					}  
				} else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
					plus.cache.clear(function() {
						uni.hideLoading()
						uni.showToast({  
							title: '缓存清理完成', 
							icon:"none",
							duration: 2000  
						});  
						that.formatSize();  
					});  
				}  
			},
			// 计算缓存大小
			formatSize() {  
				let that = this;  
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);  
					if (sizeCache == 0) {  
						that.fileSizeString = "0B";  
						that.setList[1].text = "0B"
					} else if (sizeCache < 1024) {  
						that.fileSizeString = sizeCache + "B";  
						that.setList[1].text = sizeCache + "B"
					} else if (sizeCache < 1048576) {  
						that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";  
						that.setList[1].text = (sizeCache / 1024).toFixed(2) + "KB"
					} else if (sizeCache < 1073741824) {  
						that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";  
						that.setList[1].text = (sizeCache / 1048576).toFixed(2) + "MB"
					} else {  
						that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";  
						that.setList[1].text = (sizeCache / 1073741824).toFixed(2) + "GB"; 
					}  
				});
				 console.log(that.fileSizeString)
			}
		}
	}
</script>

<style>

</style>
