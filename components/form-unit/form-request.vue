<template>
	<view class="cu-item">
		<view class="cu-avatar radius lg" :style="'background-image:url(' + fastdfsUrl + faceImg +');'"></view>
		<view class="content">
			<view class="text-pink"><view class="text-cut">{{nickname}}</view>
				<view :class="sex ? 'text-blue cuIcon-male' : 'text-red cuIcon-female'" style="margin-left: 5rpx; position: static;"></view>
			</view>
			<view class="text-gray text-sm flex"> <view class="text-cut">{{desc}}</view></view>
		</view>
		<view class="action">
			<button @tap="agreeFunc" class="cu-btn bg-mauve round sm shadow">同意</button>
			<button @tap="refuseFunc" class="cu-btn bg-red round sm shadow">拒绝</button>
		</view>
	</view>
</template>

<script>
	
	import metadata from '../../utils/metadata.js'
	
	export default {
		
		props: {
			desc: {
				type: String,
				default: '请求添加您为好友'
			},
			userId: {
				type: String,
				default: ''
			},
			agreeFunc: {
				type: Function,
				default: function(){
					console.log('点击同意按钮')
				}
			},
			refuseFunc: {
				type: Function,
				default: function(){
					console.log('点击拒绝按钮')
				}
			},
			nickname: {
				type: String,
				default: '周星驰'
			},
			faceImg: {
				type: String,
				default: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg'
			},
			sex: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				fastdfsUrl: metadata.fastdfsUrl
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
