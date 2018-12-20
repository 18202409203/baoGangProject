<template>
  <div id="app">
    <div id="nav">
      <panel></panel>
    </div>
  </div>
</template>
<script>
import panel from './views/panel.vue'
export default {
  components: {panel}
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>
