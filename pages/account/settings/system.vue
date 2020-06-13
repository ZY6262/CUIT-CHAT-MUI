<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="content">系统设置</block></cu-custom>
		
		<formUnit
			v-for="(item, index) in formUnitList" 
			:key="index" 
			:marginTop="item.marginTop" 
			:desc="item.desc" 
			:leftIconPath="item.leftIconPath" 
			:rightIconPath="item.rightIconPath" 
			:showBorder="item.showBorder"
			:tapFunc='index == 1 ? toChangePwd : (index == 2 ? toFeedBack : (index == 3 ? toAbout : (index == 4 ? toExit : showModal)))'
		></formUnit>
		
		<imgModal :modalName='modalName'></imgModal>
		
	</view>
</template>

<script>
	import imgModal from '@/components/modal/withimgmodal.vue'
	
	export default {
		components: {
			imgModal
		},
		data() {
			return {
				modalName: '',
				formUnitList: [{
					desc: '我的点赞',
					leftIconPath: '../../../static/wodedianzan.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: true
				},{
					desc: '修改密码',
					leftIconPath: '../../../static/xiugaimima.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: false
				},{
					desc: '问题反馈',
					leftIconPath: '../../../static/feedback.png',
					rightIconPath: '../../static/more.png',
					showBorder: true,
					marginTop: false
				},{
					desc: '关于',
					leftIconPath: '../../../static/guanyu.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: false
				},
				{
					desc: '退出账号',
					leftIconPath: '../../../static/tuichu.png',
					rightIconPath: '../../static/more.png',
					showBorder: false,
					marginTop: true
				}]
				
			}
		},
		methods: {
			showModal(e){
				console.log("switch?")
				this.$parent.$data.modalName = 'Image'
			},
			toChangePwd(){
				uni.navigateTo({
					url: '../../account/forget'
				})
			},
			toFeedBack(){
				uni.navigateTo({
					url: 'feedback'
				})
			},
			toAbout(){
				uni.navigateTo({
					url: './about'
				})
			},
			toExit(){
				// 回调函数
				console.log("Exit System")
				uni.clearStorageSync();
				// #ifdef APP-PLUS  
				plus.runtime.quit();  
				// #endif
			}
			
		}
	}
</script>

<style>

</style>
