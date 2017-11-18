<template>
  <div id="app">
    <my-header></my-header>
    <tap></tap>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import myHeader from './components/meHeader/myHeader.vue'
import tap from './components/tap/tap.vue'
import player from './components/player/player.vue'
export default {
  name: 'app',
  components: {
    myHeader,
    tap,
    player: player
  }
}
</script>

<style>
html, body {
  background: rgb(34, 34, 34);
}
* {
  margin: 0;
  padding: 0;
}

</style>
