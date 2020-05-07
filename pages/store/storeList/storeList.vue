<template>
	<view>
		<auto-nav-bar
			leftShow
			:title="title"
			@clickLeft="handleLeftClick"
		></auto-nav-bar>	
		
		<view class="main-box">
			<view class="clearfix" v-if="proData.length">
				<product-list
					v-for="(proItem, index) in proData"
					:key="index"
					:picUrl="proItem.picUrl"
					:title="proItem.title"
					:price="proItem.price"
				></product-list>
			</view>
			<view v-else>
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"",
				proData:[]
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.id = option.id;
			this.title = option.title;
			
			// 拿到上页点击id 获取数据列表
			
		},
		onShow: function () {
			uni.showLoading({
			    title: '加载中'
			});
			setTimeout(() => {
				 uni.hideLoading();
			},5000)
		},
		methods: {
			handleLeftClick(){
				uni.hideLoading();
				uni.navigateBack({});
			}
		}
	}
</script>

<style>

</style>
