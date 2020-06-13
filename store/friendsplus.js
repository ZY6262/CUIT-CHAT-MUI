export default {
	
	getStorageFriendsList() {
		let str = uni.getStorageSync("friendsList")
		if (str == null || str == '' || str == undefined)
			return []
		return JSON.parse(str)
	},
	
	setStorageFriendsList(val) {
		uni.setStorageSync("friendsList", JSON.stringify(val))
	},
	
}