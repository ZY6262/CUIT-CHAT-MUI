<template name="basics">
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="false"><block slot="content">{{text}}</block></cu-custom>
		<formUnit 
			v-for="(item, index) in formUnitList" 
			:key="index" 
			:marginTop="item.marginTop" 
			:desc="item.desc" 
			:leftIconPath="item.leftIconPath" 
			:rightIconPath="item.rightIconPath" 
			:showBorder="item.showBorder"
			:tapFunc='index == 1 ? openScan : (index == 4 ? openSearch : showModal)'></formUnit>
		
		<view class="cu-modal" :class="modalName=='search'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">查找朋友</view>
				</view>
				<view class="padding-lg">
					<wInput type="text" :focus="modalName=='search'" v-model="condition" placeholder="对方的ID或者邮箱" name="input" maxlength="35"></wInput>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action margin-0 flex-sub solid-left">
						<button class="cu-btn round sm bg-mauve" :disabled="disable" @tap="searchFunc">查找</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import wInput from '@/components/watch-login/watch-input.vue' //input
	
	export default {
		components: {
			wInput
		},
		data() {
			return {
				text: '发现',
				condition: '',
				disable: true,
				formUnitList: [{
					desc: '朋友圈',
					leftIconPath: '../../static/pengyouquan.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				},
				{
					desc: '扫一扫',
					leftIconPath: '../../static/saoyisao.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: true
				},
				{
					desc: '摇一摇',
					leftIconPath: '../../static/yaoyiyao.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				},
				{
					desc: '看一看',
					leftIconPath: '../../static/kanyikan.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: true
				},
				{
					desc: '搜一搜',
					leftIconPath: '../../static/souyisou.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				},
				{
					desc: '购物',
					leftIconPath: '../../static/gouwu.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: true
				},
				{
					desc: '游戏',
					leftIconPath: '../../static/youxi.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				}],
				modalName: ''
			};
		},
		watch: {
			condition(val) {
				if (this.condition != null && this.condition != undefined && this.condition != '' && this.condition.length >= 5 && this.condition.length <=35)
					this.disable = false
			}
		},
		methods: {
			openScan(){
				console.log('准备打开扫一扫')
				uni.scanCode({
					onlyFromCamera: false,
					scanType: ['qrCode'],
				    success: function (res) {
				        console.log('二维码内容：' + res.result);
						let str = atob(res.result);
						let strArr = str.split("cuit_chat:");
						console.log(str)
						uni.navigateTo({
							url: '../account/friends/frienddetails?type=search&condition=' + strArr[1]
						})
				    },
					fail: function(res) {
						uni.showToast({
							icon: 'none',
							position: 'top',
							title: '扫码失败'
						})
					}
				});
			},
			showModal(){
				console.log("出发了...")
			},
			openSearch(){
				this.$parent.modalName = 'search'
				console.log('搜一搜')
			},
			hideModal(){
				this.modalName = ''
				this.disable = true
			},
			searchFunc(){
				this.modalName = ''
				this.disable = true
				uni.navigateTo({
					url: '../account/friends/frienddetails?type=search&condition=' + this.condition
				})
				this.condition = ''
			}
		},
		onShow() {
			console.log("success")
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
