<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view style="margin-top: 200rpx; display: inline-flex; align-items: center; flex-direction: row; flex-wrap: nowrap; justify-content: center; width: 100%;">
				<view class="cu-avatar round padding-sm margin-xs lg radius" style="background-image:url(../../static/cuit.jpg);"></view>
				<view style="font-size: 50rpx; margin-left: 20rpx;" class="text-purple">天涯，咫尺之间</view> 
			</view>
			
			<view class="main" style="margin-top: 100rpx;">
				<wInput
					v-model="mail"
					type="text"
					placeholder="邮箱"
				></wInput>
				<wInput
					v-model="password"
					type="password"
					maxlength="10"
					placeholder="密码"
				></wInput>
			</view>
			<view class="container-login100-form-btn padding flex flex-direction">
				<button @tap="toLogin" :disabled="disable" :class="disable ? 'bg-grey' : 'bg-gradual-purple'" class="u-avatar round self-center">→</button>
			</view>
			
			<!-- 其他登录 -->
			<view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_other"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_other"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_other"></view>
				</view>
			</view>
			
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate" style="margin-right: 40rpx;">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate" style="margin-left: 40rpx;">注册账号</navigator>
			</view>
			
		</view>
	</view>
</template>

<script>
	var _this;
	
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import userService from '@/service/UserService.js'
	
	export default {
		data() {
			return {
				mail: '',
				password: '',
				disable: true,
			};
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this = this;
		},
		methods: {
			toLogin(){
				console.log('login...')
				userService.login(this.mail, this.password, this);
			},
			login_other() {
				// 第三方登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '该三方登录SDK暂未接入'
				});
			},
			checkParam() {
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (reg.test(this.mail) && this.password != null && this.password.length >= 5)
					this.disable = false;
				else
					this.disable = true;
			}
		},
		watch: {
			mail(val) {
				this.checkParam();
			},
			password(val){
				this.checkParam();
			}
		}
	}
</script>

<style>
	@import url('../../components/watch-login/css/icon.css');
	@import url('../../account/accountplugincss/main.css');
	
	page {
		background-color: white;
	}
</style>
