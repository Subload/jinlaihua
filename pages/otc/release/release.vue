<template>
	<view>
		<auto-nav-bar
			leftShow
			@clickLeft="handleLeftClick"
		>
		<view slot="title">我要{{title=="buy"?"购买":"出售"}}</view>
		</auto-nav-bar>
		
		
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"buy"
			}
		},
		onLoad:function(option){
			this.title = option.title
		},
		methods: {
			handleLeftClick(){
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style>

</style>
