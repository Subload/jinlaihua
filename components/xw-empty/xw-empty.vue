<template>
	<view class="nodata" v-if="isShow">
		<image :src="baseImg" mode="widthFix" class="empty_image"></image>
		<text :style="{color:textColor}">{{ text }}</text>
	</view>
</template>

<script>
export default {
	name: 'xw-empty',
	props: {
		//text
		text: {
			type: String,
			default: '暂无数据'
		},
		img: {
			type: String,
			default: '/static/images/other/nodata.png'
		},
		textColor:{
			type: String,
			default: '#999999'
		},
		isShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			baseImg:
				'/static/mescroll-empty.png'
		};
	},
	methods: {}
};
</script>

<style lang="scss">
.nodata {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 400rpx;
	width: 100%;
	align-items: center;
	color: #555555;
	font-size: 24rpx;
	
}
.empty_image {
		width: 200rpx !important;
		margin-bottom: 50rpx;
	}
</style>
