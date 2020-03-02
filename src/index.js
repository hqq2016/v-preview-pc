import Viewer from './viewer.vue'

let Vue
let instance
// 单例模式
let getVueInstance = () => {
  instance = new Vue({
    render: h => h(Viewer)
  }).$mount()
  // 插入到页面
  document.body.appendChild(instance.$el)
}

const VPreview = {
  show(...args) {
    !instance && getVueInstance()
    instance.$children[0].show(...args)
  }
}

const install = (_Vue) => {
  // 挂载全局Vue
  Vue = _Vue
  // Vue.component(Viewer.name, Viewer)
  let $vPreview = {}
  Object.keys(VPreview).forEach(key=>{
      $vPreview[key] = VPreview[key];
  })
  // 一般使用新对象时 就采用拷贝的方式
  Vue.prototype.$vPreview  = $vPreview 
}

if (typeof window !== undefined && window.Vue) {
  install(window.Vue)
}

export default {
  install
}