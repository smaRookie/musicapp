<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>
<script>
  import musicList from './../musiclist/musicList.vue'
  import {getSingerDetail} from '@/api/singer'
  import {ERR_OK} from '@/api/config'
  import {creatSong} from '@/common/js/song'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getDetail()
      console.log(this.singer)
    },
    components: {
      musicList
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      }
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
//        singer从vuex中取得是一个对象包含了歌手的id信息 需要传递给请求参数中
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._format(res.data.list)
            console.log(this.songs)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      _format (data) {
//        用来储存songs 里面是Song类的实例组成的数组
        let ret = []
        data.forEach((item) => {
//        解构赋值 取到musicData的数据
          let {musicData} = item
          ret.push(creatSong(musicData))
        })
        return ret
      }
    }
  }
</script>
<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3D(100%, 0, 0);
  }
</style>
