<template name="basics">
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="false"><block slot="content">{{text}}</block></cu-custom>
		<view class="cu-card case">
			<view class="cu-item shadow">
				<view @tap="tapCard" style="padding: 30rpx;" hover-class="">
					<view style="height: 80rpx;">
						<view style="float: left; display: flex; flex-wrap: nowrap; align-items: center;">
							<text> {{nickname}} </text>
							<view :class="sex ? 'text-blue cuIcon-male' : 'text-red cuIcon-female'" style="margin-left: 5rpx; position: static;"></view>
						</view>
						
						<view class="cu-avatar xl radius" :style="faceImg == null ? 'background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg); float: right;' : 'background-image:url(' + fastdfsUrl + faceImg + '); float: right;'"></view>
					</view>
					<view v-if="address != '' && address != null && address != undefined"><h3>{{address}}</h3></view>
					<view v-else><h3>地址</h3></view>
				</view>
				<view @tap="tapQRCode" class="cu-item solids-top" style="padding: 20rpx 30rpx;">
					<view class="cu-item">
						<text class="text-grey">对外名片</text>
						<view style="display: inline-block; float: right;">
							<view class="image" style="display: inline-block;">
								<image style="width: 30rpx; height: 30rpx;" src="../../static/qrcode.png" mode="widthFix"></image>
							</view>
							<view class="image" style="display: inline-block;">
								<image style="width: 30rpx; height: 30rpx;" src="../../static/more.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				
				
			</view>
		</view>
		
		<imgModal :modalName='modalName'></imgModal>
		<view class="cu-modal" :class="modalName=='qrcodeModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nickname + '的名片'}}</view>
				</view>
				<view >
					<image mode="widthFix" :src="(qrcode == null || qrcode == '' || qrcode == undefined) ? '../../static/qrcodedemo.jpg' : (fastdfsUrl + qrcode)" @longtap="saveQRCode"></image>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action margin-0 flex-sub solid-left" @tap="hideModal">扫一扫上面的二维码图案，加我为好友</view>
				</view>
			</view>
		</view>
		
		<formUnit 
			v-for="(item, index) in formUnitList" 
			:key="index" 
			:marginTop="index == 3" 
			:desc="item.desc" 
			:leftIconPath="item.leftIconPath" 
			:rightIconPath="item.rightIconPath" 
			:showBorder="item.showBorder"
			:tapFunc='index == 3 ? openSettings : showModal'
		></formUnit>
			
	</view>
</template>

<script>
	
	import imgModal from '@/components/modal/withimgmodal.vue'
	import { mapState } from 'vuex'
	import fileUtil from '../../utils/saveFile.js'
	import metadata from '../../utils/metadata.js'
	
	export default {
		components: {
			imgModal
		},
		computed: {
			nickname(){
				return this.$store.state.user.nickname
			},
			sex(){
				return this.$store.state.user.sex
			},
			faceImg(){
				return this.$store.state.user.faceImg
			},
			address(){
				return this.$store.state.user.address
			},
			qrcode(){
				return this.$store.state.user.qrcode
			}
		},
		data() {
			return {
				fastdfsUrl: metadata.fastdfsUrl,
				text: '我的',
				modalName: '',
				formUnitList: [{
					desc: '收藏',
					leftIconPath: '../../static/shoucang.png',
					rightIconPath: '../../static/more.png',
					showBorder: true
				},
				{
					desc: '红包',
					leftIconPath: '../../static/hongbao.png',
					rightIconPath: '../../static/more.png',
					showBorder: true
				},
				{
					desc: '奖励',
					leftIconPath: '../../static/jiangli.png',
					rightIconPath: '../../static/more.png',
					showBorder: false
				},
				{
					desc: '设置',
					leftIconPath: '../../static/shezhi.png',
					rightIconPath: '../../static/more.png',
					showBorder: false
				}]
			};
		},
		watch: {
			faceImg(val) {
				console.log('faceImg值发生了改变')
			}
		},
		methods: {
			changeText(){
				// console.log(this)
				// console.log(this.timer)
				// console.log('tap')
				// console.log(this.example)
				// this.$store.commit('increment')
				// this.$store.commit('resetUser', {name: 'Fei', age: 24})
				// console.log(this.$store.state.study.count)
				// console.log(this.count)
				// console.log(this.example)
			},
			
			showModal(e){
				console.log("switch?")
				this.$parent.$data.modalName = 'Image'
			},
			openSettings(){
				console.log('打开设置页面')
				uni.navigateTo({
					url: '../account/settings/system'
				})
			},
			hideModal(){
				this.modalName = ''
				
			},
			tapCard(e){
				console.log("查看个人资料")
				uni.navigateTo({
					url: '../account/settings/person'
				})
			},
			tapQRCode(){
				console.log(metadata.fastdfsUrl)
				this.modalName = 'qrcodeModal'
			},
			saveQRCode(){
				let _this = this
				uni.showActionSheet({
				    itemList: ['保存到手机', '查看大图'],
				    success: function (res) {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex == 1) {
							uni.navigateTo({
								url: '../img/detail?type=qrcode&url=' + ((_this.qrcode == null || _this.qrcode == undefined || _this.qrcode == '') ? '../../static/qrcodedemo.jpg' : (_this.fastdfsUrl + _this.qrcode))
							})
						} else if (res.tapIndex == 0) {
							fileUtil.saveImg('https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg', '二维码')
						}
				    },
				    fail: function (res) {
				        uni.showToast({
				        	icon: 'none',
							position: 'top',
							title: '出了点问题~'
				        })
				    }
				});
				
			}
		},
		onShow() {
			console.log("success ")
		},
		mounted() {
			// 检查有无token
			// 有 判断是否到期，若未到期，马上请求新的token
			// 无或者没有 跳转登录页面
		},
		onReady() {
			console.log('就绪')
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
