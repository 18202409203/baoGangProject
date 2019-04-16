<template>
  <div :id="menuId"></div>
</template>

<script>
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
export default {
  data() {
    return {
      menuId: 'mareyChart',
      JSONData: [],
      stationsData: [],
    }
  },
  methods: {
    paintMareyChart(alldata) {

      function days(val) {
        const values = {
          weekday: d => /^[NLB]$/.test(d.type),
          saturday: d => /^[WS]$/.test(d.type),
          sunday: d => /^[W]$/.test(d.type)
        };
        return values["weekday"](val);
      }
      function direction(val) {
        const values = {
          either: () => true,
          north: d => d.direction === "N",
          south: d => d.direction === "S"
        };
        return values["either"](val);
      }
      // data
      var data = alldata.filter(d => days(d) && direction(d))
      console.log(data)

      var stations = this.stationsData
      var stops = d3.merge(data.map(d => d.stops.map(s => ({ train: d, stop: s }))))
      console.log(stops);

      // chart
      var height = 2400;
      var width = 1200;
      var margin = ({ top: 120, right: 100, bottom: 120, left: 100 })
      var colors = {
        N: "rgb(34, 34, 34)",
        L: "rgb(183, 116, 9)",
        B: "rgb(192, 62, 29)"
      }

      var x = d3.scaleLinear()
        .domain(d3.extent(stations, d => d.distance))
        .range([margin.left + 10, width - margin.right])

      var y = d3.scaleTime()
        .domain([parseTime("4:30AM"), parseTime("1:30AM")])
        .range([margin.top, height - margin.bottom])

      var line = d3.line()
        .x(d => x(d.station.distance))
        .y(d => y(new Date(d.time)))

      var voronoi = Delaunay
        .from(stops, d => x(d.stop.station.distance), d => y(new Date(d.stop.time)))
        .voronoi([0, 0, width, height])

      var tooltipColors = ({
        N: "rgba(114, 114, 114, 0.94)",
        L: "rgba(183, 116, 9, 0.94)",
        B: "rgba(192, 62, 29, 0.94)"
      })
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
            let currentIdSearch = "#id" + d.train.number;
            d3.select(currentIdSearch)
              .attr("stroke-width", 1.2)
              .selectAll("rect")
              .attr("stroke", "none");
            tooltip.style("display", "none");
          })

          .on("mouseover", d => {

            let currentIdSearch = "#id" + d.train.number;
            d3.select(currentIdSearch)
              .attr("stroke-width", 2.5)
              .selectAll("rect")
              .attr("stroke", "black");
            //console.log(" currentIdSearch ", currentIdSearch);

            tooltip
              .style("display", null)
              .attr("fill", "white");
            line1.text(`${d.train.number}${d.train.direction}`);
            line2.text(d.stop.station.name);
            line3.text(d.stop.time.toLocaleString(undefined, { hour: "numeric", minute: "numeric" }));
            path
              .attr("stroke", "none")
              .attr("fill", tooltipColors[d.train.type]);
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


      const svg = d3.select('#' + this.menuId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const train = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-width", 1.2)
        .selectAll("g")
        .data(data)
        .join("g")
        .style("color", d => colors[d.type])
        .attr("id", d => ("id" + d.number));

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
        .attr("r", 2.5);

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
          .attr("stroke-opacity", 0.2)
          .attr("stroke-dasharray", "1.5,2")
          .attr("stroke", "currentColor"))
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

      var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .style("font", "12px sans-serif")
        .call(d3.axisLeft(y)
          .ticks(d3.timeHour)
          .tickSize(0)
          .tickFormat(date => date.toLocaleString(undefined, { hour: "numeric" })))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone().lower()
          .attr("stroke-opacity", 0.2)
          .attr("x2", width - 80))

      svg.append("g")
        .call(xAxis);
      svg.append("g")
        .call(yAxis);
      svg.append("g")
        .call(tooltip);

      function parseTime(string) {
        const parseTime = d3.timeParse("%I:%M%p");
        const date = parseTime(string);
        if (date !== null && date.getHours() < 3) date.setDate(date.getDate() + 1);
        return date;
      }

    },
    getJsonData() {
      this.$http.get("/api/alldata.json").then(Response => {
        if (Response.status === 200) {
          this.JSONData = Response.data;
          this.paintMareyChart(this.JSONData);
        } else {
          console.log("error");
        }
      })
    },
    getStationsData() {
      this.$http.get("/api/stations.json").then(Response => {
        if (Response.status === 200) {
          this.stationsData = Response.data;
          console.log(this.stationsData);
          this.getJsonData();
        } else {
          console.log("error");
        }
      })
    }
  },
  mounted() {
    this.getStationsData();
  }
}
</script>

<style>
</style>
