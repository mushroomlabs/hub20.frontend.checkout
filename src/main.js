import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

import App from './App'
import store from '@/store'

Vue.use(VueClipboard)

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
