<template>
  <div class="recommend" ref="recommend">
    <scroll :data="musicList" class="recommend-content" ref="scroll">
      <div>
        <!--v-if="items.length" 当获取到元素是才渲染 不然当进入slider组件进行操作时 可能会没有值-->
        <!--用v-if时因为if是通过是否渲染来控制显示 而show是通过style样式来控制依然会当进入slider组件进行操作时 可能会没有值-->
        <div class="slider-wrap" v-if="items.length">
          <slider>
            <div v-for="item in items">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list_title">热门歌单推荐</h1>
          <ul v-if="musicList.length">
            <li v-for="item in musicList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <div class="disc">
                <h1 class="disc_title">{{item.creator.name}}</h1>
                <p class="disc_con">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
          <loading v-if="!musicList.length"></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from './../base/scroll.vue'
import {getRecommend, getDiscList} from '@/api/recommend'
import slider from './../slider/slider.vue'
import {ERR_OK} from '@/api/config'
import loading from './../base/loading/loading.vue'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      items: [],
      musicList: []
    }
  },
  components: {
    scroll,
    slider,
    loading
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
//    重写mixin的 handlePlaylist的方法 当小播放器出现时 让滚动的页面让距离底部的有小播放器的高度
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.items = res.data.slider
          console.log(res.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.musicList = res.data.list
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
    },
//    当进行dom改变渲染时最好都执行以下refresh方法
//    当轮播图片加载完成之后就调用scroll组件的refresh()方法重新进行better-scroll的高度渲染
//    是为了防止:data="musicList" 传musicList先完成还是图片先加载 当都进行时都刷新better-scroll
    loadImage () {
//      设一个标志符只执行一次
      if (!this.click) {
        this.$refs.scroll.refresh()
        this.click = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import './../../common/less/index';
.recommend {
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }
  .slider-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .recommend-list {
    .list_title {
      width: 100%;
      font-size: @mainSize;
      color: @mainColor;
      height: 65px;
      line-height: 65px;
      text-align: center;
      letter-spacing: 1px;
      font-weight: normal;
    }
    .item {
      display: flex;
      width: 100%;
      align-content: center;
      box-sizing: border-box;
      padding: 0 20px 20px 20px;
      .icon {
        flex: 0 0 60px;
        width: 60px;
        padding-right: 20px;
        img {
          width: 100%;
        }
      }
      .disc {
        flex-grow: 8;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        line-height: 20px;
        overflow: hidden;
        .disc_title {
          margin-bottom: 10px;
          color: @whiteColor;
          font-size: 14px;
        }
        .disc_con {
          color: #595959;
          font-size: @mainSize;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
