<template>
	<view>
		<cu-custom bgColor="bg-gradual-orange" :isBack="false"><block slot="content">{{text}}</block></cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<view class="margin-top-xx"></view>
			<formUnit v-for="(item, index) in formUnitList" 
				:key="index" 
				:marginTop="item.marginTop" 
				:desc="item.desc" 
				:leftIconPath="item.leftIconPath" 
				:rightIconPath="item.rightIconPath" 
				:showBorder="item.showBorder"
				:badge='index == 0 ? friendRequest : (index == 1) ? groupRequest : 0'
				:tapFunc='index == 0 ? openRequestList : nothingFunc'></formUnit>
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view v-if='item.children.length > 0' class="padding">{{item.name}}</view>
					<view v-if='item.children.length > 0' class="cu-list menu-avatar no-padding">
						<view @tap="lookFriend" :id="index + '-' + sub" class="cu-item" v-for="(friend, sub) in item.children" :key="sub">
							<view class="cu-avatar radius lg" :style="'background-image:url(' + fastdfsUrl + friend.sendFaceImg +');'"></view>
							<view class="content">
								<view class="text-black">{{friend.sendNickName}}</view>
								<view class="text-gray text-sm" v-if="friend.sendDescription != null || friend.sendDescription != undefined">
									{{friend.sendDescription}}
								</view>
								<view class="text-green text-sm" v-else>
									暂无个型签名
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="index" @touchstart="getCur" @touchend="setCur"> {{item.name}}</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	
	import friendsPlus from '../../store/friendsplus.js'
	import words from '../../common/nickname.js'
	import metadata from '../../utils/metadata.js'
	
	export default {
		computed: {
			friendRequest(){
				return this.$store.state.badge.friendRequest
			},
			groupRequest(){
				return this.$store.state.badge.groupRequest
			}
		},
		mounted: function(){
			console.log('朋友列表页面加载完成')
			let _this = this
			// 监听刷新事件
			uni.$on('refreshFriendsList', function(res){
				console.log('接受了refreshFriendsList')
				_this.friendsList = res
				_this.refreshList()
			});
			this.friendsList = friendsPlus.getStorageFriendsList()
			let list = [{}];
			for (let i = 0; i < 26; i++) {
				list[i] = {};
				list[i].name = String.fromCharCode(65 + i);
				list[i].children = []
			}
			list[26] = {}
			list[26].name = "#"
			list[26].children = []
			this.list = list;
			this.listCur = list[0];
			console.log(this.list)
			this.refreshList()			
		},
		data() {
			return {
				text: '好友',
				fastdfsUrl: metadata.fastdfsUrl,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCurID: '',
				list: [],
				listCur: '',
				friendsList: [],
				formUnitList: [{
					desc: '新朋友',
					leftIconPath: '../../static/xinpengyou.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: true
				},
				{
					desc: '群聊',
					leftIconPath: '../../static/qunliao.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: false
				},
				{
					desc: '标签',
					leftIconPath: '../../static/biaoqian.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: false
				},
				{
					desc: '公众号',
					leftIconPath: '../../static/gongzonghao.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				}]
			};
		},
		methods: {
			nothingFunc(){
				
			},
			openRequestList(){
				console.log('新朋友列表篇')
				uni.navigateTo({
					url: '../account/friends/requestlist'
				})
			},
			refreshList(){
				console.log('更新list.....')
				this.list.forEach(element => {
					element.children = []
				})
				this.friendsList.forEach(elem => {
					// nickname转化成拼音
					let pinyin = words.convertPinyin(elem.sendNickName);
					// 截取拼音的首个字母
					let pinyinFirstChar = pinyin.substr(0, 1).toUpperCase();
				    let isWord = pinyinFirstChar.charCodeAt(0) - 65
					if (isWord >= 0 && isWord <= 25) {
						this.list[isWord].children.push(elem)
					} else {
						this.list[26].children.push(elem)
					}
				})
			},
			
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].name;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name
				};
			},
		
			//触发全部开始选择
			tStart() {
				this.hidden = false
			},
		
			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			},
			lookFriend(e){
				console.log(e)
				let ids = e.currentTarget.id
			    let indexs = ids.split('-')
				let friend = this.list[indexs[0]].children[indexs[1]]
				let friendStr = JSON.stringify(friend)
				console.log(friendStr)
				uni.navigateTo({
					//url: './frienddetails?type=friend&condition=' + friendStr
					url: '../account/friends/frienddetails?type=friend&condition=' + friendStr
				})
				
			}
		
		},
		onReady() {
			console.log("Reeeeeeeeeeeady")
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				// that.boxTop = res.top
				that.boxTop = 0
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				// that.barTop = res.top
				that.boxTop = 0
			}).exec()
		}
	}
</script>

<style scoped>
	page {
		padding-top: 100upx;
	}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
	.margin-top-xx {
		margin-top: 100upx;
	}
</style>
