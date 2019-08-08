import GraphicsLayer from './src/GraphicsLayer'

import WebTileLayer from './src/WebTileLayer'

GraphicsLayer.install = (Vue) => {
  Vue.component(GraphicsLayer.name, GraphicsLayer)
}

WebTileLayer.install = (Vue) => {
  Vue.component(WebTileLayer.name, WebTileLayer)
}

export {
  GraphicsLayer,
  WebTileLayer
}
