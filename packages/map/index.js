import ArcgisMap from './src/ArcgisMap'

import BaseMap from './src/BaseMap'

ArcgisMap.install = (Vue) => {
  Vue.component(ArcgisMap.name, ArcgisMap)
}

BaseMap.install = (Vue) => {
  Vue.component(BaseMap.name, BaseMap)
}

export {
  ArcgisMap,
  BaseMap
}
