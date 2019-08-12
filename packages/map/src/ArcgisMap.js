import GisUtil from '../../../src/utils/GisUtil'
const name = 'arcgis-map'
export default {
  name: name,
  props: {
    // 底图
    basemap: String,
    // 地图的地面属性（地图为3D地图时有效）
    ground: String
  },
  data () {
    return {
      name: name,
      // 地图对象
      map: null,
      // 视图容器对象
      viewContainer: null
    }
  },
  methods: {
    init (viewContainer) {
      this.viewContainer = viewContainer
      return this.create()
    },
    /**
     * 初始化图层
     */
    initLayer () {
      let indexObject = {
        index: 1
      }
      if (this.$children.length > 0) {
        this.recursionInit(this.$children, indexObject)
      }
    },
    /**
     * 获取地图对象
     */
    getMap () {
      return this.map
    },
    // ----------- 私有方法 ----------
    async create () {
      const [Map] = await GisUtil.loadModules('esri/Map')
      this.map = new Map(await this.initMapProperties())
      return this.map
    },
    /**
     * 初始化地图参数
     * @returns {Promise<void>}
     */
    initMapProperties: async function () {
      return {
        basemap: await this.getBaseMap()
      }
      // TODO: (待完善)获取ground
    },
    /**
     * 获取底图
     * @returns {Promise<*>}
     */
    async getBaseMap () {
      let baseMap = null
      for (let i = 0; i < this.$children.length; i++) {
        const child = this.$children[i]
        if (child.name === 'base-map') {
          baseMap = await child.init(this.viewContainer)
        }
      }
      if (baseMap === null) {
        baseMap = this.basemap || 'satellite'
      }
      return baseMap
    },
    /**
     * 使用递归初始化图层
     */
    recursionInit (children, indexObject) {
      children.forEach(child => {
        if (child['type'] === 'layer') {
          this.addLayer(child, indexObject.index)
          indexObject.index = indexObject.index + 1
        }
        if (child.$children.length > 0 && child.name !== 'base-map') {
          this.recursionInit(child.$children, indexObject)
        }
      })
    },
    /**
     * 添加图层
     * @param layerVue layer vue对象
     * @param index 图层序号
     */
    addLayer: function (layerVue, index) {
      // 初始化图层对象
      layerVue.init(this.viewContainer, index, (gisLayer, index) => {
        this.map.add(gisLayer, index)
      })
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
