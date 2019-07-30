import ArcgisMap from './src/ArcgisMap'

ArcgisMap.install = (Vue) => {
  Vue.component(ArcgisMap.name, ArcgisMap)
}

export {
  ArcgisMap
}
