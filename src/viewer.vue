<template>
  <div class="vp-dialog" v-show="isShow" @mousedown="mousedown">
    <div
      class="vp-img-box"
      :class="{ transition: !isMouseDown && isLoadingDelay }"
      v-show="!isLoading"
      :style="imgStyle"
    >
      <img :src="currentImage" @mousedown.prevent />
    </div>
    <div class="vp-loading" v-show="isLoading">
      <span class="iconfont icon-loading vp-rotate vp-loading-icon"></span>
    </div>
    <div class="vp-img-toolbar">
      <div class="tool" @click="smaller">
        <span class="iconfont icon-suoxiao"></span>
      </div>
      <div class="tool" @click="bigger">
        <span class="iconfont icon-fangda"></span>
      </div>
      <template v-if="images && images.length > 1">
        <div class="tool" @click="prev">
          <span class="iconfont icon-xiangqian-copy"></span>
        </div>
        <div class="tool" @click="next">
          <span class="iconfont icon-xiangqian"></span>
        </div>
      </template>
      <div class="tool" @click="info.rotate -= 90">
        <span class="iconfont icon-zuoxuanzhuan"></span>
      </div>
      <div class="tool" @click="info.rotate += 90">
        <span class="iconfont icon-youxuanzhuan"></span>
      </div>
    </div>
    <div class="vp-close" @click="hide">
      <span class="iconfont icon-guanbi"></span>
    </div>
    <transition name="vpfade">
      <div class="vp-tooltip" v-show="isShowToolTip && !isLoading">{{currentRatio}}%</div>
    </transition>
  </div>
</template>

<script>
function getBrowerInfo() {
  let winHeight, winWidth;
  //获取窗口宽度
  if (window.innerWidth) winWidth = window.innerWidth;
  else if (document.body && document.body.clientWidth)
    winWidth = document.body.clientWidth;
  //获取窗口高度
  if (window.innerHeight) winHeight = window.innerHeight;
  else if (document.body && document.body.clientHeight)
    winHeight = document.body.clientHeight;
  //通过深入Document内部对body进行检测，获取窗口大小
  if (
    document.documentElement &&
    document.documentElement.clientHeight &&
    document.documentElement.clientWidth
  ) {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }
  return {
    winWidth,
    winHeight
  };
}
export default {
  name: 'vPreview',
  data() {
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
  created() {
    this.browerInfo = getBrowerInfo();
  },
  beforeDestory() {
    this.removeEvent();
  },
  methods: {
    showToolTip() {
      if (this.toolTipTimer) {
        clearTimeout(this.toolTipTimer);
      }
      this.isShowToolTip = true;
      this.hideToolTip();
    },
    hideToolTip() {
      this.toolTipTimer = setTimeout(() => {
        this.isShowToolTip = false;
      }, 1000);
    },
    // 放大
    bigger() {
      this.showToolTip();
      let oldH = this.height;
      let diffW = Math.ceil(Math.min(this.width, this.info.rW) * 0.1);
      this.info.w = this.width + diffW;
      // 设置完宽度获取高度差
      let diffH = this.height - oldH;
      this.info.l = this.marginLeft - Math.ceil(diffW / 2);
      this.info.t = this.marginTop - Math.ceil(diffH / 2);
    },
    // 缩小
    smaller() {
      this.showToolTip();
      let oldH = this.height;
      let diffW = Math.ceil(Math.min(this.width, this.info.rW) * 0.1);
      this.info.w = this.width - diffW;
      // 设置完宽度获取高度差
      let diffH = this.height - oldH;
      this.info.l = this.marginLeft + Math.ceil(diffW / 2);
      this.info.t = this.marginTop - Math.ceil(diffH / 2);
    },
    prev() {
      if (this.images && this.images.length > 1) {
        if (this.currentIndex <= 0) {
          this.currentIndex = this.images.length - 1;
        } else {
          this.currentIndex--;
        }
        this.loadImage(this.currentImage);
      }
    },
    next() {
      if (this.images && this.images.length > 1) {
        if (this.currentIndex >= this.images.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
        this.loadImage(this.currentImage);
      }
    },
    loadImage(url) {
      this.isLoading = true;
      this.isLoadingDelay = false
      this.isError = false;
      const img = new Image();
      img.src = url;
      let initW = Math.min(
        this.initW,
        Math.ceil(this.browerInfo.winWidth * 0.8)
      );
      let callback = () => {
        this.info.rW = img.width;
        this.info.rH = img.height;
        this.info.w = initW > img.width ? img.width : initW;
        this.info.l = this.browerInfo.winWidth / 2 - this.width / 2;
        this.info.t = this.browerInfo.winHeight / 2 - this.height / 2;
        this.info.rotate = 0;
        this.isLoading = false;
        this.$nextTick(() => {
          this.isLoadingDelay = true
        })
      };
      if (img.complete) {
        callback();
      } else {
        // 加载完成执行
        img.onload = function() {
          // 打印
          callback();
        };
        img.onError = function() {
          this.isError = true;
        };
      }
    },
    // 初始化数据
    resetData() {},
    // 打开弹框
    show(imgList, options = {}) {
      // 给图片赋值
      if (Array.isArray(imgList)) {
        this.images = imgList
      }
      let { currentIndex = 0, initW = 800 } = options
      if (!this.isShow) {
        this.addEvent();
      }
      this.browerInfo = getBrowerInfo();
      // 如果索引是数字超出边界也进行处理
      if (typeof currentIndex === 'number') {
        if (currentIndex < 0) {
          currentIndex = 0
        } else if (currentIndex > this.images.length - 1) {
          currentIndex = this.images.length - 1
        }
      } else {
        currentIndex = 0
      }
      if (typeof initW === 'number') {
        if (initW <= 0) {
          window.console.log('初始宽度不可小于0')
        } else {
          this.initW = initW
        }
      }
      this.currentIndex = currentIndex;
      this.isShow = true;
      this.loadImage(this.currentImage);
    },
    hide() {
      this.removeEvent();
      this.isShow = false;
    },
    addEvent() {
      window.addEventListener("resize", this.resizeFunc);
      window.addEventListener("keydown", this.keydownFunc);
      //    给页面绑定鼠标滚轮事件,针对火狐的非标准事件
      window.addEventListener("DOMMouseScroll", this.scrollFunc);
      //    给页面绑定鼠标滚轮事件，针对Google，mousewheel非标准事件已被弃用，请使用 wheel事件代替
      window.addEventListener("wheel", this.scrollFunc);
      //    ie不支持wheel事件，若一定要兼容，可使用mousewheel
      window.addEventListener("mousewheel", this.scrollFunc);
    },
    removeEvent() {
      window.removeEventListener("keydown", this.keydownFunc);
      window.removeEventListener("DOMMouseScroll", this.scrollFunc);
      window.removeEventListener("wheel", this.scrollFunc);
      window.removeEventListener("mousewheel", this.scrollFunc);
    },
    resizeFunc() {
      this.browerInfo = getBrowerInfo();
      this.loadImage(this.currentImage);
    },
    keydownFunc(e) {
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
    scrollFunc(e) {
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
    mousedown(event) {
      let callback = () => {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.isMouseDown = true;
        window.addEventListener("mousemove", this.mousemove);
        window.addEventListener("mouseup", this.mouseup);
      };
      if (
        event.target.className === "vp-dialog" ||
        event.target.parentNode.className.indexOf("vp-img-box") !== -1
      ) {
        callback();
      }
    },
    mousemove(event) {
      if (this.isMouseDown) {
        this.isMouseDown = true;
        this.moveX = event.clientX;
        this.moveY = event.clientY;
        this.diffX = event.clientX - this.startX;
        this.diffY = event.clientY - this.startY;
      }
    },
    mouseup() {
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
    imgStyle() {
      let cell = Math.ceil;
      return {
        width: cell(this.width) + "px",
        height: cell(this.height) + "px",
        marginLeft: cell(this.marginLeft + this.diffX) + "px",
        marginTop: cell(this.marginTop + this.diffY) + "px",
        transform: `rotate(${this.rotate}deg)`,
        "-webkit-transform": `rotate(${this.rotate}deg)`,
        "-ms-transform": `rotate(${this.rotate}deg)`,
        "-moz-transform": `rotate(${this.rotate}deg)`,
        "-o-transform": `rotate(${this.rotate}deg)`
      };
    },
    boxEl() {
      return this.$refs.box;
    },
    // 当前显示的图片
    currentImage() {
      return this.images[this.currentIndex];
    },
    ratio() {
      return this.info.rW / this.info.rH;
    },
    rotate() {
      return this.info.rotate;
    },
    marginLeft() {
      return this.info.l;
    },
    marginTop() {
      return this.info.t;
    },
    width() {
      return this.info.w;
    },
    height() {
      return this.info.w / this.ratio;
    },
    currentRatio() {
      return Math.ceil((this.info.w / this.info.rW) * 100);
    }
  }
};
</script>