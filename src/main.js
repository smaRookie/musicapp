// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
// 懒加载图片   具体参数看文档
import VueLazyLoad from 'vue-lazyload'
import './common/less/index.less'

Vue.use(VueLazyLoad, {
  // @/common/image/default.png 当图片为加载时用这张图片代替
  loading: require('@/common/image/default.png')
})

Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
