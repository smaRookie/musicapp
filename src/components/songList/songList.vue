<template>
  <section class="songList">
    <ul>
      <li v-for="(item, index) in songs" @click="seletItem(item, index)">
        <div class="songitem">
          <p class="songTitle">{{item.name}}</p>
          <p class="songDesc">{{item.singer}} · {{item.album}}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    mounted () {
      console.log('songlist', this.songs)
    },
    methods: {
      seletItem (item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>
<style scoped lang="less">
  @import './../../common/less/index';
  .songList {
    box-sizing: border-box;
    padding: 20px;
    .songitem {
      margin: 20px 0;
      .songTitle {
        color: @whiteColor;
      }
      .songDesc {
        margin-top: 2px;
        color: @fontColor;
        font-size: @mainSize;
      }
    }

  }
</style>
