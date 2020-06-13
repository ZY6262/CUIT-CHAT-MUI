import tokenPlus from '../store/tokenplus.js'
import metadata from './metadata.js'

// const serverUrl = 'http://192.168.1.11:8080'
// const fastdfsUrl = 'http://192.168.1.12:88/cuit/'

export default {
	
	network(method, url, param, success, dataType, error, complete, states) {
		console.log('---------------来到network')
		uni.request({
		        url: metadata.serverUrl + url,
				method: method,
				//  
				header: {'Content-Type': 'application/json', 'token': states == null ? null : states.token.token},
				dataType: dataType == null ? 'json' : dataType,
		        data: param,
		        success: success,
				fail: error,
				complete: complete
		});
	},
	
	resetToken(store){
		console.log('周期任务...')
		let nowToken = store.state.token.token
		uni.request({
			url: metadata.serverUrl + '/j/reset',
			method: 'GET',
			data: {'oldToken': nowToken},
			success: function(res){
				let result = res.data
				if (result.status == 200) {
					tokenPlus.setStorageToken(result.data)
					store.commit('resetToken', result.data)
				} else {
					uni.showToast({
						icon: 'none',
						position: 'top',
						title: 'token更新失败，请重新登录'
					})
					uni.redirectTo({
						url: '/pages/account/login.vue'
					})
				}	
			},
			fail: function(e){
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: 'token更新失败，请重新登录'
				})
				uni.redirectTo({
					url: '/pages/account/login.vue'
				})
			}
		})
	}
}