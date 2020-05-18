import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
	state: {
		userInfo: {},
		hasLogin: false,
		firstTime: false,//是否是登陆后第一次进入我的
		// 全局短信验证码倒计时
		showSmsBtn: true,
		smsBtnText:'60秒后重新获取'
	},
	mutations: {
		login(state, provider) {//改变登录状态
			state.hasLogin = true 
			state.userInfo = provider
			uni.setStorage({//将用户信息保存在本地
				key: 'userInfo',
				data: provider
			})
			uni.setStorage({//将用户信息保存在本地
				key: 'hasLogin',
				data: true
			})
		},
		logout(state) {//退出登录
			state.hasLogin = false
			state.userInfo = {}
			uni.removeStorage({
				key: 'userInfo'
			})
			uni.removeStorage({
				key: 'hasLogin'
			})
		},
		// 全局短信验证码方法
		smsCountdown(state){
			let guiNum = '60';
			state.showSmsBtn = false
			state.smsBtnText = guiNum+'秒后重新获取'
			let guideTimer = setInterval(()=>{
				guiNum = guiNum - 1
				state.smsBtnText = guiNum+'秒后重新获取'
				if(guiNum == '0'){
					clearInterval(guideTimer)
					state.showSmsBtn = true
				}
			},1000)
		}
	},
})

export default store
