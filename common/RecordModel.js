class Record {
	
	constructor(msgId, senderId, receiveId, content, msgType, isRead, isFriend) {
	    this.msgId = msgId
	    this.senderId = senderId
	    this.receiveId = receiveId
	    this.content = content
	    this.msgType = msgType
	    this.isRead = isRead
	    this.isFriend = (isFriend == null || isFriend == undefined) ? true : isFriend
		// badge是为snapshot中的对象模型准备的
	}
}

export default Record;