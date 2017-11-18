<template>
  <transition name="slide">
    <div>dsafdsafds</div>
  </transition>
</template>
<script>
  export default {
    mounted () {
      console.log('fff')
    },
    methods: {

    }
  }
</script>
<style scoped lang="less">
.slide-enter-active, .slider-leave-active {
  transition: all .3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3D(100%, 0, 0);
}
</style>
