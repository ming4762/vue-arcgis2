
<script>
import GisUtil from '../../../src/utils/GisUtil'
import { gisOption } from '../../../src/config/GisConfig'

export const ViewType = {
  VIEW_3D: '3D',
  VIEW_2D: '2D'
}

const events = {
  switchView: 'switch-view'
}

/**
 * arcgis 原生事件
 */
const ARCGIS_EVENT = [
  'blur',
  'double-click',
  'drag',
  'focus',
  'hold',
  'immediate-click',
  'key-down',
  'key-up',
  'layerview-create',
  'layerview-destroy',
  'mouse-wheel',
  'pointer-down',
  'pointer-enter',
  'pointer-leave',
  'pointer-up',
  'resize'
]

export default {
  name: 'arcgis-view',
  props: {
    // 是否是混合图层
    mixed: {
      type: Boolean,
      default: false
    },
    jsUrl: String,
    jsBaseUrl: String,
    // 视图类型，mixed为true，改属性无效
    viewType: {
      type: String,
      default: ViewType.VIEW_2D
    },
    // 视图边界
    extent: {
      type: Object
    },
    // 地图中心点
    center: {
      type: Array
    },
    // 显示鼠标坐标
    showCursorXY: {
      type: Boolean,
      default: false
    },
    // 视图缩放等级
    zoom: {
      type: Number
    }
  },
  data () {
    const elementId = new Date().getTime() + ''
    return {
      // 视图容器
      viewContainer: {
        mapView: null,
        sceneView: null,
        activeView: null,
        container: elementId
      },
      // 鼠标点
      cursorPoint: {},
      // 地图对象
      map: {},
      // 地图vue实例
      mapVue: null
    }
  },
  created () {
    gisOption.url = this.jsUrl
    gisOption.dojoConfig.baseUrl = this.jsBaseUrl
  },
  mounted () {
    // 创建视图
    this.createView()
  },
  watch: {
    /**
     * 监控extent变化
     * TODO:待测试
     */
    extent: {
      deep: true,
      handler: function (_new) {
        if (_new) {
          this.getActiveView().extent = _new
        }
      }
    },
    /**
     * 监控中心点变化
     * TODO:待测试
     */
    center () {
      if (this.center) {
        this.getActiveView.center = this.center
      }
    },
    /**
     * 监控缩放等级变化变化
     * TODO:待测试
     */
    zoom () {
      if (this.zoom) {
        this.getActiveView.zoom = this.zoom
      }
    }
  },
  methods: {
    /**
     * 获取激活状态的view
     * @returns {null}
     */
    getActiveView: function () {
      return this.viewContainer.activeView
    },
    /**
     * 设置视图中心
     */
    setCenter: function (point) {
      this.getActiveView().center = point
    },
    // ---------------- 私有方法 ----------------
    /**
     * 创建视图
     */
    async createView () {
      // 创建地图
      const map = await this.createMap()
      // 视图初始化参数
      const initialViewParams = {
        map: map,
        container: this.viewContainer.container,
        constraints: {
          rotationEnabled: false
        },
        viewType: this.viewType
      }
      if (this.extent) {
        initialViewParams.extent = this.extent
      }
      if (this.center) {
        initialViewParams.center = this.center
      }
      if (this.zoom) {
        initialViewParams.zoom = this.zoom
      }
      if (this.mixed) {
        this.create2D3DView(initialViewParams)
      } else {
        this.createOneView(initialViewParams)
      }
    },
    /**
     * 创建地图实例
     */
    async createMap () {
      let promiseMethod = null
      for (let i = 0; i < this.$children.length; i++) {
        let mapVue = this.$children[i]
        if (mapVue['name'] === 'arcgis-map') {
          this.mapVue = mapVue
          promiseMethod = mapVue.init
        }
      }
      let map = null
      if (promiseMethod != null) {
        map = await promiseMethod(this.viewContainer)
      } else {
        map = await this.createDefaultMap()
      }
      return map
    },
    /**
     * 创建默认地图
     * @returns {Promise<void>}
     */
    async createDefaultMap () {
      const [Map] = await GisUtil.loadModules('esri/Map')
      const properties = {
        basemap: 'satellite'
      }
      if (this.mixed) {
        properties.ground = 'world-elevation'
      }
      return new Map(properties)
    },
    /**
     * 创建单一视图
     * @returns {Promise<void>}
     */
    async createOneView (initialViewParams) {
      let viewType = initialViewParams.viewType
      await this.doCreateView(initialViewParams, viewType)
      if (viewType === ViewType.VIEW_2D) {
        this.viewContainer.activeView = this.viewContainer.mapView
      } else {
        this.viewContainer.activeView = this.viewContainer.sceneView
      }
      this.getActiveView().when(() => {
        this.allCreateEvent()
      })
    },
    /**
     * 创建2D 3D混合视图
     */
    async create2D3DView (initialViewParams) {
      // 创建2d视图
      return this.doCreateView(initialViewParams, ViewType.VIEW_2D)
        .then(view => {
          this.viewContainer.activeView = view
          // 创建3d视图
          initialViewParams.container = null
          this.doCreateView(initialViewParams, ViewType.VIEW_3D)
          this.viewContainer.activeView = this.viewContainer.mapView
          this.allCreateEvent()
        })
    },
    /**
     * 创建视图
     * @param params 视图参数
     * @param type 视图类型
     * @returns {Promise<void>}
     */
    async doCreateView (params, type) {
      const [MapView, SceneView] = await GisUtil.loadModules('esri/views/MapView', 'esri/views/SceneView')
      let view
      let is2D = type === ViewType.VIEW_2D
      if (is2D) {
        view = new MapView(params)
        this.viewContainer.mapView = view
        this.viewContainer.mapView.when(() => {
          this.addEvent(view)
          this.oneCreatedEvent(view)
        })
      } else {
        view = new SceneView(params)
        this.viewContainer.sceneView = view
        this.viewContainer.sceneView.when(() => {
          this.addEvent(view)
          this.oneCreatedEvent(view)
        })
      }
      // 移除下方介绍
      view.ui.remove('attribution')
      if (this.showCursorXY) {
        view.ui.add('cursorXYSpan', 'bottom-left')
      }
    },
    /**
     * 添加事件
     */
    addEvent (view) {
      // 添加鼠标移动事件
      const pointerMove = 'pointer-move'
      if (this.$listeners[pointerMove] || this.showCursorXY === true) {
        view.on(pointerMove, event => {
          if (this.$listeners[pointerMove]) {
            if (event.x !== 0 && event.y !== 0) {
              view.hitTest(event).then(response => {
                this.$emit(pointerMove, event, response['results'])
              })
            }
          }
          if (this.showCursorXY === true) {
            this.handleShowCursorXY(event)
          }
        })
      }
      // 鼠标点击事件
      const pointerClick = 'pointer-click'
      if (this.$listeners[pointerClick]) {
        view.on('click', event => {
          if (event.x !== 0 && event.y !== 0) {
            view.hitTest(event).then(response => {
              this.$emit(pointerClick, event, response['results'])
            })
          }
        })
      }

      // 绑定其他事件
      ARCGIS_EVENT.forEach(eventName => {
        if (this.$listeners[eventName]) {
          view.on(eventName, this.$listeners[eventName])
        }
      })
    },
    /**
     * 显示xy坐标
     * @param event
     */
    handleShowCursorXY (event) {
      // 获取经纬度
      this.cursorPoint = this.getActiveView().toMap({
        x: event.x,
        y: event.y
      })
    },
    /**
     * 单一视图创建完毕事件
     */
    oneCreatedEvent: function (view) {
      if (this.$listeners['one-created']) {
        this.$emit('one-created', view)
      }
    },
    /**
     * 所有视图创建完毕事件
     */
    allCreateEvent: function () {
      // 初始化图层
      if (this.mapVue) {
        // TODO:设置view对象
        this.mapVue.initLayer()
      }
      if (this.$listeners['all-created']) {
        this.$emit('all-created')
      }
    },
    /**
     * 切换视图
     */
    switchView () {
      const is3D = this.getActiveView().type === '3d'
      const viewpoint = this.viewContainer.activeView.viewpoint.clone()
      this.getActiveView().container = null
      if (is3D) {
        // 获取当前视图中心店
        this.viewContainer.mapView.viewpoint = viewpoint
        this.viewContainer.mapView.container = this.viewContainer.container
        // 设置激活视图
        this.viewContainer.activeView = this.viewContainer.mapView
      } else {
        this.viewContainer.sceneView.viewpoint = viewpoint
        this.viewContainer.sceneView.container = this.viewContainer.container
        this.viewContainer.activeView = this.viewContainer.sceneView
      }
      // 视图切换事件
      if (this.$listeners[events.switchView]) {
        this.$emit(this.$listeners[events.switchView])
      }
    },
    /**
     * 设置esri配置
     * TODO:测试代码
     */
    async setEsriConfig () {
      const [esriConfig] = await GisUtil.loadModules('esri/config')
      // esriConfig.fontsUrl = 'http://192.168.1.140:6081/arcgis_js_v410_api/fonts/'
      esriConfig.fontsUrl = 'http://localhost:8082/js/arcgis/fonts/'
      return esriConfig
    }
  },
  /**
   * 渲染函数
   * @param h
   */
  /* eslint-disable */
  render(h) {
    return (
      <div class="arcgis-full-height">
        <div id={this.viewContainer.container} class="arcgis-full-height"/>
        {
          this.mixed
            ? <div class="view-switch">
              <input onClick={this.switchView} class="esri-component esri-widget--button esri-widget esri-interactive" type="button" value="3D"/>
            </div>
            : ''
        }
        {
          this.$slots.default
        }
        {
          this.showCursorXY
            ? <span id="cursorXYSpan">经度：{this.cursorPoint.x}&nbsp;&nbsp;维度：{this.cursorPoint.y}</span>
            : ''
        }
      </div>
    )
  }
}
</script>

<style>
  .view-switch {
    position: absolute;
    top: 15px;
    left: 60px;
  }
  .view-switch input {
    border: none;
    box-shadow:  rgba(0, 0, 0, 0.3) 0 1px 2px;
  }
  .arcgis-full-height {
    height: 100%;
  }
</style>
