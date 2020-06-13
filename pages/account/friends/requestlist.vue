<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">请求列表</block></cu-custom>
		<scroll-view scroll-y="true" class="page">
			<view class="cu-list menu-avatar">
				<block v-for="(item, index) in requestList">
					<view class="cu-item" :key='index'>
						<view class="cu-avatar radius lg" :style="'background-image:url(' + fastdfsUrl + item.sendFaceImg +');'"></view>
						<view class="content">
							<view class="text-pink"><view class="text-cut">{{item.sendNickName}}</view>
								<view :class="item.sendSex ? 'text-blue cuIcon-male' : 'text-red cuIcon-female'" style="margin-left: 5rpx; position: static;"></view>
							</view>
							<view class="text-gray text-sm flex"> <view class="text-cut">请求添加你为好友</view></view>
						</view>
						<view class="action">
							<button @tap="agreeFunc" :id='index' class="cu-btn bg-mauve round sm shadow">同意</button>
							<button @tap="refuseFunc" :id='index' class="cu-btn bg-red round sm shadow" style="margin-top: 10rpx;">拒绝</button>
						</view>
					</view>
				</block>	
			</view>
		</scroll-view>
	</view>
</template>

<script>
	
	import formRequest from '../../../components/form-unit/form-request.vue'
	import friendService from '../../../service/FriendService.js'
	import metadata from '../../../utils/metadata.js'
	
	export default {
		components: {
			formRequest
		},
		data() {
			return {
				requestList: [],
				fastdfsUrl: metadata.fastdfsUrl
			}
		},
		methods: {
			agreeFunc(e){
				console.log('同意')
				console.log(e)
				let elem = this.requestList[e.currentTarget.id]
			    friendService.operateRequest(elem.sendUserId, true, e.currentTarget.id, this);
			},
			refuseFunc(e){
				console.log('拒绝')
				console.log(e)
				let elem = this.requestList[e.currentTarget.id]
				friendService.operateRequest(elem.sendUserId, false, e.currentTarget.id, this);
			}
		},
		onLoad(e){
			this.$store.commit('clearFriendRequest')
			friendService.loadAllRequest(this);
		},
		watch: {
			requestList(val) {
				console.log('requestList加载成功')
			}
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}
	
	.page.show {
		overflow: hidden;
	}
</style>
