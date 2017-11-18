<template>
  <section ref="slider" class="slider">
    <div ref="sliderGroup" class="slider-group">
      <slot></slot>
    </div>
  </section>
</template>
<script>
import {addClass} from '@/common/js/dom.js'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      currentPageIndex: 0,
      finish: false
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    finish () {
      this.slider.refresh()
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._sliderScroll()
    }, 20)
  },
  methods: {
    _setSliderWidth (isResize) {
//      获得容器的宽度
      let itemWidth = this.$refs.slider.clientWidth
      let width = 0
      this.children = this.$refs.sliderGroup.children
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
//        动态添加类名
        addClass(child, 'slider-item')
//        让子元素的宽度为容器的宽度
        child.style.width = itemWidth + 'px'
        width += itemWidth
      }
//      当类名和样式应用时才显示轮播 防止闪烁
//      this.finish = true
//      循环时在添加两个的宽度
//      if (this.loop && !isResize) {
//        width += 2 * itemWidth
//      }
      //        外面容器宽度是所有图片宽度之和
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _sliderScroll () {
//      this.$refs.slider 选择这个是因为BScroll下面只能一个节点
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: true,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        console.log(this.currentPageIndex)
      })
    }
  }
}
</script>
<style lang="less">
.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  .slider-item {
    float: left;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    a {
      width: 100%;
      display: block;
      text-decoration: none;
      height: auto;
    }
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
