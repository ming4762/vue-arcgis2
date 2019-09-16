import Vue from 'vue'

// 视图组件
import ArcgisView from '../packages/view'
import {
  GraphicsLayer,
  WebTileLayer
} from '../packages/layers'

import {
  ArcgisMap,
  BaseMap
} from '../packages/map'

const components = [
  ArcgisView,
  GraphicsLayer,
  WebTileLayer,
  ArcgisMap,
  BaseMap
]

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  // 遍历并注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const installComponents = {
  install,
  ...components
}

Vue.use(installComponents)

