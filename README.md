PC图片预览插件
--------

 - 引用方式

全局引用
```html
<link href="node_modules/v-preview-pc/dist/index.css" rel="stylesheet">
<script src="node_modules/v-preview-pc/dist/index.js"></script>
//引入vue后
<script>
  // 自动注入，挂载到Vue.prototype.$vPreview，使用this.$vPreview.show()调用
	//Vue.use(vPreview.default)
</script>
```

ES6引用
使用方式
```javascript
// main.js
import vPreview from 'v-preview-pc'
import 'v-preview-pc/dist/index.css'
Vue.use(vPreview)
```

```html
<!-- 组件内使用 -->
<template>
  <div>
    我是模板
    <button @click="showPreview">点击弹框</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        'https://picsum.photos/id/35/1440/900',
        'https://picsum.photos/id/36/1440/900',
        'https://picsum.photos/id/37/1440/900'
      ],
    }
  },
  methods: {
    showPreview() {
      this.$vPreview.show(this.imgList, {
        currentIndex: 0, //默认显示索引值
        initW: 800 //默认显示宽度，默认值800
      })
    }
  }
}
</script>
```
