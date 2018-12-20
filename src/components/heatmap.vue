<template>
  <div>
    <div :id="chartId" style="height: 450px; width: 1200px;"></div>
  </div>
</template>

<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      msg: "echarts热力图",
      chartId: "heatmap"
    };
  },
  methods: {
    // 绘图
    paint(xData, yData, rawData) {
      console.log(xData, yData, rawData);
      // 处理数据
      var data = [];
      for (let i = 0; i < xData.length; i++) {
        for (let j = 0; j < yData.length; j++) {
          data.push([i, j, rawData[j][i]]);
        }
      }

      var option = {
        tooltip: {},
        grid: {
          right: 10,
          left: 140
        },
        xAxis: {
          type: "category",
          data: xData
        },
        yAxis: {
          type: "category",
          data: yData
        },
        visualMap: {
          type: "piecewise",
          min: -10,
          max: 10,
          calculable: true,
          realtime: false,
          splitNumber: 8,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026"
            ]
          },
          bottom: "auto", //组件离容器下侧的距离,'20%'
          orient: "horizontal", //图例排列方向
          padding: 5 //图例内边距，单位px  5  [5, 10]  [5,10,5,10]
        },
        series: [
          {
            name: "thickness",
            type: "heatmap",
            data: data,
            itemStyle: {
              emphasis: {
                borderColor: "#333",
                borderWidth: 1
              }
            },
            progressive: 1000,
            animation: false
          }
        ]
      };
      // paint
      var myChart = echarts.init(document.getElementById(this.chartId));
      myChart.setOption(option);
    }
  }
};
</script>

<style>
</style>
