import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
		token: 'initing'
	},
	mutations: {  
		resetToken(state, payload) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.token = payload
		}
	},
	getters: {  // 当count变化得时候触发该有相关依赖得函数
		
	},
	actions: {  
		
	}
}