<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true"><block slot="backText">个人资料</block></cu-custom>
		
		<view class="cu-list menu sm-border card-menu margin-top">
			<view class="cu-item arrow" @tap="toAvatar">
				<view class="content">
					<text class="text-black">头像</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="changeNickname">
				<view class="content">
					<text class="text-black">昵称</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{nickname}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-black">邮箱</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{mail}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-black">性别</text>
				</view>
				<switch class='switch-sex' @change="changeSex" :class="sex ? 'checked' : ''" :checked="sex ? true : false"></switch>
			</view>
			<view class="cu-item arrow" @tap="selectAddr">
				<view class="content">
					<text class="text-black">地址</text>
				</view>
				<view class="action" >
					<text class="text-grey text-sm">{{address}}</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-black">生日</text>
				</view>
				<picker mode="date" :value="(birthday == null || birthday == undefined || birthday == '')  ? '1960-01-01' : birthday" start="1960-01-01" end="2100-01-01" @change="DateChange">
					<view class="picker">
						<text v-if="birthday == null || birthday == undefined || birthday == ''" class="text-grey text-sm">1960-01-01</text>
						<text v-else class="text-grey text-sm">{{birthday}}</text>
					</view>
				</picker>
			</view>
			<view class="cu-item arrow" @tap="changePhone">
				<view class="content">
					<text class="text-black">电话</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{phone}}</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="changeDesc">
				<view class="content">
					<text class="text-black">个性签名</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{description}}</text>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='nickname'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">换个昵称换个心情~</view>
				</view>
				<view class="padding-lg">
					<wInput :focus="modalName=='nickname'" v-model="newNickname" placeholder="请输入..." name="input"></wInput>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action margin-0 flex-sub solid-left">
						<button class="cu-btn round sm" :disabled="disable" @tap="closeNickModal">确定修改</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='phone'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改电话</view>
				</view>
				<view class="padding-lg">
					<wInput type="number" :focus="modalName=='phone'" v-model="newPhone" placeholder="十一位数字" name="input" maxlength="11"></wInput>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action margin-0 flex-sub solid-left">
						<button class="cu-btn round sm" :disabled="disable" @tap="closePhoneModal">确定修改</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='desc'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改个性签名</view>
				</view>
				<view class="padding-lg">
					<wInput type="text" :focus="modalName=='desc'" v-model="newDesc" placeholder="输入新的个性签名" name="input" maxlength="30"></wInput>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action margin-0 flex-sub solid-left">
						<button class="cu-btn round sm" :disabled="disable" @tap="closeDescModal">确定修改</button>
					</view>
				</view>
			</view>
		</view>
		
		<selectAddress ref='selectAddress' @selectAddress="successSelectAddress"></selectAddress>
		
	</view>
</template>

<script>
	
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue'
	import metadata from '../../../utils/metadata.js'
	
	export default {
		components: {
			wInput,
			selectAddress
		},
		watch: {
			newNickname(val) {
				this.newNicknameCheck()
			},
			newPhone(val) {
				this.checkPhone()
			},
			newDesc(val) {
				this.checkDesc()
			}
		},
		data() {
			return {
				newNickname: '',
				newPhone: '',
				newDesc: '',
				disable: true,
				modalName: '',
				
				tmpNickname: '',
				tmpSex: true,
				tmpAddress: '',
				tmpBirthday: '',
				tmpPhone: '',
				tmpDescription: '',
				
			}
		},
		methods: {
			newNicknameCheck(){
				if (this.newNickname != '' && this.newNickname.length >= 5 && this.newNickname.length <= 9)
					this.disable = false
				else
					this.disable = true
			},
			checkPhone(){
				var regu =/^[1][3][0-9]{9}$/;
				if (regu.test(this.newPhone))
					this.disable = false
				else
					this.disable = true
			},
			checkDesc(){
				if (this.newDesc != null && this.newDesc != undefined && this.newDesc != '' && this.newDesc.length > 0 && this.newDesc.length <= 30)
					this.disable = false
				else
					this.disable = true
			},
			changeNickname() {
				this.modalName = 'nickname'
			},
			hideModal(){
				this.modalName = ''
			},
			closeNickModal(){
				console.log('准备修改昵称')
				if (this.tmpNickname != this.newNickname) {
					this.$store.commit('resetNickname', {newNickname: this.newNickname, _this: this})
				}
				this.newNickname = ''
				this.hideModal()
			},
			changeSex(){
				console.log('准备修改性别')
				this.$store.commit('resetSex', {newSex: !this.sex, _this: this})
			},
			selectAddr(){
				this.$refs.selectAddress.show()
			},
			successSelectAddress(address){ //选择成功回调
				if (this.tmpAddress != address) {
					this.$store.commit('resetAddress', {newAddr: address, _this: this})
				}
			},
			DateChange(e) {
				console.log(e.detail.value)
				if (this.tmpBirthday != e.detail.value) {
					this.$store.commit('resetBirthday', {newBirthday: e.detail.value, _this: this})
				}
			},
			changePhone() {
				this.modalName = 'phone'
			},
			closePhoneModal(){
				console.log('准备修改电话')
				if (this.tmpPhone != this.newPhone) {
					this.$store.commit('resetPhone', {newPhone: this.newPhone, _this: this})	
				}
				this.newPhone = ''
				this.hideModal()
			},
			changeDesc(){
				this.modalName = 'desc'
			},
			closeDescModal(){
				console.log('准备修改个性签名')
				if (this.tmpDescription != this.newDesc) {
					this.$store.commit('resetDescription', {newDesc: this.newDesc, _this: this})
				}
				this.newDesc = ''
				this.hideModal()
			},
			toAvatar(){
				console.log(metadata)
				uni.navigateTo({
					url: '../../img/detail?type=face&url=' + metadata.fastdfsUrl + this.faceImgBig + '&hasFace=' + (this.faceImgBig == null || this.faceImgBig == undefined || this.faceImgBig == '')
				})
			}
		},
		computed: {
			nickname(){
				return this.$store.state.user.nickname
			},
			sex(){
				return this.$store.state.user.sex
			},
			faceImgBig(){
				return this.$store.state.user.faceImgBig
			},
			address(){
				return this.$store.state.user.address
			},
			mail(){
				return this.$store.state.user.mail
			},
			birthday(){
				return this.$store.state.user.birthday
			},
			phone(){
				return this.$store.state.user.phone
			},
			description(){
				return this.$store.state.user.description
			},
		},
		onShow() {
			console.log('个人资料页面显示')
			this.tmpNickname = this.nickname
			this.tmpSex = this.sex
			this.tmpAddress = this.address
			this.tmpBirthday = this.birthday
			this.tmpPhone = this.phone
			this.tmpDescription = this.description
		}
		
	}
</script>

<style>

</style>
