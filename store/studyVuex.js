import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
		count: uni.getStorageSync('test')
	},
	mutations: {  
		increment(state) {  // 同步变化state.count，页面中使用store.state.commit('XXX', payload)调用
			state.count++
		}
	},
	getters: {  // 当count变化得时候触发该有相关依赖得函数
		deplayMethod(state) {
			return state.count + 2
		}
	},
	actions: {  
		increment(context) { // 异步变化state.count
			context.commit('increment')  // 触发mutations的increment方法，页面中使用store.dispatch('XXX', payload)调用
		}
	}
}