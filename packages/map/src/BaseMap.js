import GisUtil from '../../../src/utils/GisUtil'


const name = 'base-map'

export default {
  name: name,
  props: {
    id: String,
    title: String
  },
  data () {
    return {
      name: name,
      // 视图容器对象
      viewContainer: null,
      baseap: null
    }
  },
  methods: {
    // --------- 公共方法 -------------
    /**
     * 初始化方法
     * @returns {Promise<void>}
     */
    init: async function (viewContainer) {
      this.viewContainer = viewContainer
      const [Basemap] = await GisUtil.loadModules('esri/Basemap')
      this.baseap = new Basemap(this.initMapProperties())
      // 添加图层
      this.initLayers()
      return this.baseap
    },
    // -------- 私有方法 ----------
    initLayers () {
      // 初始化图层
      if (this.$children.length > 0) {
        let indexObject = {
          index: 1
        }
        this.recursionInit(this.$children, indexObject)
      }
    },
    /**
     * 初始化地图参数
     */
    initMapProperties () {
      const properties = {
        baseLayers: []
      }
      if (this.id != null) {
        properties.id = this.id
      }
      if (this.title != null) {
        properties.title = this.title
      }
      return properties
    },
    /**
     * 使用递归初始化图层
     */
    recursionInit (children, indexObject) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child['type'] === 'layer') {
          indexObject.index = indexObject.index + 1
          child.init(this.viewContainer, indexObject.index, (gisLayer) => {
            this.baseap.baseLayers.push(gisLayer)
          })
          // const layer = await child.init(this.viewContainer, indexObject.index)
          // properties.baseLayers.push(layer)
        }
        if (child.$children.length > 0 && child.name !== 'base-map') {
          this.recursionInit(child.$children, indexObject)
        }
      }
    }
  },
  /* eslint-disable */
  render (h) {
    return (
      <div>
        {
          this.$slots.default
        }
      </div>
    )
  }
}
