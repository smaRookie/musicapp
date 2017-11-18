<template>
  <section class="tap">
    <router-link tag="div" class="tap_item" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link tag="div" class="tap_item" to="/singer">
      <span>歌手</span>
    </router-link>
    <router-link tag="div" class="tap_item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag="div" class="tap_item" to="/search">
      <span>搜索</span>
    </router-link>
  </section>
</template>
<script>

</script>
<style lang="less" scoped>
@import './../../common/less/index';
.tap {
  width: 100%;
  height: 44px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  &_item {
    display: inline-block;
    flex-grow: 1;
    -webkit-flex-grow: 1;
    text-align: center;
    line-height: 44px;
    span {
      position: relative;
      color: @mainColor;
      font-size: 14px;
    }
  }
  .router-link-active {
    span:before {
      position: absolute;
      content: '';
      height: 0;
      width: 100%;
      bottom: -5px;
      border: 1px solid @mainColor;
    }
  }
}
</style>
