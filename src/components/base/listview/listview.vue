<template>
  <!--@scroll="dealScroll"监听子组件scroll派发出来的scroll事件-->
    <scroll
      :data="singerList"
      :listenScroll="listenScroll"
      :probeType="probeType"
      ref="listview"
      @scroll="dealScroll"
      class="listview">
      <ul>
        <li v-for="item in singerList" class="list_all" ref="listall">
          <h1 class="tap_title">{{item.title}}</h1>
          <ul>
            <li v-for="data in item.items" class="tap_desc" @click="selectItem(data)">
              <img v-lazy="data.avatar" alt="" class="avatar">
              <span class="name">{{data.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="slider" @touchstart="listTouchStart" @touchmove.stop.prevent="listTouchMove">
        <ul>
          <li v-for="(item, index) in shortTitle" class="slider_item" :data-index="index" :class="{'focus': index === currentIndex}">
            {{item}}
          </li>
        </ul>
      </div>
      <div class="fixed_tilte" v-show="fixedTitle" ref="fixedTop">
        <h1 class="title">{{fixedTitle}}</h1>
      </div>
      <loading v-show="!singerList.length" class="loading"></loading>
    </scroll>
</template>
<script>
  import scroll from './../scroll.vue'
  import {getData} from './../../../common/js/dom.js'
  import loading from './../loading/loading.vue'
//  侧边栏的单个item的高度
  const ITEM_HEIGHT = 21
//  顶部标签的高度
  const TITLE_HEIGHT = 30
  export default {
    data () {
      return {
        /*
        * @touch: 储存手指点击时的对象信息
        * @probeType: 传递给scroll组件是实时监听滚动（不需要函数节流）
        * @listenScroll: 是否需要监听滚动
        * @currentIndex: 当前显示的列表的索引
        * @listHeight: 储存所有列表的高度
        * @diff: a-z标签到固定标签的差值
        * */
        touch: {},
        listenScroll: true,
        probeType: 3,
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
        listHeight: []
      }
    },
    props: {
      singerList: {
        type: Array,
        default: []
      }
    },
    components: {
      scroll,
      loading
    },
    computed: {
      shortTitle () {
        return this.singerList.map((item) => {
          return item.title.slice(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
      }
    },
    watch: {
      singerList () {
        setTimeout(() => {
          this.caculateHeight()
        }, 20)
      },
      scrollY (newY) {
        let list = this.listHeight
//        当滑动到大于顶部时
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
//        当滑动到中间部分
//        list.length - 1 因为list集合里面元素比索引多一个元素 （list.length - 1 则保证height2一定有值)
        let height1 = 0
        let height2 = 0
        for (let i = 0; i < list.length - 1; i++) {
          height1 = list[i]
          height2 = list[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
//            a-z标签到固定标签的差值 因为newY是负值所以相加
            this.diff = height2 + newY
            return
          }
        }
//        当滑动到底部时 且-newY大于最后一个元素的上限
        this.currentIndex = list.length - 2
      },
      diff (newval) {
        let fixedTop = (newval > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedTop.style.transform = `translate3D(0, ${fixedTop}px, 0)`
      }
    },
    mounted () {
    },
    methods: {
//      侧边栏的点击事件和滑动
      listTouchStart (el) {
//        点击的元素的索引
        let getIndex = getData(el.target, 'index')
//        el.touches 获取手指点击时的数组 [0]获取第一个手指对象
        let firstTouch = el.touches[0]
//        获取第一次点击时的y轴的偏移量
        this.touch.pageY1 = firstTouch.pageY
        this.touch.itemIndex = getIndex
        this._scrollTo(getIndex)
      },

//      在侧边栏上手指滑动事件
      listTouchMove (el) {
        let firstTouch = el.touches[0]
        this.touch.pageY2 = firstTouch.pageY
//        移动距离相当于几个item
        let delta = Math.floor((this.touch.pageY2 - this.touch.pageY1) / ITEM_HEIGHT)
//        现在手指滑动的索引
        let getIndex = parseInt(this.touch.itemIndex, 10) + delta
        this._scrollTo(getIndex)
      },

      dealScroll (pos) {
        this.scrollY = pos.y
      },
//    当点击某一个歌手是派发一个选择事件交给父组件处理
      selectItem (item) {
        this.$emit('select', item)
      },

      caculateHeight () {
        let height = 0
        let list = this.$refs.listall
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      },
      refresh () {
        this.$refs.listview.refresh()
      },
      _scrollTo (index) {
        console.log(this.fixedTitle)
//      当滑动侧边栏时 一直往上滑index<0 一直往下滑index一直增大 这处理滑动的边界情况
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length) {
          index = this.listHeight.length - 2
        }
//        当点击侧边栏的最顶部和最底部时index的值为null 为null时就跳出方法不执行
        if (index === null) {
          return
        }
//        侧边栏是通过监听this.scrollY的改变 所以当点击右边侧栏就赋值给scrollY来添加focus类名
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listall[index], 10)
      }
    }
  }
</script>
<style scoped lang="less">
  @import './../../../common/less/index.less';
  .listview {
    height: 100%;
    overflow: hidden;
    position: relative;
    .list_all {
      padding: 0 0 20px 0;
    }
    .slider {
      /*width: 6%;*/
      min-width: 20px;
      position: absolute;
      padding: 10px 0;
      box-sizing: border-box;
      text-align: center;
      right: 10px;
      top: 50%;
      color: @fontColor;
      font-size: @mainSize;
      transform: translateY(-50%);
      background-color: #181818;
      border-radius: 10px;
      z-index: 10;
      .slider_item {
        text-decoration: none;
        list-style: none;
        padding: 1px 0;
        box-sizing: border-box;
      }
      .focus {
        color: @mainColor;
      }
    }
    .loading {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .fixed_tilte {
      position: absolute;
      width: 100%;
      top: 0;
      .title {
        height: 30px;
        line-height: 30px;
        font-size: @mainSize;
        color: @fontColor;
        box-sizing: border-box;
        padding: 0 0 0 20px;
        background: #333333;
      }
    }
  }
  .tap_title {
    height: 30px;
    width: 100%;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 20px;
    background: #333333;
    color: @fontColor;
    font-size: @mainSize;
  }
  .tap_desc {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 20px 0 0 30px;
    .avatar {
      height: 15vw;
      width: 15vw;
      border-radius: 50%;
    }
    .name {
      margin-left: 30px;
      color: @fontColor;
      font-size: @moreSize;
    }
  }
</style>
