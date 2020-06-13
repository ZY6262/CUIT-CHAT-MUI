import Vue from 'vue'
import Vuex from 'vuex'
import studyVuex from './studyVuex.js'
import tokenStore from './token.js'
import user from './user.js'
import timer from './timer.js'
import websocket from './websocket.js'
import badge from './badge.js'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		study: studyVuex,
		token: tokenStore,
		user: user,
		timer: timer,
		websocket: websocket,
		badge: badge
	} 
})