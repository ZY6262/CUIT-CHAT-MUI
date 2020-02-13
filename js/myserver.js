// 主要与后端服务器的接口的一些交互JS
window.myserver = {
	
	WS_SERVER_IP_PORT: 'ws://192.168.1.11:9000/ws',
	
	// 登录注册参数处理逻辑
	loginOrRegister: function(userform, username, txt_pwd, type){
		userform.addEventListener("submit", function(event){
			if (!app.isNotNull(username.value)){
				username.focus();
				app.showToast("用户名不能为空", "error")
				return false;
			} else if (!app.isNotNull(txt_pwd.value)){
				txt_pwd.focus();
				app.showToast("密码不能为空", "error")
				return false;
			} else {
				// 判断用户名长度，进行限制
				if (username.value.length > 12 || username.value.length < 5){
					app.showToast("用户名长度5-12位", "error")
					return false;
				} else if (txt_pwd.value.length > 12 || txt_pwd.value.length < 5){
					 app.showToast("密码长度为5-12位", "error")
					return false;
				}
				
				// 与后端交互
				myserver.doLoginOrRegister(username.value, txt_pwd.value, type);
			}
			
			event.preventDefault();
		})
	},
	
	// ajax与后端login/register接口交互
	doLoginOrRegister: function(username, pwd, type){
		// 获取设备的唯一CID
		var clientId = plus.push.getClientInfo().clientid;
		// waitingShow,防止用户重复输入点击
		var params;
		if (type == 'login') {
			tmp = '登录';
			params = {username: username, password: pwd,};
		} else if (type == 'register') {
			tmp = '注册';
			params = {username: username, password: pwd, cid: clientId};
		}
		plus.nativeUI.showWaiting('正在' + tmp + '...');
		mui.ajax(app.SERVER_ADDR_PORT + '/u/' + type + '/', {
			data: params,
			dataType: 'json',  // 服务器返回json格式数据
			type: 'post',  // HTTP请求类型
			timeout: 10000,  // 超时时间设置为10秒；
			headers: {'Content-Type':'application/json'},	              
			success: function(data){
				plus.nativeUI.closeWaiting();
				if(data.status == 200){  // 操作成功
					app.showToast(data.msg, "success");
					if(type == 'login'){
						app.setUserInfo(data.data);  // 保存用户信息
						mui.openWindow({url: 'index.html', id: 'index.html', createNew: true,
							extras:{
								isLogin: true
							 },
							show: {
								autoShow: false  // 页面loaded事件发生后自动显示，默认为true
							},
							waiting: {
							      autoShow: true, // 自动显示等待框，默认为true
							      title: '正在加载...', // 等待对话框上显示的提示内容
							}
						});						
					} else if(type == 'register'){
						mui.back()	
					}
				} else{
					console.log(app.SERVER_ADDR_PORT + '/u/' + type + '/');
					app.showToast(data.msg, "error");
				}
			},
			error: function(xhr, type, errorThrown){
				mui.toast('服务器响应失败');
			}
		});
	},
	 
	// 检测到token过期后可以调用该函数重新获取信息
	getUserInfo: function(){
		var result;
		mui.get(app.SERVER_ADDR_PORT + '/u' + '/getUserInfo/',
				{
					token: app.getUserInfo().token
				},
				function(data){
					result = JSON.stringify(data.data);
					console.log(result);
					app.setUserInfo(result);
				},
				'json'
		);
    },
	
	// 修改昵称逻辑处理
	setNickName: function(nickname){
		if (!app.isNotNull(nickname)){
			app.showToast('昵称不能为空', 'error');
			return;
		}
		if (nickname.length > 12){
			app.showToast('昵称不能超过了12位', 'error');
			return;
		}
		if (nickname.length < 5){
			app.showToast('昵称不能短于5位', 'error');
			return;
		}
		myserver.doUpdateNickName(nickname);
	},
	
	// 通过username查找前置逻辑处理
	searchByUsername: function(username){
		if (!app.isNotNull(username)){
			app.showToast('用户账号不能为空', 'error');
			return;
		}
		if (username.length > 12){
			app.showToast('用户账号不能超过12位', 'error');
			return;
		}
		if (username.length < 5){
			app.showToast('用户账号不能短于5位', 'error');
			return;
		}
		plus.nativeUI.closeWaiting();
		myserver.doSearchByUserName(username);
	},
	
	doSearchByUserName: function(username){
		plus.nativeUI.showWaiting('查找中...');
		console.log(username);
		var user = app.getUserInfo();
		console.log(user.id);
		mui.ajax(app.SERVER_ADDR_PORT + '/u/search/?myUserId=' + user.id + '&friendUserName=' + username,{
			dataType: 'json',//服务器返回json格式数据
			type: 'post',//HTTP请求类型
			async: false,
			timeout: 10000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success: function(data){
				plus.nativeUI.closeWaiting();
				if (data.status == 200){
					mui.openWindow({url: './searchUserResult.html', id: 'searchUserResult.html', createNew: true,
						extras: {
							userData: data.data
						},
						show: {
							 autoShow:true,
							 aniShow: 'slide-in-right',
						     duration: 350
						},
					});
				} else {
					app.showToast('查找失败', 'error');
					var scan = plus.barcode.getBarcodeById('scanComponent');
					console.log(scan);
					if (scan != null){
						scan.start();
					}
				}
				
			},
			error: function(xhr,type,errorThrown){
				app.showToast('查找失败', 'error');
				var scan = plus.barcode.getBarcodeById('scanComponent');
				console.log(scan);
				if (scan != null){
					scan.start();
				}
			}
		});
	},
	
	// 发送好友请求
	sendAaddFriendRequest(friendUserId, user){
		plus.nativeUI.showWaiting('发送好友请求...');
		mui.ajax(app.SERVER_ADDR_PORT + '/u/sendAddFriendRequset/' +
			'?myUserId=' + user.id + 
			'&friendUserId=' + friendUserId,
			{
				dataType: 'json',//服务器返回json格式数据
				type: 'post',//HTTP请求类型
				timeout: 10000,//超时时间设置为10秒；
				headers: {'Content-Type': 'application/json', 'token': user.token},	
				success: function(data){
					plus.nativeUI.closeWaiting();
					console.log(JSON.stringify(data))
					if (data.status == 200){
						app.showToast('发送好友请求成功', 'success');
					} else {
						app.showToast('发送好友请求失败', 'error');
					}
					mui.back();
				},
				error: function(xhr,type,errorThrown){
					app.showToast('发送好友请求失败', 'error');
					mui.back();
				}
		});
	},

    // 拼接HTML
	renderFriendRequests: function(friends){
		if (friends != null && friends != undefined && friends.length > 0){
			var liHtml = "";
			for (var i = 0; i < friends.length; i++){
				var tempNick = "";
				if (friends[i].sendNickName.length > 8)
					tempNick = friends[i].sendNickName.substring(0, 7) + '...';
				else 
					tempNick = friends[i].sendNickName;
				liHtml += '<li class="btnOperate mui-table-view-cell mui-media">' +
							'<a href="javascript:;">' +
								'<img class="mui-media-object mui-pull-left" src="' + fastdfs.IMG_SERVER_ADDR_PORT + friends[i].sendFaceImg + '">' +
								'<span id="span_nickname" class="mui-pull-right">' +
									'<button friendId="' + friends[i].sendUserId + '" type="button" class="ignoreRequest mui-btn mui-btn-grey" style="padding: 7px 10px; margin-right:5px;">忽略</button>' +
									'<button friendId="' + friends[i].sendUserId + '" type="button" class="passRequest mui-btn mui-btn-danger" style="padding: 7px 10px; margin-right:10px">通过</button>' +
								'</span>' +
								'<div class="mui-media-body">' +
								   '<label>' + tempNick + '</label>' +
									'<p class="mui-ellipsis">请求添加你为朋友</p>' +
								'</div>' +
							'</a>' +
						'</li>';
			}
			return liHtml;
		} else {
			return "";
		}
	},
	
	// 加载好友请求列表
	loadingFriendRequest: function(){
		var friendRequestUl = document.getElementById('friendRequestUl');
		var user = app.getUserInfo();
		var result;
		result = mui.ajax(app.SERVER_ADDR_PORT + '/u/queryAddFriendRequset/?userId=' + user.id, {
			data:{ },
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout: 10000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success:function(data){
				plus.nativeUI.closeWaiting();
				if (data.status == 200){
					friendRequestUl.innerHTML = myserver.renderFriendRequests(data.data);
					// 按钮绑定事件
					mui(".btnOperate").on('tap', '.ignoreRequest', function(){
						console.log('ignoreRequest');
						var sendUserId = this.getAttribute('friendId');
						console.log(sendUserId);
						myserver.operateFriendRequest(sendUserId, 1);
					});
					mui(".btnOperate").on('tap', '.passRequest', function(){
						console.log('passRequest');
						var sendUserId = this.getAttribute('friendId');
						console.log(sendUserId);
						myserver.operateFriendRequest(sendUserId, 2);
					});
				} else {
					plus.nativeUI.closeWaiting();
					app.showToast('加载好友请求失败', 'error');
				}
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				app.showToast('加载好友请求失败', 'error');
			}
		});
	},
	
	// 好友请求操作函数
	operateFriendRequest: function(sendUserId, operateType){
		var user = app.getUserInfo();
		plus.nativeUI.showWaiting('处理中...');
		mui.ajax(app.SERVER_ADDR_PORT + '/u/operateFriendRequset/?sendUserId=' + sendUserId
				 + '&acceptUserId=' + user.id + '&operateType=' + operateType,{
			data: {},
			dataType: 'json',//服务器返回json格式数据
			type: 'post',//HTTP请求类型
			timeout:1000000000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success:function(data){
				plus.nativeUI.closeWaiting();
				console.log(JSON.stringify(data));
				myserver.fetchFriendList();
				myserver.loadingFriendRequest();
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				console.log(JSON.stringify(errorThrown));
			}
		});
	},
	
	// 获取好友列表
	fetchFriendList: function(){
		var user = app.getUserInfo();
		mui.ajax(app.SERVER_ADDR_PORT + '/u/fetchFriends/', {
			data:{
				userId: user.id
			},
			dataType: 'json',//服务器返回json格式数据
			type: 'post',//HTTP请求类型
			timeout: 10000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success:function(data){
				if (data.status == 200) {
					app.setFriendList(data.data);
					// 渲染好友列表
					renderFriendList();
				} else {
					mui.toast('加载好友列表失败');
				}
			},
			error:function(xhr,type,errorThrown){
				mui.toast('加载好友列表失败');
			}
		});
	},
	
	/**
	 * 批量拉取未签收消息
	 * */ 
	fetchUnSignedMsgList: function(){
		let user = app.getUserInfo();
		var msgList;
		mui.ajax(app.SERVER_ADDR_PORT + '/u/fetchUnSignedMsgList/', {
			data: {
				userId: user.id
			},
			dataType: 'json',//服务器返回json格式数据
			type: 'post',//HTTP请求类型
			timeout: 10000,//超时时间设置为10秒；
			async: false,
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success:function(data){
				if (data.status == 200) {
					msgList = data.data;
				} 
			}
		});
		return app.isNull(msgList) ? [] : msgList;
	},
	
	// ajax修改昵称
	doUpdateNickName: function(nickname){
		plus.nativeUI.showWaiting('提交中...');
		var user = app.getUserInfo();
		mui.ajax(app.SERVER_ADDR_PORT + '/u/setNickName/',{
			data:{
				userId: user.id,
				nickName: nickname
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	
			success:function(data){
				plus.nativeUI.closeWaiting();
				if(data.status == 200){
					var userInfo = data.data;
					console.log(JSON.stringify(userInfo));
					app.setUserInfo(userInfo);
					// 页面跳转
					var mine_webview = plus.webview.getWebviewById("cuit-WS_CHAT_OBJ-mine.html");
					mui.fire(mine_webview, "refresh");
					app.showToast('修改成功', "success");
					mui.back();
				}
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				app.showToast('修改失败', 'error');
			}
		});
	}
}