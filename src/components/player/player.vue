<template>
  <section class="player" v-show="this.playList.length > 0">
    <transition name="normal">
      <div class="normal_player" v-show="this.fullScreen">
        <div class="bgImage">
          <img :src="currentSong.image" style="width: 100%; height: 100%;">
        </div>
        <div class="top">
          <div class="icon" @click="back"></div>
          <h1 class="player_title">{{currentSong.name}}</h1>
          <p class="player_desc">{{currentSong.singer}}</p>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middlel" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cd_rotate">
                <img :src="currentSong.image" alt="">
              </div>
              <div class="cd_desc">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress">
            <span class="start_time">{{format(currentTime)}}</span>
            <div class="progress_bar_wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <!--currentSong.duration audio中歌曲的总时间-->
            <span class="end_time">{{format(currentSong.duration)}}</span>
          </div>
          <div class="bottom_icon">
            <span class="icon" @click="changeMode"><i class="icon_c icon1"></i></span>
            <span class="icon" @click="prev"><i class="icon_c icon2"></i></span>
            <span class="icon" @click="togglePlaying"><i class="icon_c" :class="playing ? 'icon3_play' : 'icon3_pase'"></i></span>
            <span class="icon" @click="next"><i class="icon_c icon4"></i></span>
            <span class="icon"><i class="icon_c icon5"></i></span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini_player" v-show="!this.fullScreen" @click="open">
        <div class="mini_image" :class="cd_rotate">
          <img :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h1>{{currentSong.name}}</h1>
          <p>{{currentSong.singer}}</p>
        </div>
        <div class="control1">
          <progress-circle :radius="radius" :percent="percent" class="circle">
            <div :class="playing ? 'icon_play' : 'icon_pase'" @click.stop="togglePlaying" class="control1_play"></div>
          </progress-circle>
        </div>
        <div class="control2">
          <div></div>
        </div>
      </div>
    </transition>
    <!--audio中的事件 play 可以播放时 error 出现错误时 timeupdata 派发当前时间事件-->
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </section>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'
  import progressBar from './../base/progressbar/progressBar.vue'
  import progressCircle from './../circle/progress-circle.vue'
  import {playMode} from './../../common/js/config'
  import Lyric from 'lyric-parser'
  import Scroll from './../base/scroll.vue'
  export default {
    data () {
      return {
//        添加一个标志位 防止快速切换歌曲
        songReady: false,
        currentTime: 0,
        radius: 40,
        currentLyric: null,
//        当前歌词所在的行
        currentLineNum: 0,
        playingLyric: '',
        currentShow: 'cd',
        touch: {}
      }
    },
    components: {
      progressBar,
      progressCircle,
      Scroll
    },
    computed: {
      ...mapGetters([
        'currentIndex',
        'fullScreen',
        'playList',
        'currentSong',
        'playing'
      ]),
      cd_rotate () {
//        旋转动画 当this.playing为fase时就添加cd_play cd_pase 类名 若没有添加cd_play 则旋转动画从头开始 就会回到原点有闪烁
        return this.playing ? 'cd_play' : 'cd_play cd_pase'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      }
    },
    mounted () {

    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
//      关闭大的播放器
      back () {
        this.setFullScreen(false)
        console.log('nor', this.fullScreen)
      },
//      点击迷你播放器打开大的播放器
      open () {
        this.setFullScreen(true)
        console.log('ope', this.fullScreen)
        console.log('fff')
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
//      当一首歌播放完之后 播放下一首
      end () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      prev () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready () {
        this.songReady = true
//        this.savePlayHistory(this.currentSong)
      },
      error () {
        this.songReady = true
      },
      updateTime (e) {
//        e audio对象 currentTime里面属性
        this.currentTime = e.target.currentTime
      },
      changeMode () {

      },
      getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
//        保证当前播放的歌词在中间
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart (e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style['transitionDuration'] = 0
      },
      middleTouchEnd () {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style['transitionDuration'] = `${time}ms`
        this.touch.initiated = false
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
//      格式时间
      format (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      onProgressBarChange (percent) {
//        总时间乘以比例为当前应该播放的时间
        const currentTime = this.currentSong.duration * percent
//        this.$refs.audio.currentTime 设置audio标签的当前播放时间
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import './../../common/less/index';
  .player {
    .normal_player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @bkColor;
      .bgImage {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: absolute;
        width: 100%;
        height: 60px;
        margin-bottom: 20px;
        top: 0;
        .icon {
          width: 40px;
          height: 40px;
          display: inline-block;
          vertical-align: top;
          background-image: url('./../../common/img/icon/downArrow.svg');
          background-size: cover;
          background-repeat: no-repeat;
        }
        .player_title {
          display: inline-block;
          position: absolute;
          width: calc(~'100% - 80px');
          height: 40px;
          line-height: 40px;
          color: @whiteColor;
          font-size: @moreSize;
          text-align: center;
          top: 0;
          right: 40px;
        }
        .player_desc {
          text-align: center;
          font-size: @mainSize;
          color: @whiteColor;
        }
      }
      .middle {
        position: fixed;
        top: 80px;
        bottom: 190px;
        width: 100%;
        white-space: nowrap;
        font-size: 0;
        .middlel {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 100%;
            .cd_desc {
              width: 80%;
              margin: 30px auto 0 auto;
              overflow: hidden;
              text-align: center;
              .playing-lyric {
                height: 20px;
                line-height: 20px;
                font-size: @mainSize;
                color: @whiteColor;
              }
            }
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 2px solid red;
              border-radius: 50%;
              text-align: center;
              img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: @lyricColor;
              font-size: @moreSize;
              letter-spacing: 1px;
              &.current {
                color: #fff;
              }
            }
          }
        }
      }
      .bottom {
        position: fixed;
        bottom: 60px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @lyricColor;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: @whiteColor;
            }
          }
        }
        .progress {
          color: @whiteColor;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px 0;
          .start_time {
            height: 30px;
            line-height: 30px;
            flex: 0 1 50px;
            text-align: right;
          }
          .progress_bar_wrapper {
            height: 30px;
            line-height: 30px;
            flex: 1 1 auto;
            margin: 0 5px;
          }
          .end_time {
            height: 30px;
            line-height: 30px;
            flex: 0 1 50px;
            text-align: left;
          }
        }
        .bottom_icon {
          display: flex;
          .icon {
            flex-grow: 1;
            display: inline-block;
            text-align: center;
            .icon_c {
              display: inline-block;
              width: 40px;
              height: 40px;
              background-size: cover;
              background-repeat: no-repeat;
            }
            .icon1 {
              background-image: url('./../../common/img/icon/cir.svg');
            }
            .icon2 {
              background-image: url('./../../common/img/icon/previous.svg');
            }
            .icon3_play {
              background-image: url('./../../common/img/icon/play.svg');
            }
            .icon3_pase {
              background-image: url('./../../common/img/icon/pase.svg');
            }
            .icon4 {
              background-image: url('./../../common/img/icon/next.svg');
            }
            .icon5 {
              background-image: url('./../../common/img/icon/collect.svg');
            }
          }
        }
      }
    }
    .normal-enter-active, .normal-leave-active {
      opacity: 1;
      transition: all .4s;
      .top, .bottom {
        transition: all .4s cubic-bezier(.46,0,.43,1);
      }
    }
    .normal-leave-to, .normal-enter {
      opacity: 0;
      /*有错*/
      z-index: -1;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
    .mini_player {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      background-color: @mlColor;
      z-index: 200;
      .mini_image {
        box-sizing: border-box;
        flex: 0 0 40px;
        padding: 0 10px 0 20px;

        img {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .text {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        h1 {
          flex-grow: 1;
          color: @whiteColor;
          font-size: @mainSize;
        }
        p {
          flex-grow: 1;
          color: @whiteColor;
          font-size: @mainSize;
        }
      }
      .control1 {
        flex: 0 0 40px;
        margin-right: 20px;
        &_play {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          margin-right: 20px;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .icon_play {
          background-image: url('./../../common/img/icon/play.svg');
        }
        .icon_pase {
          background-image: url('./../../common/img/icon/pase.svg');
        }
      }
      .control2 {
        flex: 0 0 40px;
        div {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          background-image: url('./../../common/img/icon/musiclist.svg');
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
    }
    .cd_play {
      animation: rotate 20s linear infinite;
    }
    .cd_pase {
      animation-play-state: paused;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>
