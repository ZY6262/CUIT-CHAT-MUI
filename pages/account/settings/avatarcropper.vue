<template>
	<view class="index">
		<cu-custom :backNumber='2' bgColor="bg-gradual-green" :isBack="true"><block slot="backText">编辑头像</block></cu-custom>
		<view class="customImg" :style="{height:screenHeight + 'px'}">
			<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
			<image :src="cropFilePath" mode="aspectFit" style="width: 100%;"></image>
		</view>
		<!-- <cu-custom bgColor="bg-gradual-green" :isBack="true"><block slot="backText">编辑头像</block></cu-custom>
		<text>进来了</text> -->
	</view>
</template>
<script>
	
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	import userService from '../../../service/UserService.js'	
	
	export default {
		data() {
			return {
				tempFilePath: '',
				cropFilePath: '',
				screenHeight: ''
			}
		},
		components: {ImageCropper},
		onLoad(e) {
			console.log(e)
			this.tempFilePath = e.url
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
		},
		methods: {
			confirm(e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath
				userService.updateAvatar(this.cropFilePath, this)
			},
			cancel() {
				uni.navigateBack({
					delta: 2
				})
			}
		},
	}
</script>

<style>
	
	@import url("../../../common/common.css");
	
	page {
		background-color: #000;
		height: 100%;
	}
	
	.customImg {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	swiper {
		flex: 1;
		width: 750upx;
		background-color: #000;
		display: flex;
		flex-direction: column;
	}

	swiper-item {
		display: flex;
		align-items: center;
	}

	image {
		width: 750upx;
		height: 1125upx;
	}
</style>
