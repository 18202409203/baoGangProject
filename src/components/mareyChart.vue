<template>
  <div>
    <div :id="menuId" style="margin: 10px; padding: 5px; border: 1px solid #c9c9c9; height: 1000px; overflow-y: scroll;"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
export default {
  data() {
    return {
      menuId: 'marey',
      jsonData: [],
      stationsData: [],
      trainGroup: undefined,
      colors: {},
    }
  },
  methods: {
    paintMareyChart(alldata, stationsData, menuId, width) {

      // data
      var data = alldata

      var stations = stationsData
      console.log(data)
      var stops = d3.merge(data.map(d => d.stops.map(s => ({ train: d, stop: s }))))
      console.log(stops);

      // chart
      // var height = 2400;
      var defaultStrokeWidth = d3.scaleLinear()
        .domain([0.006, 0.16])
        .range([1, 2])
      var highLightStrokeWidth = 2.5
      var margin = ({ top: 120, right: 100, bottom: 120, left: 100 })
      var _colors = [
        "L20",
        "H30",
        "H20",
        "SC0",
        "B10",
        "000",
        "L10",
        "H60",
        "P30",
        "S80",
        "SA0",
        "S50",
        "S30",
        "L30",
        "H10",
        "SB0",
        "P20",
        "J20",
        "S10",
        "P10",
        "S60",
        "S20"
      ]
      var colors = {}
      for (let i = 0; i < _colors.length; i++) {
        // colors[_colors[i]] = d3.interpolateBlues( (i+1)/_colors.length );
        colors[_colors[i]] = d3.schemeCategory10[i % 10];
      }

      this.colors = colors;

      var x = d3.scaleLinear()
        .domain(d3.extent(stations, d => d.distance))
        .range([margin.left + 10, width - margin.right])

      // zpj 2019-4-15 20:02:15
      var minDate = data[0].stops[0].time;
      var maxDate = data.slice(-1)[0].stops.slice(-1)[0].time
      console.log(minDate, maxDate)
      const timeHeightScale = 1000 / (60 * 60 * 1000 * 5) // 每1000高度 时间跨度5小时
      var height = (new Date(maxDate).getTime() - new Date(minDate).getTime()) * timeHeightScale
      var y = d3.scaleTime()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([margin.top, height - margin.bottom])

      var line = d3.line()
        .x(d => x(d.station.distance))
        .y(d => y(new Date(d.time)))

      var voronoi = Delaunay
        .from(stops, d => x(d.stop.station.distance), d => y(new Date(d.stop.time)))
        .voronoi([0, 0, width, height])

      var tooltipColors = (colors)
      var tooltip = g => {
        const tooltip = g.append("g")
          .style("font", "15px sans-serif");

        const path = tooltip.append("path")
          .attr("fill", "rgba(245, 245, 230, 0.97)");

        const text = tooltip.append("text");

        const line1 = text.append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .style("font-weight", "bold");

        const line2 = text.append("tspan")
          .attr("x", 0)
          .attr("y", "1.1em");

        const line3 = text.append("tspan")
          .attr("x", 0)
          .attr("y", "2.2em");

        g.append("g")
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .selectAll("path")
          .data(stops)
          .join("path")
          .attr("d", (d, i) => voronoi.renderCell(i))

          //.on("mouseout", () => tooltip.style("display", "none"))

          .on("mouseout", d => {
            let currentIdSearch = "#id" + d.train.upid;
            d3.select(currentIdSearch)
              .attr("stroke-width", d => { return defaultStrokeWidth(d.tgtplatethickness2) })
              .selectAll("rect")
              .attr("stroke", "none");
            tooltip.style("display", "none");
          })

          .on("mouseover", d => {

            let currentIdSearch = "#id" + d.train.upid;
            d3.select(currentIdSearch)
              .attr("stroke-width", highLightStrokeWidth)
              .selectAll("rect")
              .attr("stroke", "black");
            //console.log(" currentIdSearch ", currentIdSearch);

            tooltip
              .style("display", null)
              .attr("fill", "white");
            line1.text(`${d.train.upid}`);
            line2.text(d.stop.station.name);
            line3.text(d.stop.realTime.toLocaleString(undefined, { hour: "numeric", minute: "numeric" }));
            path
              .attr("stroke", "none")
              .attr("fill", tooltipColors[d.train.productcategory]);
            //.attr("opacity", 0.96);
            const box = text.node().getBBox();
            path.attr("d", `
            M${box.x - 10},${box.y - 10}
            H${box.width / 2 - 5}l5,-15l5,15
            H${box.width + 10}
            v${box.height + 20}
            h-${box.width + 20}
            z
          `);
            tooltip.attr("transform", `translate(${
              x(d.stop.station.distance) - box.width / 2},${
              y(new Date(d.stop.time)) + 37
              })`);
          });
      }


      const svg = d3.select('#' + menuId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const train = svg.append("g")
        .attr("fill", "currentColor")
        .selectAll("g")
        .data(data)
        .join("g")
        .style("color", d => colors[d.productcategory])
        .attr("stroke-width", d => { return defaultStrokeWidth(d.tgtplatethickness2) })
        .attr("id", d => ("id" + d.upid));

      this.trainGroup = train;

      train.append("path")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("d", d => line(d.stops));

      train.append("g")
        .attr("stroke", "none")
        .selectAll("circle")
        .data(d => d.stops)
        .join("circle")
        .attr("transform", d => `translate(${x(d.station.distance)},${y(new Date(d.time))})`)
        .attr("r", d => d.station.name === "FuDischarging" ? 1.5 : 0.5);

      var xAxis = g => g
        .style("font", "12px sans-serif")
        .selectAll("g")
        .data(stations)
        .join("g")
        .attr("transform", d => `translate(${x(d.distance)},0)`)
        .call(g => g.append("line")
          .attr("y1", margin.top - 0)
          .attr("y2", margin.top)
          .attr("stroke", "currentColor"))
        .call(g => g.append("line")
          .attr("y1", height - margin.bottom + 0)
          .attr("y2", height - margin.bottom)
          .attr("stroke", "currentColor"))
        .call(g => g.append("line")
          .attr("y1", margin.top - 3)
          .attr("y2", height - margin.bottom + 3)
          .attr("stroke-opacity", d => {
            return (d.name === "FuDischarging" || d.name === "MPass24") ? 0.8 : 0.4
          })
        )
        .attr("stroke-dasharray", "1.5,2")
        .attr("stroke", "currentColor")
        .call(g => g.append("text")
          .attr("transform", `translate(-10,${margin.top + 0}) rotate(-45)`)
          .attr("x", 12)
          .attr("dy", "0.35em")
          .text(d => d.name))
        .call(g => g.append("text")
          .attr("text-anchor", "end")
          .attr("transform", `translate(10,${height - margin.top - 0}) rotate(-45)`)
          .attr("x", -12)
          .attr("dy", "0.35em")
          .text(d => d.name))

      var _yAxis = d3.axisLeft(y)
        .ticks(d3.formatMinute)
        .tickSize(0)
      var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .style("font", "12px sans-serif")
        .call(_yAxis
          // .tickFormat(date => date.toLocaleString(undefined, { hour: "numeric" }))
        )
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone().lower()
          .attr("stroke-opacity", 0.2)
          .attr("x2", width - 80))
      // var yAxis = d3.axisLeft(y)
      //     .ticks(d3.formatMinute)
      //     .tickSize(0)

      svg.append("g")
        .call(xAxis);
      var yGroup = svg.append("g")
        .call(yAxis);

      // var zoom = d3.zoom()
      //   .scaleExtent([0.1, 10])
      //   // .translateExtent([[0,margin.top], [width, height - margin.bottom]])
      //   // .extent([[0,margin.top], [width, height - margin.bottom]])
      //   .on('zoom', () => {
      //     console.log( d3.event.transform)
      //     // train.attr("transform", d3.event.transform);
      //     train.attr("transform", "translate(0," + d3.event.transform.y + ") scale(1," + d3.event.transform.k + ")");
      //     yGroup.call(_yAxis.scale(d3.event.transform.rescaleY(y)));
      //   })
      // svg.call(zoom);

      svg.append("g")
        .call(tooltip);

    },
    getJsonData(startDate, endDate) {
      // this.$http.get("/api/alldata.json").then(Response => {
      // this.$http.get(`http://219.216.80.83:8083/myf/RollingTimeVisualizationMaretoController/selectRollingTimeVisualizationMaretoDataDto/${this.startDate}/${this.endDate}/0/5/all/all/40/40/40/40`").then(Response => {
      this.$http.get(`http://219.216.80.83:8083/myf/RollingTimeVisualizationMaretoController/selectRollingTimeVisualizationMaretoDataDto/${startDate}/${endDate}/0/5/all/all/40/40/40/40/all/50/`).then(Response => {
        if (Response.status === 200) {
          this.jsonData = Response.data;
          this.paintMareyChart(this.jsonData, this.stationsData, this.menuId, 1500);
        } else {
          console.log("error");
        }
      })
    },
    getStationsData(startDate, endDate) {
      this.$http.get(`http://219.216.80.83:8083/myf/RollingTimeVisualizationMaretoController/selectRollingTimeVisualizationMaretoStationDto/${startDate}/${endDate}/0/5/all/all/40/40/40/40/all/`).then(Response => {
        if (Response.status === 200) {
          this.stationsData = Response.data;
          this.getJsonData(startDate, endDate);
        } else {
          console.log("error");
        }
      })
    },
    changeTrainColor(bool) {
      if (bool) {
        this.trainGroup &&
          this.trainGroup.style('color', d => d.flag === 0 ? 'red' : d3.schemeCategory10[0] )
      } else {
        this.trainGroup &&
          this.trainGroup.style("color", d => this.colors[d.productcategory])
      }
    }
  },
  mounted() {
    // this.getStationsData();
  }
}
</script>

<style>
</style>
