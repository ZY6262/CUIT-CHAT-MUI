export default {
	
	saveImg: function(url, msg) {
		uni.downloadFile({
		    url: url,
		    success: (res) => {
		        if (res.statusCode === 200) {
		            uni.saveFile({
					  tempFilePath: res.tempFilePath,
					  success: function (res) {
						uni.showToast({
							icon: 'none',
							position: 'top',
							title: msg + '保存成功'
						})
					  },
					  fail: (res) => {
					  	uni.showToast({
					  		icon: 'none',
					  		position: 'top',
					  		title: msg + '保存失败'
					  	})
					  }
					});
		        }
		    },
			fail: (res) => {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: msg + '保存失败'
				})
			}
		});
	}
	
}