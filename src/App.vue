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
<style>

.button_bar {
  background: #c9c9c9;
  padding: 10px 20px;
}
.margin0_5px {
  margin: 0 5px;
}
</style>
