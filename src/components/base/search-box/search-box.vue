<!--搜索框组件-->
<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      },
      blur () {
        this.$refs.query.blur()
      }
    },
    created () {
//      监听搜索框的值 当变化时派发出去
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="less">
  @import './../../../common/less/index.less';
  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: @mlColor;
    border-radius: 6px;
    .icon-search {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url('./../../../common/img/icon/search.svg');
      -webkit-background-size: cover;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 20px;
      padding-left: 5px;
      border: 0;
      background: @mlColor;
      color: #fff;
      font-size: @mainSize;
      &::placeholder {
        color: @fontColor;
      }
    }
    .icon-dismiss {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-image: url('./../../../common/img/icon/clear.svg');
      -webkit-background-size: cover;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }


</style>
