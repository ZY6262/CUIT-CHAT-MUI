<template>
	<view class="about">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"></cu-custom>
		<view class="content">
			<view class="desc">
				<text class="code">飞聊：</text>
				 一款UniApp开发的跨平台前后端分离即时通讯应用
			</view>
			<view class="source">
				<view class="title">以下几点：</view>
				<view class="source-list">
					<view class="source-cell">
						<text space="nbsp">1. </text>
						<text class="text-mauve">Fane(Author)</text>
					</view>
					<view class="source-cell">
						<text space="nbsp">2. </text>
						<text class="text-mauve">仅供学习，严禁商用</text>
					</view>
					<view class="source-cell">
						<text space="nbsp">3. </text>
						<u-link class="link" :href="'https://github.com/BF321/CUIT-CHAT-MUI'" :text="'https://github.com/BF321/CUIT-CHAT-MUI/'"></u-link>
					</view>
					<view class="source-cell">
						<text space="nbsp">4. </text>
						<u-link class="link" :href="'https://github.com/BF321/CUIT-CHAT-JAVA'" :text="'https://github.com/BF321/CUIT-CHAT-JAVA/'"></u-link>
					</view>
				</view>
			</view>
		</view>
		<view class="version">
			当前版本：{{version}}
		</view>
	</view>
</template>

<script>
	import uLink from '@/components/uLink.vue'
	export default {
		components: {
			uLink
		},
		data() {
			return {
				providerList: [],
				version: '2.0.0'
			}
		},
		onLoad() {
			
		},
		methods: {
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
	}

	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	image {
		width: 360rpx;
		height: 360rpx;
	}

	.about {
		flex-direction: column;
		flex: 1;
	}

	.content {
		flex: 1;
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
	}

	.qrcode {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.qrcode .tip {
		margin-top: 20rpx;
	}

	.desc {
		margin-top: 30rpx;
		display: block;
	}

	.code {
		color: #e96900;
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
		margin-top: 40rpx;
	}

	.version {
		height: 80rpx;
		line-height: 80rpx;
		justify-content: center;
		color: #ccc;
	}

	.source {
		margin-top: 30rpx;
		flex-direction: column;
	}

	.source-list {
		flex-direction: column;
	}

	.link {
		color: #007AFF;
	}
</style>
