export default {
	
	getChatMsgRecords(myId, friendId) {
		let str = uni.getStorageSync("cuit_" + myId + friendId)
		if (str == null || str == '' || str == undefined)
			return []
		return JSON.parse(str)
	},
	
	setChatMsgRecords(myId, friendId, val) {
		uni.setStorageSync("cuit_" + myId + friendId, JSON.stringify(val))
	},
	
	setChatSnapshot(myId, val){
		uni.setStorageSync('snapshot_' + myId, JSON.stringify(val));
	}, 
	
	getChatSnapshot(myId){
		let str = uni.getStorageSync("snapshot_" + myId)
		if (str == null || str == '' || str == undefined)
			return []
		return JSON.parse(str)
	}
}