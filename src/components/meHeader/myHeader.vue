<template>
  <section class="my_head">
    <div class="title">
    </div>
    <h1>MUSICAPP</h1>
    <div class="user"></div>
  </section>
</template>
<script>


</script>
<style scoped lang="less">
  @import './../../common/less/index';
  /*@font-face {*/
    /*font-family: 'music-font';*/
    /*src: url('./../../common/fonts/music-icon.eot');*/
    /*src: url('./../../common/fonts/music-icon.eot?#iefix') format('embedded-opentype'),*/
    /*url('./../../common/fonts/music-icon.ttf?2qevqt') format('truetype'),*/
    /*url('./../../common/fonts/music-icon.woff?2qevqt') format('woff'),*/
    /*url('./../../common/fonts/music-icon.svg?2qevqt#music-icon') format('svg');*/
    /*font-weight: normal;*/
    /*font-style: normal;*/
  /*}*/
  .my_head {
    position: relative;
    width: 100%;
    height: 44px;
    text-align: center;
    .title {
      display: inline-block;
      margin-top: 6px;
      margin-right: 10px;
      width: 30px;
      height: 32px;
      vertical-align:  top;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('./logo@2x.png')
    }
    h1 {
      display: inline-block;
      line-height: 44px;
      color: @mainColor;
      font-family: music-font;
    }
    .user {
      height: 30px;
      width: 32px;
      position: absolute;
      right: 10px;
      top: 8px;
      display: inline-block;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('./../../common/img/icon/user.svg');
    }
  }
</style>
