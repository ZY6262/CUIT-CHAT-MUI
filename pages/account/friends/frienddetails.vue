<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">用户详情</block></cu-custom>
		<view class="cu-card case">
			<view class="cu-item shadow">
				<view style="padding: 30rpx;" hover-class="">
					<view style="height: 80rpx;">
						<view style="float: left; display: flex; flex-wrap: nowrap; align-items: center;">
							<text> {{friendDetails.nickname}} </text>
							<view :class="friendDetails.sex ? 'text-blue cuIcon-male' : 'text-red cuIcon-female'" style="margin-left: 5rpx; position: static;"></view>
						</view>
						
						<view class="cu-avatar xl radius" :style="friendDetails.faceImg == null ? 'background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg); float: right;' : 'background-image:url(' + fastdfsUrl + friendDetails.faceImg + '); float: right;'"></view>
					</view>
					<view v-if="friendDetails.address != null"><h3>{{friendDetails.address}}</h3></view>
					<view v-else><h3>Address</h3></view>
				</view>
				<view class="cu-item solids-top" style="padding: 20rpx 30rpx;">
					<view class="cu-item">
						<text class="text-grey">邮箱</text>
						<view style="display: inline-block; float: right;">
							<text class="text-gray">{{friendDetails.mail}}</text>
						</view>
					</view>
				</view>
				<view class="cu-item solids-top" style="padding: 20rpx 30rpx;">
					<view class="cu-item">
						<text class="text-grey">个性签名</text>
						<view style="display: inline-block; float: right;">
							<text v-if='friendDetails.description == null' class="text-gray">暂无个性签名</text>
							<text v-else class="text-gray">{{friendDetails.description}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flex padding justify-center">
				<button @tap="addFriend" :disabled="disabled" v-if='search' class="cu-btn bg-blue round lg shadow">添加好友</button>
				<button @tap="openChat" v-if='friend' class="cu-btn bg-blue round lg shadow">发送消息</button>
				<button @tap="deleteFriend" v-if='friend' class="cu-btn bg-red round lg shadow" style="margin-left: 60rpx;">删除好友</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	import userService from '../../../service/UserService.js'
	import metadata from '../../../utils/metadata.js'
	import friendService from '../../../service/FriendService.js'
	
	export default {
		data() {
			return {
				search: false,
				friend: false,
				friendDetails: {},
				fastdfsUrl: metadata.fastdfsUrl,
				disabled: false,
				tmpFriend: ''
			}
		},
		methods: {
			addFriend(){
				this.disabled = true
				if (this.$store.state.user.id == this.friendDetails.id) {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '不能添加自己为好友',
						duration: 5000
					})
					return;
				}
				console.log('添加为好友')
				friendService.sendFriendReq(this.friendDetails.id, this)
			},
			deleteFriend(){
				// 网络删除（通知另一方）
				friendService.deleteFriend(this.friendDetails.id, this)
			},
			openChat(){
				console.log('打开聊天页面----')
				uni.navigateTo({
					url: '../chat/template?condition=' + this.tmpFriend
				})
			}
		},
		onLoad(e){
			console.log('来到详情页面')
			if (e.type == 'friend') {
				this.friend = true
				this.tmpFriend = e.condition
				let tmp = JSON.parse(e.condition)
				this.friendDetails.nickname = tmp.sendNickName
				this.friendDetails.description = tmp.sendDescription
				this.friendDetails.faceImg = tmp.sendFaceImg
				this.friendDetails.sex = tmp.sendSex
				this.friendDetails.mail = tmp.sendMail
				this.friendDetails.id = tmp.sendUserId
			} else if (e.type == 'search') {
				console.log('马上查找好友了')
				this.search = true
				console.log(this.$store.state.token.token)
				userService.search(e.condition, this)	
			}
		}
	}
</script>

<style>

</style>
