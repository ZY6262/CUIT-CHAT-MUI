import Vue from 'vue'
import App from './App'
import store from 'store/index.js'

import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import formUnit from '@/components/form-unit/form-unit.vue'
Vue.component('formUnit', formUnit)

import mine from './pages/mine/home.vue'
Vue.component('mine',mine)

import discover from './pages/discover/home.vue'
Vue.component('discover',discover)

import friends from './pages/friends/home.vue'
Vue.component('friends',friends)

import chat from './pages/chat/home.vue'
Vue.component('chat',chat)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store: store
})
app.$mount()


 



