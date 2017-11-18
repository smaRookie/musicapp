<template>
  <section class="singer" ref="singer">
      <List-view :singerList="singers" @select="selectSinger" ref="list"></List-view>
      <router-view></router-view>
  </section>
</template>
<script>
  import {getSinger} from '@/api/singer.js'
  import {ERR_OK} from '@/api/config'
  import Singer from '@/common/js/singer.js'
  import ListView from '../base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singers: []
      }
    },
    components: {
      ListView
    },
    mounted () {
      this._getsingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER',
        test: 'TEST'
      }),
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getsingerList () {
        getSinger().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            this.singers = this._rank(this.singers)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      _rank (list) {
//        保存所有的数据
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
//  选取获得数据前10条作为热门数据
//  item.Fsinger_name 歌手的名字
//  item.Fsinger_mid 歌手的id信息  跳转时需要用到
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
//          key 为A-Z歌手的序列号
          const key = item.Findex
//          如果没有对应的序号就添加相应的序号在map里
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
//        hot保存热门歌手数据 com保存其他歌手信息
        let hot = []
        let com = []
//        遍历每一个对象
        for (let key in map) {
          if (map[key].title.match(/[a-zA-Z]/)) {
            com.push(map[key])
          } else if (map[key].title === HOT_NAME) {
            hot.push(map[key])
          }
        }
//        按字母排序
        com.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(com)
      },

      selectSinger (item) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
//        把点击的歌手信息放进vuex中 singerDetail需要用到歌手的id
        this.setSinger(item)
      }
    }
  }
</script>
<style scoped lang="less">
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
