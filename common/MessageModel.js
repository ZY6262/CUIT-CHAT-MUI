class MessageModel {
	
	constructor(senderId, receiveId, msg, msgId, msgType, action, extra) {
	    this.senderId = senderId
	    this.receiveId = receiveId
	    this.msg = msg
	    this.msgId = msgId
	    this.msgType = msgType
	    this.action =action
	    this.extra = extra
	}
}

export default MessageModel;