<template>
  <div>
    <!-- MareyChart -->
    <div class="button_bar">
      <span class="margin0_5px">操作栏:</span>
      <mu-date-input icon="today" v-model="startDate" label="起始" type="dateTime" clock-type="24hr"></mu-date-input>
      <mu-date-input icon="today" v-model="endDate" label="结束" type="dateTime" clock-type="24hr"></mu-date-input>
      <mu-button class="margin0_5px" color="primary" @click="getHttpData">查询</mu-button>
      <mu-switch v-model="isSwitch" @change="switchChange" label-left></mu-switch>
    </div>
    <div style="text-align: center;">
      <marey-chart ref="mareyChart"></marey-chart>
    </div>
  </div>
</template>

<script>
import util from '../components/util.js';
import mareyChart from '../components/mareyChart.vue';
export default {
  components: { mareyChart },
  data() {
    return {
      isSwitch: false,
      startDate: new Date('2018-09-15 00:00:00'),
      endDate: new Date('2018-09-15 24:00:00'),

      display: false,
      time: undefined
    }
  },
  methods: {
    getHttpData() {
      this.$refs.mareyChart.getStationsData(util.timeFormat(this.startDate), util.timeFormat(this.endDate));
    },
    switchChange(bool) {
      this.$refs.mareyChart.changeTrainColor(bool);
    }
  }
}
</script>

<style>
</style>
