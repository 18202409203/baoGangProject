<template>
  <div>
    <div class="button_bar">
      <span class="margin0_5px">操作栏:</span>
      <mu-button class="margin0_5px" color="primary" @click="getHttpData">取数</mu-button>
    </div>
    <heatmap ref="heatmap"></heatmap>
  </div>
</template>

<script>
import heatmap from "../components/heatmap.vue";
export default {
  components: { heatmap },
  methods:{
    // 与后台交互取数http操作
    getHttpData() {
      this.$http
        .get("http://219.216.80.83:8083/myf/l0_fqc_measure/selectFqcDataByUsid/18901001100")
        .then(Response => {
          console.log(Response.data);
          let xData = Response.data.axis_x;
          let yData = Response.data.axis_y;
          let rawData = Response.data.fqc_data;
          this.$refs.heatmap.paint(xData, yData, rawData);
        });
    },
  }
};
</script>

<style>
.button_bar {
  background: #c9c9c9;
  margin: 1px;
  padding: 10px 20px;
}
.margin0_5px {
  margin: 0 5px;
}
</style>
