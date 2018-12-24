<template>
  <div>
    <div :id="chartId" style="height: 800px; width: 1200px;"></div>
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
    paint(xData, yData, rawData, xAverage, yAverage) {
      // console.log(xData, yData, rawData, xAverage, yAverage);
      // 处理数据
      var data = [];
      for (let i = 0; i < xData.length; i++) {
        for (let j = 0; j < yData.length; j++) {
          data.push([i, j, rawData[j][i]]);
        }
      }

      var option = {
        tooltip: {},
        grid: [
          { x: "15%", y: "4%", width: "50%", height: "44%" },
          { x2: "1%", y: "4%", width: "32%", height: "44%" },
          { x: "15%", y2: "4%", width: "50%", height: "44%"}
        ],
        xAxis: [
          {
            type: "category",
            data: xData,
            gridIndex: 0
          },
          {
            type: "value",
            gridIndex: 1
          },
          {
            type: "category",
            axisLabel: { show: false },
            data: xData,
            gridIndex: 2
          }
        ],
        yAxis: [
          {
            type: "category",
            data: yData,
            gridIndex: 0
          },
          {
            type: "category",
            axisLabel: { show: false },
            data: yData,
            gridIndex: 1
          },
          {
            type: "value",
            inverse: true,
            gridIndex: 2
          }
        ],
        visualMap: {
          type: "piecewise",
          min: -10,
          max: 10,
          seriesIndex: 0,
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
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              emphasis: {
                borderColor: "#333",
                borderWidth: 1
              }
            },
            progressive: 1000,
            animation: false
          },
          {
            name: "yAverage",
            type: "bar",
            smooth: true,
            yAxisIndex: 1,
            xAxisIndex: 1,
            data: yAverage,
            progressive: 1000,
            animation: false
          },
          {
            name: "xAverage",
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: xAverage,
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
