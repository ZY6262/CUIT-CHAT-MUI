<template>
	<view>
		<view class="cu-modal" :class="modalName=='Image'?'show':''">
			<view class="cu-dialog">
				<view class="bg-img" :style="'background-image: url(' + url + ');height:200px;'">
					<view class="cu-bar justify-end text-black">
						<view class="padding-xl text-black">
							<view class="padding-xs text-xxl text-bold text-black">
								功能正在抓紧开发中...
							</view>
							<view class="padding-xs text-lg">
								Sry, the function is under development
							</view>
						</view>
					</view>
					
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			modalName: {
				type: String,
				default: ''
			},
			description: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			hideModal(e) {
				console.log('通知父组件')
				this.$parent.$data.modalName = '';
			}
		}
	}
</script>

<style>
</style>
