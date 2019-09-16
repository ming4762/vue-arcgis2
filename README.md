## arcgis-view组件

### Attributes
参数 | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
mixed | 2D、3D混合图层 | Boolean | | false
jsUrl | init.js路径| string | |
jsBaseUrl | arcgis baseUrl | string | |
viewType | 视图类型，mixed为true时该属性无效 | string | 2D、3D | 2D
extent | 视图边界，参考arcgis文档 | object | |
center | 视图中心点，参考arcgis文档 | Array<Number> | | 
showCursorXY | 是否显示鼠标坐标点 | Boolean | | false
zoom | 视图默认缩放等级 | number | | 

### Methods
方法名 | 说明 | 参数 | 返回值
-|-|-|-
getActiveView | 获取当前激活的视图 | | arcgis view 实例

### Events
支持所有arcgis view原生事件
事件名 | 说明 | 参数
-|-|-
one-created | 单个arcgis view创建完成触发 | 创建的view
all-created | 所有arcgis view创建完成触发| 
switch-view | 切换arcgis view 触发| 


---


## arcgis-map组件

### Attributes
参数 | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
basemap | 底图，base-map组件存在时无效 | string | 参考arcgis文档| 
ground | 地图地面属性（地图为3D地图时有效）| string |参考arcgis文档| 
### Methods
方法名 | 说明 | 参数 | 返回值
-|-|-|-
getMap | 获取arcgis map | | arcgis map 实例

### Events
事件名 | 说明 | 参数
-|-|-

---
## base-map组件
待开发

---

## graphics-layer组件

### Attributes
参数 | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
data | 图层数据 | Array | | []
graphicType | 图层类型（优先使用数据中指定的图层类型）| string |point，polyline，polygon| 
symbol | 图层symbol，（优先使用数据中指定的图层类型）|object | 
### Methods
方法名 | 说明 | 参数 | 返回值
-|-|-|-
getGraphics | 获取图层元素Graphics | | 
getGraphicsById| 通过ID获取元素 | string | Graphics/null
getExtent | 获取图层所有元素的extent | | Object

### Events
事件名 | 说明 | 参数
-|-|-
graphics-added | 所有元素添加完毕时触发| 

---

## web-tile-layer组件

### Attributes
参数 | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
preset | 预设模板 | string | shandong：山东天地图，global：全国天地图, global_node：全国天地图注记，global_water：全国天地图水系，global_image：全国天地图影像，global_terrain：全国天地图地形| 
urlTemplate | 资源地址模板| string || 
copyright | 参考arcgis文档|string | |
tileInfo | 参考arcgis 文档| object| |
token | 全国天地图key | string | |
spatialReference | 坐标系 | object | | 4326
### Methods
方法名 | 说明 | 参数 | 返回值
-|-|-|-


### Events
事件名 | 说明 | 参数
-|-|-
