<template>
  <section class="loading">
    <img src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </section>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在加载。。。'
      }
    }
  }
</script>
<style scoped lang="less">
  @import './../../../common/less/index.less';
.loading {
  width: 100%;
  height: 50px;
  text-align: center;
  img {
    width: 50px;
    height: 50px;
  }
  .desc {
    color: #595959;
    font-size: 16px;
    margin-top: 5px;
    font-weight: bold;
    letter-spacing: 1px;
  }
}
</style>
