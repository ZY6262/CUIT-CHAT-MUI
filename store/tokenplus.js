export default {
	getStorageToken() {
		return uni.getStorageSync("token")
	},
	setStorageToken(val) {
		uni.setStorageSync("token", val)
	}
}