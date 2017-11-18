<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from './../musiclist/musicList.vue'
  import {getMusicList} from './../../api/rank'
  import {ERR_OK} from './../../api/config'
  import {mapGetters} from 'vuex'
  import {creatSong} from 'common/js/song'

  export default {
    computed: {
      title () {
        if (this.flag) {
          return
        }
        return this.topList.topTitle
      },
      bgImage () {
//        封面为第一首歌的图片
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      if (this.topList) {
        console.log('cunzai')
      } else {
        console.log('bucunzai')
        this.flag = true
      }
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (this.flag) {
          console.log('back')
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
//      转换成song的实例
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(creatSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
