import BaseLayer from './mixins/BaseLayer'
import GisUtil from '../../../src/utils/GisUtil'

import { LAYER_TYPE, getSymbol } from './Common'

let GisGraphicsLayer = null

export default {
  name: 'graphics-layer',
  mixins: [ BaseLayer ],
  props: {
    // 图层数据
    data: {
      type: Array,
      default: () => []
    },
    // 图层类型
    graphicType: String,
    // 图层样式
    symbol: Object
  },
  data () {
    return {
      // 图层数据
      graphicDataList: []
    }
  },
  watch: {
    /**
     * 监控数据变化
     */
    data: {
      deep: true,
      handler: function () {
        this.graphicDataList = this.convertData(this.data, this.graphicType)
        this.refreshGraphics()
      }
    }
  },
  methods: {
    /**
     * 获取图形元素集合
     */
    getGraphics () {
      return this.layer.graphics.items
    },
    /**
     * 根据ID获取图层元素
     * @param id 图层元素ID
     */
    getGraphicsById (id) {
      let result = null
      for (let graphic of this.getGraphics()) {
        if (graphic.attributes && graphic.attributes.id === id) {
          result = graphic
          break
        }
      }
      return result
    },
    /**
     * 获取图层边界
     */
    getExtent () {
      const graphicList = this.getGraphics()
      if (graphicList.length === 0) {
        return null
      } else {
        let xmax = 0
        let ymax = 0
        let xmin = 0
        let ymin = 0
        graphicList.forEach(graphic => {
          const extent = graphic.geometry.extent
          if (xmax === 0 || xmax < extent.xmax) {
            xmax = extent.xmax
          }
          if (ymax === 0 || ymax < extent.ymax) {
            ymax = extent.ymax
          }
          if (extent.xmin !== null && (xmin === 0 || xmin > extent.xmin)) {
            xmin = extent.xmin
          }
          if (extent.ymin !== null && (ymin === 0 || ymin > extent.ymin)) {
            ymin = extent.ymin
          }
        })
        return {
          xmin: xmin,
          xmax: xmax,
          ymax: ymax,
          ymin: ymin
        }
      }
    },
    // -----------私有方法 ------------
    /**
     * 创建gis图层
     */
    async createGisLayer () {
      if (GisGraphicsLayer === null) {
        GisGraphicsLayer = (await GisUtil.loadModules('esri/layers/GraphicsLayer'))[0]
      }
      this.layer = new GisGraphicsLayer({
        id: this.id,
        title: this.title
      })
      // 执行回调
      if (this.createCallback) {
        this.createCallback(this.layer, this.getIndex())
      }
      // 加载数据
      this.loadData()
    },
    /**
     * 转换数据
     */
    convertData (dataList, baseGraphicType) {
      const graphicDataList = []
      dataList.forEach(item => {
        // 获取元素类型
        const graphicType = this.getGraphicType(item, baseGraphicType)
        switch (graphicType) {
          case LAYER_TYPE.POINT:
            graphicDataList.push(this.addPoint(item))
            break
          case LAYER_TYPE.POLYLIE:
            graphicDataList.push(this.addPolyline(item))
            break
          case LAYER_TYPE.POLYGON:
            graphicDataList.push(this.addPolygon(item))
            break
        }
      })
      return graphicDataList
    },
    /**
     * 获取元素的类型
     */
    getGraphicType (data, baseGraphicType) {
      const graphicType = data.graphicType || baseGraphicType
      if (!graphicType) {
        /* eslint-disable */
        console.warn('获取元素类型失败')
      }
      return graphicType
    },
    /**
     * 添加点
     * @param pointData
     */
    addPoint (pointData) {
      const point = this.addSpatialReference({
        type: 'point',
        longitude: pointData.x,
        latitude: pointData.y
      }, pointData)
      return {
        geometry: point,
        symbol: getSymbol(pointData, LAYER_TYPE.POINT, this.symbol),
        attributes: pointData.attributes
      }
    },
    /**
     * 添加线
     * @param lineData
     */
    addPolyline (lineData) {
      const polyline = this.addSpatialReference({
        type: 'polyline',
        paths: lineData.paths
      }, lineData)
      return {
        geometry: polyline,
        symbol: getSymbol(lineData, LAYER_TYPE.POLYLIE, this.symbol),
        attributes: lineData.attributes
      }
    },
    /**
     * 添加面
     * @param polygonData
     * @returns {{symbol: ({color: number[], type: string}|{outline: {color: number[], width: number}, color: number[], type: string}|{color: number[], width: number, type: string}|Runtime.RemoteObject|ObjectConstructor|SVGSymbolElement), geometry: *, attributes: (*|attributes|{src}|ActiveX.ISchemaItemCollection|boolean|NamedNodeMap|ActiveX.IXMLDOMNamedNodeMap)}}
     */
    addPolygon (polygonData) {
      const polygon = this.addSpatialReference({
        type: 'polygon',
        rings: polygonData.rings
      }, polygonData)
      return {
        geometry: polygon,
        symbol: getSymbol(polygonData, LAYER_TYPE.POLYGON, this.symbol),
        attributes: polygonData.attributes
      }
    },
    /**
     * 添加spatialReference
     * @param geometry
     * @param data
     * @returns {*}
     */
    addSpatialReference: function (geometry, data) {
      if (data.spatialReference) {
        geometry = Object.assign({
          spatialReference: data.spatialReference
        }, geometry)
      }
      return geometry
    },
    /**
     * 加载数据
     */
    loadData () {
      this.graphicDataList = this.convertData(this.data, this.graphicType)
      this.addGraphics()
    },
    /**
     * 添加元素
     */
    addGraphics () {
      GisUtil.loadModules('esri/Graphic').then(([Graphic]) => {
        const graphics = []
        this.graphicDataList.forEach(graphicData => {
          graphics.push(new Graphic(graphicData))
        })
        this.layer.addMany(graphics)
        const listener = 'graphics-added'
        if (this.$listeners[listener]) {
          this.$emit(listener, graphics)
        }
      })
    },
    /**
     * 刷新元素
     */
    refreshGraphics () {
      // 删除元素
      if (this.layer) {
        this.layer.removeAll()
        this.addGraphics()
      }
    }
  },
  /**
   * 渲染函数
   * @param h
   * @returns {undefined}
   */
  /* eslint-disable */
  render (h) {
    return undefined
  }
}
