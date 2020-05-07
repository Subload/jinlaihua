import Vue from 'vue'
import App from './App'
import store from './store'

import Api from './utils/api.js'
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue" // 下拉刷新
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue" // 下拉刷新
import AutoNavBar from "@/components/auto-nav-bar/auto-nav-bar.vue" // 自定义标题
import ProjectList from "@/components/project-list/project-list.vue" // 个人中心 设置列表
import ProductList from "@/components/product-list/product-list.vue" // 产品列表
import mzNetworkError from '@/components/mz-network-error/mz-network-error.vue' // 网络判断
import xwEmpty from '@/components/xw-empty/xw-empty'; // 列表数据为空，页面友好展示
import clTabs from '@/components/cl-tabs/cl-tabs.vue' // tabs

Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)	
Vue.component('auto-nav-bar',AutoNavBar)	
Vue.component('project-list',ProjectList)	
Vue.component('product-list',ProductList)	
Vue.component('mz-network-error',mzNetworkError)	
Vue.component('xw-empty',xwEmpty)	
Vue.component('cl-tabs',clTabs)	

Vue.prototype.$API = Api
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
	
})
app.$mount()
