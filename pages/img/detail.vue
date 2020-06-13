<template>
	<view class="index about">
		<cu-custom bgColor="bg-gradual-green" :isBack="true"><block slot="backText">查看图像</block></cu-custom>
		<view @tap="openActionSheet" class="customImg" :style="{height:screenHeight + 'px'}">
			<image v-if='!noFace' :src="url" mode="widthFix"></image>	
			<text v-else class="text-white text-lg">还未选择头像,点击屏幕以选择</text>
		</view> 
		
	</view>
</template>
<script>
	
	import metadata from '../../utils/metadata.js'
	import fileUtil from '../../utils/saveFile.js'
	
	export default {
		data() {
			return {
				url: '',
				screenHeight: '',
				noFace: false,
				type: '',
				items: []
			}
		},
		onLoad(e) {
			console.log(e)
			this.url = e.url
			this.type = e.type
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
			if (e.hasFace != null && e.hasFace != undefined && e.hasFace == 'true') {
				this.noFace = true
			}
			console.log(this.url)
		},
		onShareAppMessage() {
			
		},
		onNavigationBarButtonTap(e) {
			
		},
		methods: {
			openActionSheet(){
				let _this = this
				console.log(this.type)
				if (this.type == 'qrcode') {
					return
				} else if (this.type == 'face'){
					this.items = ['从相册选择', '手机拍照']
					if (!this.noFace) {
						this.items.push('保存到手机')
					}
					uni.showActionSheet({
						itemList: this.items,
						success: function(res) {
							if (res.tapIndex == 0) {
								uni.chooseImage({
								    count: 1, //默认9
								    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
								    sourceType: ['album'], //从相册选择
								    success: function (res) {
								        console.log(JSON.stringify(res.tempFilePaths));
										uni.navigateTo({
											url: '../account/settings/avatarcropper?url=' + res.tempFilePaths[0]
										})
								    },
									fail: function(res) {
										uni.showToast({
											icon: 'none',
											position: 'top',
											title: '打开相册失败'
										})
									}
								});
							} else if (res.tapIndex == 1){
								uni.chooseImage({
								    count: 1, //默认9
								    sizeType: ['original'], //可，默认二者都有
								    sourceType: ['camera'], //拍照
								    success: function (res) {
								        console.log(JSON.stringify(res.tempFilePaths));
										uni.navigateTo({
											url: '../account/settings/avatarcropper?url=' + res.tempFilePaths[0]
										})
								    },
									fail: function(res) {
										uni.showToast({
											icon: 'none',
											position: 'top',
											title: '打开相机失败'
										})
									}
								});
							} else if (res.tapIndex == 2) {
								console.log('保存中...')
								fileUtil.saveImg(_this.url, '头像')
							}
						}
					})
				}
			}
			
		}
	}
</script>

<style>
	
	@import url("../../common/common.css");
	
	page {
		background-color: #000;
		height: 100%;
	}
	
	.about {
		flex-direction: column;
		flex: 1;
	}
	
	.customImg {
		flex: 1;
		flex-direction: column;
		justify-content: center;
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
