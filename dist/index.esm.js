//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

function getBrowerInfo() {
  var winHeight = void 0,
      winWidth = void 0;
  //获取窗口宽度
  if (window.innerWidth) winWidth = window.innerWidth;else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;
  //获取窗口高度
  if (window.innerHeight) winHeight = window.innerHeight;else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight;
  //通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }
  return {
    winWidth: winWidth,
    winHeight: winHeight
  };
}
var script = {
  name: 'vPreview',
  data: function data() {
    return {
      images: [],
      initW: 800,
      isShow: false,
      isLoading: false,
      isLoadingDelay: false,
      isShowToolTip: false,
      toolTipTimer: null,
      isError: false,
      currentIndex: 0,
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      diffX: 0,
      diffY: 0,
      isMouseDown: false,
      browerInfo: {
        winWidth: 0,
        winHeight: 0
      },
      info: {
        w: 0,
        h: 0,
        l: 0,
        t: 0,
        rW: 0,
        rH: 0,
        rotate: 0
      }
    };
  },
  created: function created() {
    this.browerInfo = getBrowerInfo();
  },
  beforeDestory: function beforeDestory() {
    this.removeEvent();
  },

  methods: {
    showToolTip: function showToolTip() {
      if (this.toolTipTimer) {
        clearTimeout(this.toolTipTimer);
      }
      this.isShowToolTip = true;
      this.hideToolTip();
    },
    hideToolTip: function hideToolTip() {
      var _this = this;

      this.toolTipTimer = setTimeout(function () {
        _this.isShowToolTip = false;
      }, 1000);
    },

    // 放大
    bigger: function bigger() {
      this.showToolTip();
      var oldH = this.height;
      var diffW = Math.ceil(Math.min(this.width, this.info.rW) * 0.1);
      this.info.w = this.width + diffW;
      // 设置完宽度获取高度差
      var diffH = this.height - oldH;
      this.info.l = this.marginLeft - Math.ceil(diffW / 2);
      this.info.t = this.marginTop - Math.ceil(diffH / 2);
    },

    // 缩小
    smaller: function smaller() {
      this.showToolTip();
      var oldH = this.height;
      var diffW = Math.ceil(Math.min(this.width, this.info.rW) * 0.1);
      this.info.w = this.width - diffW;
      // 设置完宽度获取高度差
      var diffH = this.height - oldH;
      this.info.l = this.marginLeft + Math.ceil(diffW / 2);
      this.info.t = this.marginTop - Math.ceil(diffH / 2);
    },
    prev: function prev() {
      if (this.images && this.images.length > 1) {
        if (this.currentIndex <= 0) {
          this.currentIndex = this.images.length - 1;
        } else {
          this.currentIndex--;
        }
        this.loadImage(this.currentImage);
      }
    },
    next: function next() {
      if (this.images && this.images.length > 1) {
        if (this.currentIndex >= this.images.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
        this.loadImage(this.currentImage);
      }
    },
    loadImage: function loadImage(url) {
      var _this2 = this;

      this.isLoading = true;
      this.isLoadingDelay = false;
      this.isError = false;
      var img = new Image();
      img.src = url;
      var initW = Math.min(this.initW, Math.ceil(this.browerInfo.winWidth * 0.8));
      var callback = function callback() {
        _this2.info.rW = img.width;
        _this2.info.rH = img.height;
        _this2.info.w = initW > img.width ? img.width : initW;
        _this2.info.l = _this2.browerInfo.winWidth / 2 - _this2.width / 2;
        _this2.info.t = _this2.browerInfo.winHeight / 2 - _this2.height / 2;
        _this2.info.rotate = 0;
        _this2.isLoading = false;
        _this2.$nextTick(function () {
          _this2.isLoadingDelay = true;
        });
      };
      if (img.complete) {
        callback();
      } else {
        // 加载完成执行
        img.onload = function () {
          // 打印
          callback();
        };
        img.onError = function () {
          this.isError = true;
        };
      }
    },

    // 初始化数据
    resetData: function resetData() {},

    // 打开弹框
    show: function show(imgList) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // 给图片赋值
      if (Array.isArray(imgList)) {
        this.images = imgList;
      }
      var _options$currentIndex = options.currentIndex,
          currentIndex = _options$currentIndex === undefined ? 0 : _options$currentIndex,
          _options$initW = options.initW,
          initW = _options$initW === undefined ? 800 : _options$initW;

      if (!this.isShow) {
        this.addEvent();
      }
      this.browerInfo = getBrowerInfo();
      // 如果索引是数字超出边界也进行处理
      if (typeof currentIndex === 'number') {
        if (currentIndex < 0) {
          currentIndex = 0;
        } else if (currentIndex > this.images.length - 1) {
          currentIndex = this.images.length - 1;
        }
      } else {
        currentIndex = 0;
      }
      if (typeof initW === 'number') {
        if (initW <= 0) {
          window.console.log('初始宽度不可小于0');
        } else {
          this.initW = initW;
        }
      }
      this.currentIndex = currentIndex;
      this.isShow = true;
      this.loadImage(this.currentImage);
    },
    hide: function hide() {
      this.removeEvent();
      this.isShow = false;
    },
    addEvent: function addEvent() {
      window.addEventListener("resize", this.resizeFunc);
      window.addEventListener("keydown", this.keydownFunc);
      //    给页面绑定鼠标滚轮事件,针对火狐的非标准事件
      window.addEventListener("DOMMouseScroll", this.scrollFunc);
      //    给页面绑定鼠标滚轮事件，针对Google，mousewheel非标准事件已被弃用，请使用 wheel事件代替
      window.addEventListener("wheel", this.scrollFunc);
      //    ie不支持wheel事件，若一定要兼容，可使用mousewheel
      window.addEventListener("mousewheel", this.scrollFunc);
    },
    removeEvent: function removeEvent() {
      window.removeEventListener("keydown", this.keydownFunc);
      window.removeEventListener("DOMMouseScroll", this.scrollFunc);
      window.removeEventListener("wheel", this.scrollFunc);
      window.removeEventListener("mousewheel", this.scrollFunc);
    },
    resizeFunc: function resizeFunc() {
      this.browerInfo = getBrowerInfo();
      this.loadImage(this.currentImage);
    },
    keydownFunc: function keydownFunc(e) {
      e = e || event || window.event;
      if (e && e.keyCode == 27) {
        return this.hide();
      }
      if (e && e.keyCode == 37) {
        return this.prev();
      }
      if (e && e.keyCode === 39) {
        return this.next();
      }
    },
    scrollFunc: function scrollFunc(e) {
      e = e || window.event;
      if (e.wheelDelta) {
        if (e.wheelDelta > 0) {
          //当鼠标滚轮向上滚动时
          this.bigger();
        } else if (e.wheelDelta < 0) {
          //当鼠标滚轮向下滚动时
          this.smaller();
        }
      } else if (e.detail) {
        if (e.detail < 0) {
          //当鼠标滚轮向上滚动时
          this.bigger();
        } else if (e.detail > 0) {
          //当鼠标滚轮向下滚动时
          this.smaller();
        }
      }
    },

    // 鼠标按下，判断如果是点击弹框vp-dialog或者是vp-img-box
    mousedown: function mousedown(event) {
      var _this3 = this;

      var callback = function callback() {
        _this3.startX = event.clientX;
        _this3.startY = event.clientY;
        _this3.isMouseDown = true;
        window.addEventListener("mousemove", _this3.mousemove);
        window.addEventListener("mouseup", _this3.mouseup);
      };
      if (event.target.className === "vp-dialog" || event.target.parentNode.className.indexOf("vp-img-box") !== -1) {
        callback();
      }
    },
    mousemove: function mousemove(event) {
      if (this.isMouseDown) {
        this.isMouseDown = true;
        this.moveX = event.clientX;
        this.moveY = event.clientY;
        this.diffX = event.clientX - this.startX;
        this.diffY = event.clientY - this.startY;
      }
    },
    mouseup: function mouseup() {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        this.info.l = this.info.l + this.diffX;
        this.info.t = this.info.t + this.diffY;
        this.diffX = 0;
        this.diffY = 0;
        window.removeEventListener("mousemove", this.mousemove);
        window.removeEventListener("mouseup", this.mouseup);
      }
    }
  },
  computed: {
    imgStyle: function imgStyle() {
      var cell = Math.ceil;
      return {
        width: cell(this.width) + "px",
        height: cell(this.height) + "px",
        marginLeft: cell(this.marginLeft + this.diffX) + "px",
        marginTop: cell(this.marginTop + this.diffY) + "px",
        transform: 'rotate(' + this.rotate + 'deg)',
        "-webkit-transform": 'rotate(' + this.rotate + 'deg)',
        "-ms-transform": 'rotate(' + this.rotate + 'deg)',
        "-moz-transform": 'rotate(' + this.rotate + 'deg)',
        "-o-transform": 'rotate(' + this.rotate + 'deg)'
      };
    },
    boxEl: function boxEl() {
      return this.$refs.box;
    },

    // 当前显示的图片
    currentImage: function currentImage() {
      return this.images[this.currentIndex];
    },
    ratio: function ratio() {
      return this.info.rW / this.info.rH;
    },
    rotate: function rotate() {
      return this.info.rotate;
    },
    marginLeft: function marginLeft() {
      return this.info.l;
    },
    marginTop: function marginTop() {
      return this.info.t;
    },
    width: function width() {
      return this.info.w;
    },
    height: function height() {
      return this.info.w / this.ratio;
    },
    currentRatio: function currentRatio() {
      return Math.ceil(this.info.w / this.info.rW * 100);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook = void 0;
    if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
            // 2.3 injection
            context = context || // cached call
            this.$vnode && this.$vnode.ssrContext || // stateful
            this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    } else if (style) {
        hook = shadowMode ? function (context) {
            style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
        } : function (context) {
            style.call(this, createInjector(context));
        };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        } else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.isShow, expression: "isShow" }], staticClass: "vp-dialog", on: { "mousedown": _vm.mousedown } }, [_c('div', { directives: [{ name: "show", rawName: "v-show", value: !_vm.isLoading, expression: "!isLoading" }], staticClass: "vp-img-box", class: { transition: !_vm.isMouseDown && _vm.isLoadingDelay }, style: _vm.imgStyle }, [_c('img', { attrs: { "src": _vm.currentImage }, on: { "mousedown": function mousedown($event) {
        $event.preventDefault();
      } } })]), _vm._v(" "), _c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.isLoading, expression: "isLoading" }], staticClass: "vp-loading" }, [_c('span', { staticClass: "iconfont icon-loading vp-rotate vp-loading-icon" })]), _vm._v(" "), _c('div', { staticClass: "vp-img-toolbar" }, [_c('div', { staticClass: "tool", on: { "click": _vm.smaller } }, [_c('span', { staticClass: "iconfont icon-suoxiao" })]), _vm._v(" "), _c('div', { staticClass: "tool", on: { "click": _vm.bigger } }, [_c('span', { staticClass: "iconfont icon-fangda" })]), _vm._v(" "), _vm.images && _vm.images.length > 1 ? [_c('div', { staticClass: "tool", on: { "click": _vm.prev } }, [_c('span', { staticClass: "iconfont icon-xiangqian-copy" })]), _vm._v(" "), _c('div', { staticClass: "tool", on: { "click": _vm.next } }, [_c('span', { staticClass: "iconfont icon-xiangqian" })])] : _vm._e(), _vm._v(" "), _c('div', { staticClass: "tool", on: { "click": function click($event) {
        _vm.info.rotate -= 90;
      } } }, [_c('span', { staticClass: "iconfont icon-zuoxuanzhuan" })]), _vm._v(" "), _c('div', { staticClass: "tool", on: { "click": function click($event) {
        _vm.info.rotate += 90;
      } } }, [_c('span', { staticClass: "iconfont icon-youxuanzhuan" })])], 2), _vm._v(" "), _c('div', { staticClass: "vp-close", on: { "click": _vm.hide } }, [_c('span', { staticClass: "iconfont icon-guanbi" })]), _vm._v(" "), _c('transition', { attrs: { "name": "vpfade" } }, [_c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.isShowToolTip && !_vm.isLoading, expression: "isShowToolTip && !isLoading" }], staticClass: "vp-tooltip" }, [_vm._v(_vm._s(_vm.currentRatio) + "%")])])], 1);
};
var __vue_staticRenderFns__ = [];

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Vue = void 0;
var instance = void 0;
// 单例模式
var getVueInstance = function getVueInstance() {
  instance = new Vue({
    render: function render(h) {
      return h(__vue_component__);
    }
  }).$mount();
  // 插入到页面
  document.body.appendChild(instance.$el);
};

var VPreview = {
  show: function show() {
    var _instance$$children$;

    !instance && getVueInstance();
    (_instance$$children$ = instance.$children[0]).show.apply(_instance$$children$, arguments);
  }
};

var install = function install(_Vue) {
  // 挂载全局Vue
  Vue = _Vue;
  // Vue.component(Viewer.name, Viewer)
  var $vPreview = {};
  Object.keys(VPreview).forEach(function (key) {
    $vPreview[key] = VPreview[key];
  });
  // 一般使用新对象时 就采用拷贝的方式
  Vue.prototype.$vPreview = $vPreview;
};

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefined && window.Vue) {
  install(window.Vue);
}

var index = {
  install: install
};

export default index;
