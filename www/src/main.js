import Vue from 'vue'
import App from './App.vue'

import Element from 'element-ui'

import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import router from './router'

import './styles/element-variables.scss'

Vue.config.productionTip = false

Vue.use(Element)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
