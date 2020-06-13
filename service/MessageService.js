import ajax from '../utils/ajax.js'
import tokenPlus from '../store/tokenplus.js'
import userPlus from '../store/userplus.js'
import metadata from '../utils/metadata.js'
import friendsPlus from '../store/friendsplus.js'
import chatMsgPlus from '../store/chatmsgrecordsplus.js'
import MessageModel from '../common/MessageModel.js'
import Record from '../common/RecordModel.js'

export default {
	
	sendTextMsg(val, _this){
		console.log(_this.$store.state)
		let param = new MessageModel(val.senderId, val.receiveId, val.content, val.msgId, val.msgType, 'CHAT_MSG', null)
		_this.$store.state.websocket.messager.send({
			data: JSON.stringify(param),
			success: function(){
				console.log(' 文本类型消息已发送')
				_this.inputMsg = ''
			    var tmp = chatMsgPlus.getChatMsgRecords(val.senderId, val.receiveId)
				tmp.push(val);
				
				// 更新聊天页面显示
				chatMsgPlus.setChatMsgRecords(val.senderId, val.receiveId, tmp)
				uni.$emit('refreshRecordsList', tmp)
				
				// 更新聊天快照
				var snapshot = chatMsgPlus.getChatSnapshot(val.senderId)
				var exam = null
				for(let i = 0; i < snapshot.length; i++) {
					if (snapshot[i].isSender) {
						if (snapshot[i].receiveId == val.receiveId) {
							exam = snapshot[i]
							val.badge = exam.isRead ? (val.isRead ? 0 : 1) : (exam.badge + 1)
							snapshot.splice(i, 1)
							break;
						}
					} else {
						if (snapshot[i].senderId == val.receiveId) {
							exam = snapshot[i]
							val.badge = exam.isRead ? (val.isRead ? 0 : 1) : (exam.badge + 1)
							snapshot.splice(i, 1)
							break;
						}
					}
				
				}
				if (exam == null) {
					val.badge = val.isRead ? 0 : 1
				}
				val.isSender = true
				snapshot.unshift(val)
				chatMsgPlus.setChatSnapshot(val.senderId, snapshot);
				uni.$emit('refreshSnapShot', snapshot)
			},
			fail: function(){
				uni.showToast({
					icon: 'none',
					position: 'top',
					duration: 4000,
					title: '消息发送失败'
				})
			}
		})
	},
	
	pullAllNotSignMsg(_this) {
		let myId = _this.$store.state.user.id
		console.log("准备拉取未签收消息")
		ajax.network('GET', '/msg/pullNotSign', {myId: myId}, function(res){
			console.log("获取到的未签收消息")
			console.log(res.data)
			if (res.data.status == 200) {
				var isRead = false
				var ids = []
				console.log('enter arr')
				res.data.data.forEach(elem => {
					ids.push(elem.msgId)
					let newMsg = new Record(elem.msgId, elem.senderId, elem.receiveId, elem.msg, elem.msgType, isRead, true)
					var tmp = chatMsgPlus.getChatMsgRecords(newMsg.receiveId, newMsg.senderId)
					tmp.push(newMsg);
					chatMsgPlus.setChatMsgRecords(newMsg.receiveId, newMsg.senderId, tmp)
					
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
					
				})
				
				// 更新页面显示
				let snapshotTmp = chatMsgPlus.getChatSnapshot(myId)
				uni.$emit('refreshSnapShot', snapshotTmp)
				
				// 回发签收消息
				console.log('马上准备会发了')
				let idsStr = ids.join('-')
				let sysMsg = new MessageModel(myId, null, null, null, null, 'RE_SIGNED', idsStr)
				_this.$store.state.websocket.messager.send({
					data: JSON.stringify(sysMsg),
					success: function(){
						console.log('签收成功消息已回发')
					}
				});
				
			} else {
				uni.showToast({
					icon: 'none',
					position: 'top',
					duration: 4000,
					title: '拉取消息失败'
				})
			}
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				duration: 4000,
				title: '拉取消息失败'
			})
		}, null, _this.$store.state)
	},
	
	uploadMultiMsg(tempFileUrl, msgId, othersId, type, _this){
		console.log('文件类型消息准备上传...')
		uni.showLoading({
			mask: true,
			title: '文件类型消息上传中'
		})
		let token = _this.$store.state.token.token
		let myId = _this.$store.state.user.id
		uni.uploadFile({
			url: metadata.serverUrl + '/msg/uploadMultiMsg', 
			filePath: tempFileUrl,
			header: {token: token},
			name: 'file',
			formData: {
				userId: myId,
				msgId: msgId,
				othersId: othersId,
				type: type
			},
			success: (uploadFileRes) => {
				console.log('文件消息发送成功')
				console.log(uploadFileRes.data);
				let res = JSON.parse(uploadFileRes.data)
				console.log(res);
				console.log(res.data);
				if (res.status == 200) {
					console.log("消息保存中");
					console.log(res.data);
					let newMsg = new Record(msgId, myId, othersId, res.data, type, true, true)
					// 更新聊天页面
					var tmp = chatMsgPlus.getChatMsgRecords(myId, othersId)
					tmp.push(newMsg);
					chatMsgPlus.setChatMsgRecords(myId, othersId, tmp)
					uni.$emit('refreshRecordsList', tmp)
					// 更新快照
					var snapshot = chatMsgPlus.getChatSnapshot(myId)
					var exam = null
					for(let i = 0; i < snapshot.length; i++) {
						if (snapshot[i].isSender) {
							if (snapshot[i].receiveId == newMsg.receiveId) {
								exam = snapshot[i]
								newMsg.badge = exam.isRead ? (newMsg.isRead ? 0 : 1) : (exam.badge + 1)
								snapshot.splice(i, 1)
								break;
							}
						} else {
							if (snapshot[i].senderId == newMsg.receiveId) {
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
					newMsg.isSender = true
					snapshot.unshift(newMsg)
					chatMsgPlus.setChatSnapshot(newMsg.senderId, snapshot);
					uni.$emit('refreshSnapShot', snapshot)
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '语音发送失败'
					})
				}
			},
			fail: function(res){
				console.log(res)
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '语音发送失败'
				})
			},
			complete: function(){
				uni.hideLoading();
			}
		});
	}
	
}