// app的一些基础交互JS
window.app = {
	
		// 服务器URL地址
		SERVER_ADDR_PORT: "http://192.168.1.11:8080",
		
		// cuit-chat-list聊天页面列表
		CUIT_CHAT_LIST: [],
		
		isNotNull: function(str){
			if	(str != null && str != '' && str != undefined){
				return true;
			}
			return false;
		},
		
		isNull: function(obj) {
			if (obj == null || obj == undefined)
				return true;
			return false;
		},
		
		// 弹窗工具方法
		showToast: function(str, type){
			plus.nativeUI.toast(str, {"icon": "/image/" + type + ".png", style: 'inline'});
		},
		
		// 保存用户基本信息
		setUserInfo: function(userInfo){
			plus.storage.setItem("userInfo", JSON.stringify(userInfo));
		},
		
		// 获取用户基本信息
		getUserInfo: function(){
			var userinfo = plus.storage.getItem("userInfo");
			return userinfo == null ? null : JSON.parse(userinfo);
		},
		
		// logout用户退出
		logOut: function(){
			plus.storage.clear();
		},
		
		// 页面跳转方法封装
		pageSwitch: function(target, extras, autoShow, aniShow){
			mui.openWindow({
				url: target, 
				id: target,
				extras: extras,
				show:{
					autoShow: autoShow,//页面loaded事件发生后自动显示，默认为true
					aniShow: aniShow,//页面显示动画，默认为”slide-in-right“；
					duration: 350//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				}
			});
		},
		
		// 预加载处理聊天页面,这样页面back的时候不会被真正close,节约资源
		chatPageUsePre: function(self) {
			// 获取属性，传递到聊天页面
			var friendUserId = self.getAttribute('friendUserId');
			var friendNickname = self.getAttribute('friendNickname');
			var friendFaceImg = self.getAttribute('friendFaceImg');
			var friendFaceImgBig = self.getAttribute('friendFaceImgBig');
			var user = app.getUserInfo();
			
			var chatWebview = plus.webview.getWebviewById(friendUserId);
			console.log(app.isNull(chatWebview));
			if (app.isNull(chatWebview)) {
				mui.preload({
				    url: './cuit-chat-list-child/im-chat.html', id: friendUserId,
				    styles:{},//窗口参数
				    extras: {
						friend: {
							userId: friendUserId,
							nickname: friendNickname,
							faceImg: friendFaceImg,
							faceImgBig: friendFaceImgBig
						}
				    },
					show: {
						aniShow: 'fade-in',
						duration: 350
					}
				})
			} else {
				mui.openWindow('./cuit-chat-list-child/im-chat.html', friendUserId);
			}
		},
		
		// 保存好友列表,friends是一个数组[]
		setFriendList: function(friends){
			if (friends != null && friends != undefined && friends.length > 0){
				plus.storage.setItem('friends', JSON.stringify(friends));
			}
			
		},
		
		// 获取好友列表,如果不存在返回一个空数组
		getFriendList: function(){
			var friends = plus.storage.getItem('friends');
			
			return (friends == null || friends == undefined) ? [] : JSON.parse(friends);
		},
		
		// 通过好友ID获取好友对象
		getFriendByuserId: function(friendId){
			let friends = app.getFriendList();
			// friends.forEach(item => {
			// 	if (item.id === friendId)
			// 		return item;
			// }); 不知道为什么这里不支持lambda写法
			for (let i = 0; i < friends.length; i++) {
				if (friends[i].id == friendId)
					return friends[i];
			}
			return null;
		},
		
		// 保存CUIT_CHAT_LIST,方便登录进来的时候能够正常显示
		
		// 播放发送消息提示音
		playSendMsgMP3: async function(){
			plus.audio.createPlayer('../mp3/sendMsg.mp3').play();
		},
		
		// 播放消息接收提示音
		playReceiveMsgMP3: async function(){
			plus.audio.createPlayer('../mp3/receiveMsg.mp3').play();
		},
		
		// 定义后端消息类型枚举对象
		MSG_TYPE_ENUM: {
			CHAT_MSG: 'CHAT_MSG',								// 聊天消息
			SIGNED_MSG: 'SIGNED_MSG',							// 签收消息
			SYSTEM_MSG: 'SYSTEM_MSG',							// 系统消息
			CONNECT_MSG: 'CONNECT_MSG',							// 连接消息
			KEEPALIVE_MSG: 'KEEPALIVE_MSG', 					// 心跳消息
			SYSTEM_PULL_FRIENDS_MSG: 'SYSTEM_PULL_FRIENDS_MSG'	// 系统重拉好友列表消息
		},
		
		// 定义消息发送者枚举对象
		MSG_SENDER_ENUM: {
			ME: 1,
			FRIEND: 2,
			SYSTEM: 3
		},
		
		/**
		 *  构造后端ChatMsgModel模型
		 * */
		ChatMsgModel: function(senderId, receiveId, msg, msgId, type){
			this.msg = msg;
			this.msgId = msgId;
			this.senderId = senderId;
			this.receiveId = receiveId;
			this.type = type;
		},
		
		/**
		 *  构造后端MessageModel模型
		 * */   
		MessageModel: function(actionName, chatMsgModel, extend){
			this.extend = extend;
			this.actionName = actionName;
			this.chatMsgModel = chatMsgModel;
		},
		 
		 /**
		  * 保存到本地的聊天消息类
		  * */
		ChatMsgStorage: function(myId, friendId, record, msgSenderType){
			this.myId = myId;
			this.friendId = myId;
			var content = record.msg;
			if (content == null || content == undefined)
				content = record.content;
			this.record = new app.RecordModel(content, record.type);
			this.msgSenderType = msgSenderType;
		},
		 
		 /**
		  * 保存到本地的消息的模型
		  * */
		RecordModel: function(content, type){
			this.content = content;
			this.type = type;
		},
		 
		 /**
		  * 保存聊天消息
		  * record对应一条聊天消息
		  * msgSenderType == 1 '我'发送的
		  * msgSenderType == 2  朋友发送的
		  * msgSenderType == 3  系统发送的
		  * */
		saveChatMsg: async function (myId, friendId, record, msgSenderType){
			const chat_key = 'cuit-' + myId + friendId;
			var chatMsgStorageList = plus.storage.getItem(chat_key);
			if (chatMsgStorageList == null || chatMsgStorageList == undefined)
				chatMsgStorageList = '[]';
			let chatMsgStorageListObj = JSON.parse(chatMsgStorageList);
			let storageObj = new app.ChatMsgStorage(myId, friendId, record, msgSenderType);
			chatMsgStorageListObj.push(storageObj);
			plus.storage.setItem(chat_key, JSON.stringify(chatMsgStorageListObj));
		},
		 
		 /**
		  * 获取聊天消息
		  * */
		getStorageChatMsg: function (myId, friendId){
			const chat_key = 'cuit-' + myId + friendId;
			let chatMsgStorageList = plus.storage.getItem(chat_key);
			if (chatMsgStorageList == null || chatMsgStorageList == undefined) {
				return [];
			} else {
				return JSON.parse(chatMsgStorageList);
			}
		},
		
		/**
		 * 保存聊天快照,保存聊天页面的最后一条消息
		 * 快照只负责显示在List页面而已,所以只用
		 * 保存content与type就够了
		 * isRead: 消息已读/未读
		 * */
		saveChatSnapshot: function(myId, friendId, record, isRead){
			const chatKey = "cuit-snapshot" + myId;  // 此时与朋友关联不大
			var chatSnapshotList = plus.storage.getItem(chatKey);
			if (chatSnapshotList == null || chatSnapshotList == undefined)
				chatSnapshotList = '[]';
			var chatSnapshotListObj = JSON.parse(chatSnapshotList);
			var specialchatSnapshotObj;
			for (let i = 0; i < chatSnapshotListObj.length; i++){
				if (chatSnapshotListObj[i].friendId == friendId){
					specialchatSnapshotObj = chatSnapshotListObj[i];
					chatSnapshotListObj.splice(i, 1); // 移除掉这个ChatSnapshot对象
					break;
				}
			}
			// isRead为true表示消息已读,bagNum = 0
			var badgeNum = 0;
			if (!isRead) {
				if (!app.isNull(specialchatSnapshotObj)){
					badgeNum = specialchatSnapshotObj.isRead ? 1 : specialchatSnapshotObj.badgeNum + 1;
				} else {
					badgeNum = 1;
				}
			}
			let newChatSnapshotObj = new app.ChatSnapshot(myId, friendId, record, isRead, badgeNum);
			chatSnapshotListObj.unshift(newChatSnapshotObj);  // 每次把最新的快照放到第一位
			plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotListObj));
		},
		
		/**
		 * 获取聊天快照
		 * */
		getChatSnapshot: function(myId){
			const chatKey = "cuit-snapshot" + myId;  // 此时与朋友关联不大
			var chatSnapshotList = plus.storage.getItem(chatKey);
			if (chatSnapshotList == null || chatSnapshotList == undefined)
				chatSnapshotList = '[]';
			return JSON.parse(chatSnapshotList);
		},
		
		/**
		 * 改变快照isRead状态,否则每次用户进入聊天页面什么不做
		 * 的时候,快照状态错误,并且更改下快照顺序
		 * */
		changeSnapshotIsRead: function(myId, friendId){
			var snapshotList = app.getChatSnapshot(myId);
			var index = 0;
			if (snapshotList.length > 0){
				for (let i = 0; i < snapshotList.length; i++){
					if (snapshotList[i].friendId == friendId){
						snapshotList[i].isRead = true;
						index = i;
						break;
					}
				}
				let obj = snapshotList[index];
				snapshotList.splice(index, 1);
				snapshotList.unshift(obj);
			}
			plus.storage.setItem("cuit-snapshot" + myId, JSON.stringify(snapshotList));
		},
		
		/**
		 * 删除本地聊天记录及快照,除以该用户的快照记录
		 * */
		deleteStorageByUserId: function(delId){
			let user = app.getUserInfo();
			const chat_key = 'cuit-' + user.id + delId;
			plus.storage.removeItem(chat_key)  // 删除聊天记录 
			var snapshotList = app.getChatSnapshot(user.id);
			var index = 0;
			if (snapshotList.length > 0){
				for (let i = 0; i < snapshotList.length; i++){
					if (snapshotList[i].friendId == delId){
						index = i;
						break;
					}
				}
				snapshotList.splice(index, 1);  // 删除快照
			}
			plus.storage.setItem("cuit-snapshot" + user.id, JSON.stringify(snapshotList));
		},
		
		/**
		 * ChatSnapshot快照对象
		 * */
		ChatSnapshot: function(myId, friendId, record, isRead, badgeNum){
			this.myId = myId;
			this.friendId = friendId;
			var content = record.msg;
			if (content == null || content == undefined)
				content = record.content;
			this.record = new app.RecordModel(content, record.type);
			this.isRead = isRead;
			this.badgeNum = badgeNum;
		}
		 
}