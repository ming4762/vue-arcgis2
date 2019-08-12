export default {
  props: {
    // 图层ID
    id: String,
    // 图层可见状态
    visible: {
      type: Boolean,
      default: true
    },
    // 标题
    title: String,
    // 序号
    index: Number,
  },
  data () {
    return {
      // layer实体
      layer: null,
      type: 'layer',
      // 默认的需要由调用图层单位设定
      defaultIndex: 0,
      // 创建完毕回调
      createCallback: null,
      // 视图容器
      viewContainer: null
    }
  },
  watch: {
    /**
     * 监控显示状态变化
     * @param _new
     * @param old
     */
    visible: function (_new, old) {
      if (_new !== old) {
        if (this.layer !== null) {
          this.layer.visible = _new
        } else if (_new === true) {
          this.createGisLayer()
        }
      }
    }
  },
  methods: {
    // 初始化函数
    init (viewContainer, index, callback) {
      this.defaultIndex = index
      this.viewContainer = viewContainer
      this.createCallback = callback
      // 如果视图是可见的，初始化完毕后直接创建
      if (this.visible === true) {
        this.createGisLayer()
      }
    },
    createGisLayer () {
      /* eslint-disable */
      console.warn("未覆盖方法，未能创建图层")
    },
    /**
     * 获取图层显示状态
     */
    getVisible () {
      return this.visible
    },
    /**
     * 获取序号
     */
    getIndex: function () {
      if (this.index) {
        return this.index
      } else {
        return this.defaultIndex
      }
    },
    /**
     * 获取地图实例
     */
    getGisMap () {
      if (this.viewContainer === null) {
        return null
      } else {
        return this.viewContainer.activeView.map
      }
    }
  }
}
