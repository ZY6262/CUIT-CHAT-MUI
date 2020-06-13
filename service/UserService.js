import ajax from '../utils/ajax.js'
import tokenPlus from '../store/tokenplus.js'
import userPlus from '../store/userplus.js'
import metadata from '../utils/metadata.js'
import friendsPlus from '../store/friendsplus.js'

export default {
	login(mail, password, _this){
		ajax.network('POST', '/u/login', {'mail': mail, 'password': password}, 
			function(data){
				console.log(_this)
				let res = data.data
				let JSONObject = JSON.parse(res)
				if (JSONObject.status == 200) {
					// 刷新token、设置token刷新器
					let userModel = JSON.parse(JSONObject.msg)
					tokenPlus.setStorageToken(JSONObject.data)
					console.log("userModel")
					userPlus.setStorageUser(userModel)
					console.log(userPlus.getStorageUser())
					_this.$store.commit('resetToken', JSONObject.data)
					_this.$store.commit('resetUser', userModel)
					if (_this.$store.state.timer.timer == null) {
						console.log('马上设置定时器了')
					    let timerId = setInterval(function(store){
							ajax.resetToken(store)
						}, 50 * 60 * 1000, _this.$store)
						_this.$store.commit('resetTimer', timerId)
					}
					// 转场去首页并关闭这些页面
					uni.showLoading({
						mask: true,
						title: '登录中...'
					})
					uni.redirectTo({
					    url: '../index/be_index'
					});
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: JSONObject.msg
					})
				}
			},
			function(err){
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '当前网络可能出现了点问题~'
				})
			}
		)
	},
	register(mail, password, code) {
		uni.showLoading({
			mask: true,
			title: '注册中...'
		})
		ajax.network('POST', '/u/register', {'mail': mail, 'password': password, 'code': code}, 
			function(data){
				let res = JSON.parse(data.data)
				if (res.status == 200) {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '注册成功'
					})
					uni.redirectTo({
						url: 'login'
					})
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: res.msg
					})
				}
			},
			function(err){
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '未知错误'
				})
			},
			function(){
				uni.hideLoading();
			}
		)
	},
	resetPwd(mail, password, code) {
		uni.showLoading({
			mask: true,
			title: '密码重置中...'
		})
		ajax.network('POST', '/u/resetPassword', {'mail': mail, 'password': password, 'code': code},
			function(data){
				let res = JSON.parse(data.data)
				if (res.status == 200) {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '密码重置成功'
					})
					uni.navigateBack()
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: res.msg
					})
				}
			},
			function(err){				
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '未知错误'
				})
			},
			function(){
				uni.hideLoading();
			}
		)
	},
	sendCode(mail, type){
		uni.showLoading({
			mask: true,
			title: '验证码发送中...'
		})
		ajax.network('GET', '/m/createCode', {'mail': mail, 'type': type},
			function(data){
				let res = JSON.parse(data.data)
				if (res.status == 200) {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '验证码发送成功'
					})
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: res.msg
					})
				}
			},
			function(err){				
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '未知错误'
				})
			},
			function(){
				uni.hideLoading();
			}
		)
	},
	updateUser(state, _this){
		console.log("----------来到service修改个人资料")
		let param = {
			id: state.id,
			mail: state.mail,
			password: state.password,
			nickname: state.nickname,
			sex: state.sex,
			qrcode: state.qrcode,
			faceImg: state.faceImg,
			faceImgBig: state.faceImgBig, 
			birthday: state.birthday,
			phone: state.phone,
			address: state.address,
			description: state.description,
			cid: state.cid
		}
		ajax.network('POST', '/u/updateUser', param, function(res){
			userPlus.setStorageUser(param);
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				title: '用户更新提交失败'
			})
		}, null, _this.$store.state)
	},
	updateAvatar(url, _this){
		console.log('头像准备上传...')
		uni.showLoading({
			mask: true,
			title: '头像上传中'
		})
		let token = _this.$store.state.token.token
		let userId = _this.$store.state.user.id
		uni.uploadFile({
			url: metadata.serverUrl + '/u/uploadAvatar', 
			filePath: url,
			header: {token: token},
			name: 'avatar',
			formData: {
				'userId': userId
			},
			success: (uploadFileRes) => {
				console.log('头像设置成功')
				console.log(uploadFileRes.data);
				let res = JSON.parse(uploadFileRes.data)
				if (res.status == 200) {
					console.log(_this.$store)
					_this.$store.commit('resetUser', res.data)
					userPlus.setStorageUser(res.data)
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: '头像设置失败'
					})
				}
			},
			fail: function(res){
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '头像设置失败'
				}),
				uni.navigateBack({
					delta: 2
				})
			},
			complete: function(){
				uni.hideLoading();
			}
		});
	},
	search(condition, _this) {
		console.log(_this.$store)
		uni.showLoading({
			mask: true,
			title: '查找中...'
		})
		ajax.network('GET', '/u/search', {condition: condition}, function(res){
			console.log(res)
			let JSONResult = res.data
			if (JSONResult.status == 200) {
				_this.friendDetails = JSONResult.data
			} else {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: JSONResult.msg,
					duration: 5000
				})
				uni.navigateBack({
					delta: 1
				})
			}
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				title: '未知状况'
			})
			uni.navigateBack({
				delta: 1
			})
		}, function(){
			uni.hideLoading()
		}, _this.$store.state)
	}
	
}