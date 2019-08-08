// 视图组件
import ArcgisView from '../packages/view'
import {
  GraphicsLayer,
  WebTileLayer
} from '../packages/layers'

import {
  ArcgisMap
} from '../packages/map'

const components = [
  ArcgisView,
  GraphicsLayer,
  WebTileLayer,
  ArcgisMap
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

export default {
  install,
  ...components
}
