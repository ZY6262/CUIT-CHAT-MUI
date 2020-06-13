export default {
	getStorageUser() {
		let str = uni.getStorageSync("user")
		if (str == null || str == '' || str == undefined)
			return null
		return JSON.parse(str)
	},
	
	setStorageUser(val) {
		uni.setStorageSync("user", JSON.stringify(val))
	}
}