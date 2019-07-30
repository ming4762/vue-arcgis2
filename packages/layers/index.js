import GraphicsLayer from './src/GraphicsLayer'

GraphicsLayer.install = (Vue) => {
  Vue.component(GraphicsLayer.name, GraphicsLayer)
}

export {
  GraphicsLayer
}
