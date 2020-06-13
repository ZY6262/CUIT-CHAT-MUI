import ajax from '../utils/ajax.js'
import tokenPlus from '../store/tokenplus.js'
import userPlus from '../store/userplus.js'
import metadata from '../utils/metadata.js'
import friendsPlus from '../store/friendsplus.js'

export default {
	
	sendFriendReq(othersId, _this){
		let param = {myId: _this.$store.state.user.id, othersId: othersId}
		ajax.network('GET', '/f/sendFriendReq', param, function(res){
			console.log(res)
			if (res.data.status == 200) {
				uni.showToast({
					position: 'top',
					icon: 'none',
					title: '好友请求已发送',
					duration: 4000
				})
			} else {
				uni.showToast({
					position: 'top',
					icon: 'none',
					title: res.data.msg,
					duration: 4000
				})
				_this.disabled = false
			}
		}, 'json', function(res){
			_this.disabled = false
			uni.showToast({
				icon: 'none',
				position: 'top',
				title: '发送好友请求失败'
			})
		}, null, _this.$store.state)
	},
	
	loadAllRequest(_this){
		uni.showLoading({
			mask: true,
			title: '好友请求拉取中...'
		});
		let userId = _this.$store.state.user.id
		ajax.network('GET', '/f/pullAllFriendReq', {userId: userId}, function(res){
			console.log(res)
			let JSONResult = res.data
			if (JSONResult.status == 200) {
				console.log('更改requestList')
				_this.requestList = JSONResult.data
			} else {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '好友请求拉取失败'
				})
			}
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				title: '好友请求拉取失败'
			})
		}, function(){
			uni.hideLoading()
		}, _this.$store.state)
	},
	
	fetchFriendsList(_this){
		console.log('zzzzzzzzzz')
		ajax.network('GET', '/f/fetchFriends', {userId: _this.$store.state.user.id}, function(res){
			console.log('拉取结果' + res)
			if (res.data.status == 200) {
				
				friendsPlus.setStorageFriendsList(res.data.data)
			}
		}, 'json', function(res){
			
		}, null, _this.$store.state);
	},
	
	loadRequsetCount(_this){
		ajax.network('GET', '/f/getFriendReqCount', {userId: _this.$store.state.user.id}, function(res){
			console.log(res)
			if (res.data.status == 200) {
				_this.$store.commit('resetFriendRequest', res.data.data)
			}
		}, 'json', function(res){
			
		}, null, _this.$store.state)
	},
	
	operateRequest(othersId, isConfirm, index, _this){
		let myId = _this.$store.state.user.id
		let param = {myId: myId, othersId: othersId, isConfirm: isConfirm}
		ajax.network('GET', '/f/operateFriendReq', param, function(res){
			if (res.data.status == 200) {
				if (isConfirm) {
					let storage = friendsPlus.getStorageFriendsList()
					storage.push(_this.requestList[index])
					friendsPlus.setStorageFriendsList(storage)
					_this.requestList.splice(index, 1)
				    uni.$emit('refreshFriendsList', storage)
					console.log('触发了refreshFriendsList')
				}
			} else {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '操作失败'
				})
			}
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				title: '操作失败'
			})
		}, null, _this.$store.state)
	},
	
	deleteFriend(othersId, _this){
		uni.showLoading({
			mask: true,
			title: '删除中...'
		})
		let param = {myId: _this.$store.state.user.id, othersId: othersId}
		ajax.network('GET', '/f/deleteFriend', param, function(res){
			console.log(res)
			if (res.data.status == 200) {
				uni.showModal({
				    title: '注意',
				    showCancel: false,
					confirmText: '我知道了',
					content: '好友已成功删除',
					success: function(res){
						if (res.confirm) {
							console.log('用户点击确定');
							_this.search = true
							_this.friend = false
						} 
					}
				});
				let list =	friendsPlus.getStorageFriendsList()
				var index = 0
				for(let i = 0; i < list.length; i++){
					if (list[i].sendUserId == othersId){
						index = i
						break;
					}
				}
				list.splice(index, 1)
				friendsPlus.setStorageFriendsList(list)
				uni.$emit('refreshFriendsList', list)
			} else {
				uni.showToast({
					icon: 'none',
					position: 'top',
					duration: 4000,
					title: '好友删除失败'
				})
			}
		}, 'json', function(res){
			uni.showToast({
				icon: 'none',
				position: 'top',
				duration: 4000,
				title: '好友删除失败'
			})
		}, function(){
			uni.hideLoading()
		}, _this.$store.state)
	}
	
}