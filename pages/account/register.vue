<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view style="margin-top: 200rpx; display: inline-flex; align-items: center; flex-direction: row; flex-wrap: nowrap; justify-content: center; width: 100%;">
				<view class="cu-avatar round padding-sm margin-xs lg radius" style="background-image:url(../../static/cuit.jpg);"></view>
				<view style="font-size: 50rpx; margin-left: 20rpx;" class="text-mauve">账号注册</view> 
			</view>
			
			<!-- 主体 -->
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
				<wInput
					v-model="code"
					type="number"
					maxlength="6"
					placeholder="验证码"
					codeText="获取验证码"
					setTime="60"
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
					
			</view>
				
			<view class="container-login100-form-btn padding flex flex-direction">
				<button @tap="toRegister" :disabled="disable" :class="disable ? 'bg-grey' : 'bg-gradual-green'" class="u-avatar round self-center">→</button>
			</view>
			
			<!-- 底部信息 -->
			<view class="footer">
				<text 
					@tap="isShowAgree" 
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				>&nbsp;&nbsp;已阅读并同意服务协议和隐私政策</text>
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
				code: '',
				disable: true,
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
				canSendMail: false
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		watch: {
			mail(val) {
				this.canSendMailCode();
				this.checkParam();
			},
			password(val){
				this.checkParam();
			},
			code(val) {
				this.checkParam();
			}
		},
		methods: {
			isShowAgree(){
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			getVerCode(){
				//获取验证码
				if (!this.canSendMail) {
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '请正确填写邮箱地址'
					});
					return;
				}
				userService.sendCode(this.mail, 2);
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
			},
		    toRegister() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
				    uni.showToast({
				        icon: 'none',
						position: 'top',
				        title: '请先同意服务协议和隐私政策'
				    });
				    return false;
				}
				_this.isRotate = true
				userService.register(this.mail, this.password, this.code)
				
				setTimeout(function(){
					_this.isRotate = false
				}, 4000)
				
		    },
			
			checkMail() {
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				return reg.test(this.mail)
			},
			
			checkParam() {
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (this.checkMail() && this.password != null && this.password.length >= 5 && this.code != null && this.code.length == 6)
					this.disable = false;
				else
					this.disable = true;
			},
			
			canSendMailCode(){
				if (this.checkMail())
					this.canSendMail = true
				else
					this.canSendMail = false
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