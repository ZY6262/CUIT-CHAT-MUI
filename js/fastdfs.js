// 与文件服务器交互相关JS
window.fastdfs = {

	// 图片服务器的URL地址
	IMG_SERVER_ADDR_PORT: 'http://192.168.1.12:88/cuit/',
	
	// 从相册选择图片
	pick: function($image){
		var user = app.getUserInfo();
		console.log("从相册中选择图片:");
		plus.gallery.pick(function(path){
			$image.attr('src', path);
			newCropper();
		}, function ( e ) {
			console.log(JSON.stringify(e));
			if (e.code == 12){
				mui.back();
			} else{
				mui.openWindow({
					url: 'index.html', 
					id: 'index.html',
					extras:{
						isVerificate: true,
						type: 'pickPhotoError'
					},
					show:{
						autoShow: false,//页面loaded事件发生后自动显示，默认为true
						aniShow: 'zoom-fade-out',//页面显示动画，默认为”slide-in-right“；
						duration: 350//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				})
			}
			
		}, {filter:"image"} );
	},
	
	// 拍照上传type
	photograph: function($image){
		var user = app.getUserInfo();
		console.log('拍照开始')
		var camera = plus.camera.getCamera();
		if (app.isNotNull(camera)){
			
			camera.captureImage(function(capturedFile){
				plus.io.resolveLocalFileSystemURL(capturedFile, function(entry){
					console.log(entry.toLocalURL());
					$image.attr('src', entry.toLocalURL());
					newCropper();
				}, function(error){
					console.log(JSON.stringify(error));
					app.showToast('文件读取失败', 'error');
					mui.back();
				});
				
			}, function(error){
				if (error.code == 11){
					mui.back();
				}
			}, {filename: '_doc/camera/', index: 1, optimize: false})
		} else{
			app.showToast('打开摄像头失败', 'error');
			mui.back();
		}
	},
	
	// 上传到文件服务器
	uploadFaceBase64: function(base64Url){
		var user = app.getUserInfo();
		console.log(user.id);
		console.log(user.token);
		mui.ajax(app.SERVER_ADDR_PORT + "/u/uploadFaceBase64",{
			data: {
				userId: user.id,
				faceData: base64Url
			},
			dataType: 'json',//服务器返回json格式数据
			type: 'post',//HTTP请求类型
			timeout: 1000000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json', 'token': user.token},	              
			success: function(data){
				
				// 关闭等待框
				plus.nativeUI.closeWaiting();
				console.log(JSON.stringify(data))
				if (data.status == 200) {
					var userInfo = data.data;
					console.log(userInfo);
					app.setUserInfo(userInfo);
					
					//  触发另外一个webview的自定义事件，可以使用 mui.fire()
					var mine_webview = plus.webview.getWebviewById("cuit-chat-mine.html");
					mui.fire(mine_webview, "refresh");
					
					var myfaceWebview = plus.webview.getWebviewById("myface.html");
					mui.fire(myfaceWebview, "refreshFace");
					
					// 页面跳转
					app.showToast('头像修改成功', "success");
					mui.openWindow("index.html", "index.html");
				} else {
					app.showToast(data.msg, "error");
				}
			},
			error: function(xhr, type, errorThrown){
				app.showToast(JSON.stringify(type), "error");
			}
		});
	},
	
	// 图片下载
	downloadFace(url, type){
		console.log(url);
		var future = plus.downloader.createDownload(url, {}, function(downloadFile, status){
			plus.nativeUI.closeWaiting();
			if(status == 200){
				// downloadFile是临时文件,需要进一步操作
				var tempFile = downloadFile.filename;
				console.log(JSON.stringify(tempFile));
				plus.gallery.save(tempFile, function(){
					app.showToast(type + '保存成功', 'success');
				}, function(){
					app.showToast(type + '保存失败', 'error');
				});
				
			} else{
				app.showToast(type + '保存失败', 'error');
			}
		});
		future.start();  // 启动下载任务
	}
}