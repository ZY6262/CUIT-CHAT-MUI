import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
		friendRequest: 0,
		groupRequest: 0,
		chatMsg: 0
	},
	mutations: {  
		resetFriendRequest(state, payload) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.friendRequest = state.friendRequest + payload
			console.log('friendRequest以改变')
		},
		clearFriendRequest(state){
			state.friendRequest = 0
		},
		resetGroupRequest(state, payload) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.groupRequest = state.groupRequest + payload
			console.log('groupRequest以改变')
		},
		clearGroupRequest(state){
			state.groupRequest = 0
		},
		resetChatMsg(state, payload) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.chatMsg = state.chatMsg + payload
			console.log('chatMsg以改变')
		},
		clearChatMsg(state){
			state.chatMsg = 0
		}
	},
	getters: {  // 当count变化得时候触发该有相关依赖得函数
		
	},
	actions: {  
		
	}
}