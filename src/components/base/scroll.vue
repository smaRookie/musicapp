<template>
  <div ref="scroll" class="scr">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
        /*
        * 有时候我们需要知道滚动的位置。
        * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
        * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
        * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
        * 如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
        * */
      },
      click: {
        type: Boolean,
        default: true
        /*
        * better-scroll 默认会阻止浏览器的原生 click 事件。
        * 当设置为 true会阻止浏览器的默认时间，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
        * */
      },
//      自定义对象
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
//      是否需要下拉刷新
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    data () {
      return {
        scroll: ''
      }
    },
    mounted () {
      setTimeout(() => {
        this.initScroll()
      }, 20)
    },
    watch: {
//      这里监听data是因为刚开始是没有数据better-scroll初始化的高度就只有图片的高度不能滑动 当数据有了之后重新刷新Better-scroll进行滑动
      data () {
        setTimeout(() => {
          this.refresh()
          console.log('scroll', this.data)
        }, this.refreshDelay)
      }
    },
    methods: {
      initScroll () {
        if (!this.$refs.scroll) {
          return
        }
        this.scroll = new BScroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: true
        })
//      判断是否需要监听滚动 需要的话就派发一个名为scroll事件交给其他组件处理  （用于歌手栏和侧边栏的联动）this.scroll.on('scroll')是better-scroll中的事件
//        pos 包含了滚动的位置横纵坐标（x, y）
        if (this.listenScroll) {
          let self = this
          this.scroll.on('scroll', (pos) => {
            self.$emit('scroll', pos)
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
//            maxScrollY better-scroll中的属性 最大滚动的距离 当快要滚到底部时就派发事件 实现下拉刷新
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
//      代理better-scroll的对应方法
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    }
  }
</script>
<style>

</style>
