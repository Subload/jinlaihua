<script>
	import {  
	        mapMutations  
	    } from 'vuex'; 
	export default {
		onLaunch: function() {
			// 刷新后重新从缓存获取用户信息
			try {
			    const hasLogin = uni.getStorageSync('hasLogin')||'';
			    const userInfo = uni.getStorageSync('userInfo')||'';
			    if (hasLogin) {
					this.$store.state.hasLogin = true;
					this.$store.state.userInfo = userInfo;
					
					var version = "";
					let _this = this;
					plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
						version = wgtinfo.version
					})
					
					this.$API.getAppAzVersion().then((res)=>{
						console.log("检查版本信息",res)
						if(res.statusCode == 200){
							if(res.data.state == 0){
								uni.hideLoading()
								if(version != res.data.data.version){
									uni.showModal({
										title:"更新提示",
										content:"是否更新至最新版金莱花",
										confirmText:"更新",
										success: (re) => {
											if (re.confirm) {
												plus.runtime.openURL(res.data.data.downurl)
											} else if (re.cancel) {
											}
										}
									})
								}
							}
						}
					}).catch(err => {
						// error
					})
				}
			} catch (e) {
			    // error
			}
		},
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['login','logout']),
		}
	}
</script>

<style>
	@import '/components/loading-min/loading.min.css';
	/*每个页面公共css */
	uni-page{
		overflow-x: hidden;
	}
	uni-swiper-item,
	uni-swiper .uni-swiper-wrapper{
		overflow: visible;
	}
	
	page{
		background: #081432;
	}
	html{
		background: #081432;
		color: #fff;
		font-weight: 300;
	}
	body{
		font-size: 32rpx;
	}
	.clear30{
		height: 30rpx;
	}
	.clear15{
		height: 15rpx;
	}
	/* 边距 */
	.main-box{
		padding: 0 30rpx;
	}
	/* 按钮样式 */
	.btn{
		line-height: 100rpx;
		background: #d89d1e;
		color: #fff;
		font-size: 36rpx;
		text-align: center;
	}
	/* 清除浮动 */
	.clearfix {
	    zoom: 1
	}
	.clearfix:before {
	    content: "";
	    display: table
	}
	.clearfix:after {
	    content: "";
	    display: table;
	    clear: both;
	    overflow: hidden
	}
	/* swiper指示点样式覆盖 */
	uni-swiper{
		height: 254rpx;
	}
	uni-swiper .uni-swiper-dots-horizontal{
		bottom: auto;
		top: 250rpx;
	}
	uni-swiper .uni-swiper-dot{
		width: 32rpx;
		height: 4rpx;
		border-radius: inherit;
	}
	image,img{
		will-change: transform
	}
	
	/* 单选框 */
	uni-radio .uni-radio-input{
		border: none;
		background-image: url(/static/pay/noCheck@3x.png);
		background-size: contain;
		background-color: inherit !important;
		border: none !important;
	}
	uni-radio .uni-radio-input.uni-radio-input-checked{
		background-image: url(/static/pay/check@3x.png);
	}
	uni-radio .uni-radio-input.uni-radio-input-checked:before{
		content: none !important;
	}
	
</style>
