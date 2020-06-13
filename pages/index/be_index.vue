<template>
	<view>
		<mine v-if="PageCur=='mine'"></mine>
		<discover v-else-if="PageCur=='discover'"></discover>
		<friends v-else-if="PageCur=='friends'"></friends>
		<chat v-else-if="PageCur=='chat'"></chat>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="chat">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/chat' + [PageCur == 'chat'?'_cur':''] + '.png'"></image>
					<view class="cu-tag badge" v-if="receiveMsgbadge != 0">
						<block v-if="receiveMsgbadge != 0">{{receiveMsgbadge > 99 ? '99+' : receiveMsgbadge}}</block>
					</view>
				</view>
				<view :class="PageCur=='chat'?'text-red':'text-gray'">聊天</view>
			</view>
			<view class="action" @click="NavChange" data-cur="friends">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/friends' + [PageCur == 'friends'?'_cur':''] + '.png'"></image>
					<view class="cu-tag badge" v-if="badge != 0">
						<block v-if="badge != 0">{{badge > 99 ? '99+' : badge}}</block>
					</view>
				</view>
				<view :class="PageCur=='friends'?'text-orange':'text-gray'">好友</view>
			</view>
			<view class="action" @click="NavChange" data-cur="discover">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/discover' + [PageCur == 'discover'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='discover'?'text-green':'text-gray'">发现</view>
			</view>
			<view class="action" @click="NavChange" data-cur="mine">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/mine' + [PageCur=='mine'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='mine'?'text-pink':'text-gray'">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import tokenPlus from '../../store/tokenplus.js'
	import ajax from '../../utils/ajax.js'
	import userPlus from '../../store/userplus.js'
	import metadata from '../../utils/metadata.js'
	import MessageModel from '../../common/MessageModel.js'
	import friendService from '../../service/FriendService.js'
	import friendsPlus from '../../store/friendsplus.js'
	import Record from '../../common/RecordModel.js'
	import chatMsgPlus from '../../store/chatmsgrecordsplus.js'
	import messageService from '../../service/MessageService.js'
	
	export default {
		data() {
			return {
				PageCur: 'mine',
				websocketUrl: metadata.websocketUrl,
				badge: 0,
				receiveMsgbadge: 0
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			changeBadge(){
				this.badge = this.friendRequest + this.groupRequest
			}
		},
		onLoad: function(){
			console.log('----------启动检查')
			console.log(JSON.stringify(tokenPlus))
			console.log(JSON.stringify(userPlus))
			let storageToken = tokenPlus.getStorageToken();
			let storageUser = userPlus.getStorageUser();
			let _this = this
			console.log(storageToken)
			console.log(storageUser)
			
			// 注册一个聊天消息角标变化监视器
			uni.$on('receiveMsgbadgeChange', function(res){
				console.log('收到了角标变化事件通知。receiveMsgbadge is ' + res)
				_this.receiveMsgbadge = res
			});
			if (storageUser == null || storageToken == '' || storageToken == null || storageToken == undefined) {
				console.log('准备跳转')
				// 跳转到登录页面
				uni.showModal({
				    title: '警告',
				    showCancel: false,
					confirmText: '我知道了',
					content: '检查到您未登录',
					complete: function(){
						uni.redirectTo({
							url: '../account/login'
						})
					}
				})
			} else {
				console.log('不准备跳转')
				if (storageUser != null) {
					console.log('更新User')
					console.log(storageUser)
					this.$store.commit('resetUser', storageUser);
				}
				// 请求新token
				console.log('更新Token')
				this.$store.commit('resetToken', storageToken);
				ajax.resetToken(this.$store);
				let timerId = setInterval(function(store){
					ajax.resetToken(store)
				}, 50 * 60 * 1000, this.$store)
				this.$store.commit('resetTimer', timerId)
				// 启动websocket
				let socketTask = uni.connectSocket({
					url: this.websocketUrl,
					success: function(){
						console.log('websocket打开成功')
					},
					fail: function(){
						console.log('websocket打开失败')
					}
				});
				socketTask.onOpen(function(res){
					// 当连接上Netty服务器马上发送一个身份标识信息
					let senderId = _this.$store.state.user.id
					let model = new MessageModel(senderId, null, null, null, null, 'CONNECT', null)
					socketTask.send({
						data: JSON.stringify(model),
						success: function(){
							console.log('身份标识信息已发送')
						}
					})
					// 定时发送心跳包
					let keepAliveMsg = new MessageModel(senderId, null, null, null, null, 'KEEP_ALIVE', null)
					setInterval(function(param){
						console.log('定时执行心跳任务')
						param.socketTask.send({
							data: JSON.stringify(param.msg)
						})
					}, 30000, {socketTask: socketTask, msg: keepAliveMsg});
				});
				socketTask.onMessage(function(data){
					console.log('监听 WebSocket 接受到服务器的消息事件')
					// console.log(JSON.stringify(data))
					console.log(data.data)
					let res = JSON.parse(data.data)
					 console.log(data.data instanceof String)
					console.log("data action is " + res.action)
					if (res.action == 'FRIEND_REQUEST') {
						console.log('更新角标')
						_this.$store.commit('resetFriendRequest', 1)
					} else if (res.action == 'FRIEND_REQUEST_AGREE' || res.action == 'FRIEND_DELETE') {
						console.log('好友关系有变动')
						friendService.fetchFriendsList(_this)
						let tmp = friendsPlus.getStorageFriendsList()
						uni.$emit('refreshFriendsList', tmp)
					} else if (res.action == 'IS_NOT_FRIEND') {
						console.log('对方不是你的好友，消息发送失败')
						console.log(res.payload)
						console.log(res.payload.senderId)
						// 通过消息ID更新消息记录的isFriend值就行了,可管可不管快照
						var tmp = chatMsgPlus.getChatMsgRecords(_this.$store.state.user.id, res.payload.receiveId)
						tmp.forEach(elem => {
							if (elem.msgId == res.payload.msgId) {
								elem.isFriend = false
							}
						});
						chatMsgPlus.setChatMsgRecords(_this.$store.state.user.id, res.payload.receiveId, tmp)
						// 更新聊天页面显示
						uni.$emit('refreshRecordsList', tmp)
					} else if (res.action == 'PUSH_CHAT_MSG') {
						console.log('收到好友发送的消息')
						console.log(res.payload)
						console.log(res.payload.senderId)
						var isRead = false
						let newMsg = new Record(res.payload.msgId, res.payload.senderId, res.payload.receiveId, res.payload.msg, res.payload.msgType, isRead, true)
						
						var tmp = chatMsgPlus.getChatMsgRecords(newMsg.receiveId, newMsg.senderId)
						tmp.push(newMsg);
						chatMsgPlus.setChatMsgRecords(newMsg.receiveId, newMsg.senderId, tmp)
						// 更新聊天页面显示
						uni.$emit('refreshRecordsList', tmp)
						
						// 更新聊天快照
						var snapshot = chatMsgPlus.getChatSnapshot(newMsg.receiveId)
						var exam = null
						for(let i = 0; i < snapshot.length; i++) {
							if (snapshot[i].isSender) {
								if (snapshot[i].senderId == newMsg.receiveId) {
									exam = snapshot[i]
									newMsg.badge = exam.isRead ? (newMsg.isRead ? 0 : 1) : (exam.badge + 1)
									snapshot.splice(i, 1)
									break;
								}
							} else {
								if (snapshot[i].senderId == newMsg.senderId) {
									exam = snapshot[i]
									newMsg.badge = exam.isRead ? (newMsg.isRead ? 0 : 1) : (exam.badge + 1)
									snapshot.splice(i, 1)
									break;
								}
							}
						}
						if (exam == null) {
							newMsg.badge = newMsg.isRead ? 0 : 1
						}
						newMsg.isSender = false
						snapshot.unshift(newMsg);
						chatMsgPlus.setChatSnapshot(newMsg.receiveId, snapshot);
						uni.$emit('refreshSnapShot', snapshot)
					}
				});
				socketTask.onError(function(){
					console.log('WebSocket 错误事件的回调函数')
				})
				this.$store.commit('resetMessager', socketTask)
				// 拉取好友列表
				console.log('拉取好友列表')
				friendService.fetchFriendsList(this);
				// 拉取好友请求
				friendService.loadRequsetCount(this)
				// 拉取未签收消息
				messageService.pullAllNotSignMsg(this)
			}
			
		},
		onShow: function(){
			uni.hideLoading()
		},
		computed: {
			friendRequest(){
				return this.$store.state.badge.friendRequest
			},
			groupRequest(){
				return this.$store.state.badge.groupRequest
			}
		},
		watch: {
			friendRequest(val) {
				this.changeBadge()
			},
			groupRequest(val){
				this.changeBadge()
			}
		},
		mounted: function(){
			this.changeBadge()
		}
	}
</script>

<style>

</style>
