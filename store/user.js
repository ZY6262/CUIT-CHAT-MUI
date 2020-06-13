import Vue from 'vue'
import Vuex from 'vuex'
import userService from '../service/UserService.js'

Vue.use(Vuex);

export default {
    state: {
		id: '', 
		mail: '', 
		password: '', 
		nickname: '', 
		sex: true,
	    qrcode: '', 
		faceImg: '', 
		faceImgBig: '', 
		birthday: '', 
	    phone: '', 
		address: '', 
		description: '', 
		cid: ''
	},
	mutations: {  
		resetUser(state, payload) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.id = payload.id
			state.mail = payload.mail
			state.password = payload.password
			state.nickname = payload.nickname
			state.sex = payload.sex
			state.qrcode = payload.qrcode
			state.faceImg = payload.faceImg
			state.faceImgBig = payload.faceImgBig
			state.birthday = payload.birthday
			state.phone = payload.phone
			state.address = payload.address
			state.description = payload.description
			state.cid = payload.cid
		},
		resetNickname(state, payload){
			console.log('修改昵称')
			console.log(payload)
			state.nickname = payload.newNickname
			console.log(payload._this)
			userService.updateUser(state, payload._this)
		},
		resetSex(state, payload){
			state.sex = payload.newSex
			userService.updateUser(state, payload._this)
		},
		resetFace(state, newUrl){
			state.faceImg = newUrl.faceImg
			state.faceImgBig = newUrl.faceImgBig
		},
		resetBirthday(state, payload){
			state.birthday = payload.newBirthday
			userService.updateUser(state, payload._this)
		},
		resetPhone(state, payload){
			state.phone = payload.newPhone
			userService.updateUser(state, payload._this)
		},
		resetAddress(state, payload){
			console.log('修改地址')
			state.address = payload.newAddr
			userService.updateUser(state, payload._this)
		},
		resetDescription(state, payload){
			state.description = payload.newDesc
			userService.updateUser(state, payload._this)
		}
	},
	getters: {  // 当count变化得时候触发该有相关依赖得函数
		
	},
	actions: {  
		
	}
}