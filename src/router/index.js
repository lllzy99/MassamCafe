import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入路由文件
import {routes} from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
