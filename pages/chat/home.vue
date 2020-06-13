<template name="basics">
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-gradual-red" :isBack="false"><block slot="content">{{text}}</block></cu-custom>
			
			<view class="cu-list menu-avatar">
				<view :key='index' :id='index'  @tap="openChat" class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item, index) in friends"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<view class="cu-avatar round lg" :style="'background-image:url(' + fastdfsUrl + item.sendFaceImg + ');'"></view>
					<view class="content">
						<view class="text-grey"> {{item.sendNickName}}</view>
						<view class="text-gray text-sm" v-if="snapShot[index].msgType == 'text'">
							<text class="cuIcon-text text-gray margin-right-xs"></text>
							<block v-if="snapShot[index].content!=null&&snapShot[index].content!=undefined">{{snapShot[index].content.length>=30?'消息过长不予展示':snapShot[index].content}}</block>
						</view>
						<view class="text-gray text-sm" v-else-if="snapShot[index].msgType == 'audio'">
							<text class="cuIcon-sound text-gray margin-right-xs"></text>语音消息
						</view>
						<view class="text-gray text-sm" v-else-if="snapShot[index].msgType == 'image'">
							<text class="cuIcon-pic text-gray margin-right-xs"></text>图片消息
						</view>
					</view>
					<view class="action">
						<view class="text-white text-xs">0</view>
						<view :class="['cu-tag round sm', snapShot[index].badge > 0 ? 'bg-red' : 'bg-white']"><text :style="snapShot[index].badge > 0 ? '' : 'color: white'">{{snapShot[index].badge}}</text></view>
					</view>
					<view class="move">
						<view class="bg-grey" @longpress="snapShotUnshift" :id="index" >置顶</view>
						<view class="bg-red" @longpress="snapShotDel" :id="index + 1" >删除</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	
	import formChat from '@/components/form-unit/form-chat.vue'
	import metadata from '../../utils/metadata.js'
	import friendsPlus from '../../store/friendsplus.js'
	import chatMsgPlus from '../../store/chatmsgrecordsplus.js'
	
	export default {
		components: {formChat},
		data() {
			return {
				fastdfsUrl: metadata.fastdfsUrl,
				text: '聊天',
				snapShot: [],
				friends: [],
				listTouchStart: 0,
				listTouchDirection: null,
				modalName: null
			};
		},
		methods: {
			openChat(e){
				console.log('打开聊天页面----')
				let index = e.currentTarget.id
				let tmp = JSON.stringify(this.friends[index])
				uni.navigateTo({
					url: '../account/chat/template?condition=' + tmp
				})
			},
			
			changeFriends(){
				this.friends = []
				console.log('快照过滤')
				var badgeCount = 0;
				this.snapShot.forEach(elem => {
					badgeCount += elem.badge
					this.findFriendById(elem.isSender ? elem.receiveId : elem.senderId)
				})
				console.log('快照是' + JSON.stringify(this.snapShot))
				console.log('friends是' + JSON.stringify(this.friends))
				console.log('receiveMsgbadge是' + badgeCount)
				uni.$emit('receiveMsgbadgeChange', badgeCount)
			},
			
			findFriendById(id){
				console.log('过滤的ID是' + id)
				let friendList = friendsPlus.getStorageFriendsList();
				for(let i = 0; i < friendList.length; i++) {
					if (friendList[i].sendUserId == id) {
						this.friends.push(friendList[i])
						return;
					} 
				}
			},
			
			snapShotUnshift(e){
				let index = e.currentTarget.id
				let tmp = this.snapShot[index]
				this.snapShot.splice(index, 1)
				this.snapShot.unshift(tmp)
				chatMsgPlus.setChatSnapshot(this.$store.state.user.id, this.snapShot)
			},
			
			snapShotDel(e){
				console.log('删除快照')
				console.log(e)
				let index = e.currentTarget.id
				let tmp = this.snapShot[index - 1]
				this.snapShot.splice(index - 1, 1)
				chatMsgPlus.setChatSnapshot(this.$store.state.user.id, this.snapShot)
			},
			
			initSnapShot(){
				let tmp = chatMsgPlus.getChatSnapshot(this.$store.state.user.id)
				this.snapShot = tmp
			},
			
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		
		},
		watch: {
			snapShot(val) {
				console.log('快照发生了变化')
				this.changeFriends()
			}
		},
		onShow() {
			console.log("success")
		},
		mounted: function(){
			let _this = this
			uni.$on('refreshSnapShot', function(res){
				console.log('接受了refreshSnapShot')
				_this.snapShot = res
			});
			this.initSnapShot()
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
