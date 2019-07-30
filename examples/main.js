import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Arcgis from '../src/index'

Vue.use(Arcgis)

new Vue({
  render: h => h(App),
}).$mount('#app')
