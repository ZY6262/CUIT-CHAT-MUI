<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">{{friend.sendNickName}}</block></cu-custom>
		<view class="cu-chat" id='chatList' style="margin-bottom: 100rpx;">
			<block v-if="chatRecordList.length > 0" v-for="(item, index) in chatRecordList">
				<view :class="myId == item.senderId ? 'cu-item self' : 'cu-item'" :key='index'>
					<view v-if="myId != item.senderId" class="cu-avatar radius" :style="'background-image:url(' + fastdfsUrl + friend.sendFaceImg + ');'"></view>
					<view class="main">
						<view v-if="item.msgType == 'text'"  class="content bg-green shadow">
							<text>{{item.content}}</text>
						</view>
						<image @tap="lookPic" :id="item.content" v-else-if="item.msgType == 'image'" :src="fastdfsUrl + item.content" class="radius" mode="widthFix"></image>
						<view v-else-if="item.msgType == 'audio'" class="content shadow" :id='item.content' @tap="playAudioRecord">
							<text class="cuIcon-sound text-xxl padding-right-xl"></text>点击播放
						</view>
					</view>
					<view v-if="myId == item.senderId" class="cu-avatar radius" :style="'background-image:url(' + fastdfsUrl + faceImg + ');'"></view>
					<view v-if='!item.isFriend' class="date"><text class="cuIcon-roundclosefill text-red "></text>对方已解除与您的好友关系</view>
				</view>
			</block>
			<view class="cu-info round" v-if="chatRecordList.length == 0">交流是勇敢的第一步</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action" v-if='showAudio' @tap="toAudio">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<view class="action" v-if='showText' @tap="toText">
				<text class="cuIcon-text text-grey"></text>
			</view>
			<input v-if='showInput' v-model="inputMsg" class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<button @tap="toAudioing" v-if="startAudio" class="cu-btn lg bg-green text-center">点击开始录音</button>
			<button @tap="toEndAudio" v-if="audioing" class="cu-btn lg bg-green text-center">录音中...点击发送录音</button>
			<button @tap="playSound" v-if='playAudio' class="cu-btn lg bg-green text-center">点击播放录音</button>
			<view class="action" @tap="uploadImg">
				<text class="cuIcon-pic text-grey"></text>
			</view>
			<button @tap="sendText" class="cu-btn bg-green shadow">发送</button>
		</view>

	</view>
</template>

<script>
	
	import metadata from '../../../utils/metadata.js'
	import recordsPlus from '../../../store/chatmsgrecordsplus.js'
	import Record from '../../../common/RecordModel.js'
	import messageService from '../../../service/MessageService.js'
	
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;

	export default {
		data() {
			return {
				fastdfsUrl: metadata.fastdfsUrl,
				InputBottom: 0,
				showAudio: true,
				showInput: true,
				startAudio: false,
				audioing: false,
				playAudio: false,
				showText: false,
				chatRecordList: [],
				friend: {},
				inputMsg: '',
				voicePath: ''
			};
		},
		watch: {
			chatRecordList(val) {
				console.log('聊天记录发生了变化')
				this.changeScrollTop()
			}
		},
		computed: {
			myId(){
				return this.$store.state.user.id
			},
			faceImg(){
				return this.$store.state.user.faceImg
			}
		},
		methods: {
			toAudio(){
				this.showInput = false
				this.audioing = false
				this.playAudio = false
				this.showAudio = false
				this.showText = true
				this.startAudio = true
			},
			toText(){
				this.showText = false
				this.startAudio = false
				this.playAudio = false
				this.audioing = false
				this.showAudio = true
				this.showInput = true
			},
			toAudioing(){
				this.showText = true
				this.startAudio = false
				this.playAudio = false
				this.audioing = true
				this.showAudio = false
				this.showInput = false
				recorderManager.start();
			},
			toEndAudio(){
				this.showText = true
				this.startAudio = true
				this.playAudio = false
				this.audioing = false
				this.showAudio = false
				this.showInput = false
				recorderManager.stop();
			},
			playSound(){
				console.log('播放录音');
			
				if (this.voicePath) {
					// innerAudioContext.src = this.voicePath;
					innerAudioContext.src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3'
					innerAudioContext.play();
				}
			},
			playAudioRecord(e){
				console.log('点击播放按钮')
				console.log(e)
				this.voicePath = e.currentTarget.id
				console.log(this.voicePath)
				if (this.voicePath) {
					// innerAudioContext.src = this.voicePath;
					innerAudioContext.src = this.fastdfsUrl + this.voicePath
					innerAudioContext.play();
				}
				
			},
			uploadImg(){
				let _this = this
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'],
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
						console.log(res.tempFilePaths)
						messageService.uploadMultiMsg(res.tempFilePaths[0], _this.guid(), _this.friend.sendUserId, 'image', _this)
				    },
					fail: function(res) {
						uni.showToast({
							icon: 'none',
							position: 'top',
							title: '发送的文件过大'
						})
					}
				});
			},
			lookPic(e){
				console.log('查看大图')
				let path = e.currentTarget.id
				let param = {}
				param.id = path
				param.title = '查看大图'
				param.name = '图片'
				param.img_src = this.fastdfsUrl + path
				param.img_num = 1
				uni.navigateTo({
					url: '../../img/betterdetails?data=' + encodeURIComponent(JSON.stringify(param))
				})
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			switchType(){
				this.audioing = !this.audioing
			},
			refreshRecordsList(){
				
			},
			sendText(){
				if (this.inputMsg == '' || this.inputMsg == null || this.inputMsg == undefined) {
					uni.showToast({
						icon: 'none',
						position: 'top',
						duration: 3000,
						title: '发送的消息为空'
					});
					return;
				}
				
				let res = new Record(this.guid(), this.$store.state.user.id, this.friend.sendUserId, this.inputMsg, 'text', true, true)
				console.log(res)
				messageService.sendTextMsg(res, this)
				
			},
			//用于生成msgId
			S4() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			},
			guid() {
				return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
			},
			changeScrollTop(){
				console.log('更新scrollTop值')
				let selector = uni.createSelectorQuery()
				selector.select('#chatList').boundingClientRect(data => {
				  uni.pageScrollTo({
				  	duration: 0,
					scrollTop: data.top + data.bottom
				  })
				}).exec();
			}
		}, 
		onLoad(e){
			console.log('聊天页面Load事件')
			let _this = this
			this.friend = JSON.parse(e.condition)
			let myId = this.$store.state.user.id
			// #ifdef APP-PLUS
			const currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
			currentWebview.id = this.friend.sendUserId
			// #endif
			this.chatRecordList = recordsPlus.getChatMsgRecords(myId, this.friend.sendUserId)
			uni.$on('refreshRecordsList', function(res){
				console.log('接收到 了刷新事件')
				_this.chatRecordList = recordsPlus.getChatMsgRecords(myId, _this.friend.sendUserId)
				console.log(_this.chatRecordList)
			});
			console.log(this.chatRecordList)
			recorderManager.onStop(function (res) {
				console.log('recorder stop' + JSON.stringify(res));
				// 发送语音消息
				messageService.uploadMultiMsg(res.tempFilePath, _this.guid(), _this.friend.sendUserId, 'audio', _this)
			});
		},
		onShow(){
			console.log('聊天页面已显示')
			let selector = uni.createSelectorQuery()
			selector.select('#chatList').boundingClientRect(data => {
			  uni.pageScrollTo({
			  	duration: 0,
				scrollTop: data.top + data.bottom
			  })
			}).exec();
			// 更新下相关snapshot的badge
			console.log(recordsPlus)
			var snapshotShowTmp = recordsPlus.getChatSnapshot(this.$store.state.user.id)
			console.log(snapshotShowTmp)
			for(let i = 0; i < snapshotShowTmp.length; i++) {
				if (!snapshotShowTmp[i].isSender && (this.friend.sendUserId == snapshotShowTmp[i].senderId)) {
					snapshotShowTmp[i].isRead = true
					snapshotShowTmp[i].badge = 0
					break;
				}
			}
			console.log('更新一下badge')
			recordsPlus.setChatSnapshot(this.$store.state.user.id, snapshotShowTmp)
			uni.$emit('refreshSnapShot', snapshotShowTmp)
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
}
</style>
