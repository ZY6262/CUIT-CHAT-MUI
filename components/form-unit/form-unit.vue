<template>
	<view>
		<view @tap="tapFunc" class="cu-list menu" :class="['sm-border', marginTop ? 'margin-top' : '']">
			<view class="cu-item" :class="'arrow'">
				<view class="content">
					<image :src="leftIconPath" class="png" mode="aspectFit"></image>
					<text class="text-grey">{{desc}}</text>
				</view>
				<view class="action">
					<view class="cu-tag round bg-red sm" v-if='badge > 0'>{{badge > 99 ? '99+' : badge}}</view>
				</view>
			</view>
		</view>
	</view>
	
	<!-- <view class="cu-item ">
		<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
		<view class="content">
			<view class="text-pink"><view class="text-cut">莫甘娜</view></view>
			<view class="text-gray text-sm flex"> <view class="text-cut">凯尔，你被自己的光芒变的盲目！</view></view>
		</view>
		<view class="action">
			<view class="text-grey text-xs">22:20</view>
			<view class="cu-tag round bg-red sm">5</view>
		</view>
	</view> -->
</template>

<script>
	export default {
		props: {
			desc: String,
			showBorder: Boolean,
			leftIconPath: String,
			rightIconPath: String,
			marginTop: {
				type: Boolean,
				default: true
			},
			tapFunc: {
				type: Function,
				default: null
			},
			badge: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onShow: (e) => {
			console.log(this.$attrs.showBorder)
		}
	}
</script>

<style>
</style>
