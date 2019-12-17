import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 网站入口，一个搜索框
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
