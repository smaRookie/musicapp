<template>
  <section class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </section>
</template>
<script>
//  进度小球的宽度
  const progressBtnWidth = 16
  export default {
    data () {
      return {
//      barWidth 为进度条的长度减去小球的长度
        barWidth: 0,
        offsetWidth: 0,
        touch: {}
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      progressTouchStart (e) {
//     this.touch.initiated = true 初始化 判断是否点击
//     this.touch.startX = e.touches[0].pageX 点击时的横坐标
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
//        移动的偏移量
        const deltaX = e.touches[0].pageX - this.touch.startX
//        防止拖动距离大于进度条的长度
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd (e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
//      点击进度条派发percentChange事件来改变进度
      progressClick (e) {
//         Element.getBoundingClientRect()方法用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent (newPercent) {
//        !this.touch.initiated 手指没有拖动进度条
        if (newPercent >= 0 && !this.touch.initiated) {
          this.barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          this.offsetWidth = newPercent * this.barWidth
          this._offset(this.offsetWidth)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
    }
    /*已播放进度条*/
    .progress {
      position: absolute;
      height: 100%;
      background: gold;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: gold;
      }
    }
  }
</style>
