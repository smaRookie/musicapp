<template>
  <section class="musicList">
    <div class="musicList_top_all">
      <i class="musicList_top_back" @click="back"></i>
      <h1 class="musicList_top_title">{{this.title}}</h1>
    </div>
    <div class="musicList_top" :style="style" ref="bgImage">
      <div class="filter"></div>
      <div class="musicList_top_play" v-show="songs.length" @click="random">
        <i class="musicList_top_playIcon"></i>
        <span class="play_desc">随机播放</span>
      </div>
    </div>
    <div class="playList">
      <!--这里监听滚动 :listenScroll="listenScroll" :probeType="probeType" 是为了增加class=playList 层的向上偏移量-->
      <scroll :data="songs" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll" class="list" ref="list">
        <song-list :songs="songs" @select="select"></song-list>
        <loading v-if="!songs.length" class="loading"></loading>
      </scroll>
    </div>
  </section>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import scroll from './../base/scroll.vue'
  import songList from './../songList/songList.vue'
  import loading from './../base/loading/loading.vue'
  import {playlistMixin} from './../../common/js/mixin'
  export default {
//    插入mixin
    mixins: [playlistMixin],
    data () {
      return {
        scrollY: 0,
        percent: '',
        scale: 1
      }
    },
    props: {
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      listenScroll: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 3
      }
    },
    components: {
      scroll,
      songList,
      loading
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      style () {
        return `background-image: url(${this.bgImage})`
      }
    },
    methods: {
//      重写mixin的 handlePlaylist的方法 当小播放器出现时 让滚动的页面让距离底部的有小播放器的高度
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      back () {
        this.$router.back()
      },
      random () {
        this.randomPlay({
          list: this.songs
        })
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      select (item, index) {
        console.log(this.songs)
//        这里调用actions中的selectPlay方法 传入播放列表和索引
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY (newval) {
        this.percent = Math.abs(newval / this.imageHeight)
        this.scale = 1
        if (newval > 0) {
          this.scale = 1 + this.percent
          this.$refs.bgImage.style['transform'] = `scale(${this.scale})`
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import './../../common/less/index.less';
  .musicList {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @bkColor;
    z-index: 11;
    .musicList_top_all {
      width: 100%;
      height: 50px;
      position: absolute;
      top: 0;
      z-index: 20;
    }
    .musicList_top_back {
      width: 50px;
      height: 50px;
      display: inline-block;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('./../../common/img/icon/leftArrow.svg');
    }
    .musicList_top_title {
      position: absolute;
      display: inline-block;
      width: calc(~'100% - 100px');
      height: 100%;
      right: 50px;
      line-height: 50px;
      text-align: center;
      color: @whiteColor;
    }
    .musicList_top {
      /*是背景图片按照长宽10:7来设定*/
      height: 0;
      padding-top: 70%;
      width: 100%;
      position: relative;
      background-size: cover;
      .filter {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(7,17,27,0.4);
      }
      .musicList_top_play {
        width: 140px;
        height: 35px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        border: 1px solid @mainColor;
        border-radius: 20px;
        display: flex;
        align-items: center;
        .musicList_top_playIcon {
          display: inline-block;
          width: 25px;
          height: 25px;
          margin: 0 10px;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url('./../../common/img/icon/play.svg');
        }
        .play_desc {
          color: @mainColor;
        }
      }
    }
    .playList {
      height: 100%;
      position: relative;
      overflow: hidden;
      .loading {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      overflow: hidden;
    }
  }
</style>
