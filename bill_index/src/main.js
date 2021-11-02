// 在mian.js中有根组件的js 唯一的new Vue()  将App.vue中的内容代替index.htlm中的#app进行渲染

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
