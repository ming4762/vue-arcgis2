import ArcgisView from './src/main.vue'

ArcgisView.install = (Vue) => {
  Vue.component(ArcgisView.name, ArcgisView)
}

export default ArcgisView
