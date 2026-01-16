<script setup lang="ts">
import type { HistoricalWeather } from '@/types'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import dayjs from 'dayjs'

const props = defineProps<{
  weatherData: HistoricalWeather
}>()

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

const options = computed<EChartsOption>(() => ({
  title: {
    text: 'Weather data',
  },
  legend: {
    data: ['Temperature'],
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'time',
    axisLabel: {
      rotate: 45,
      formatter: (val) => {
        return dayjs(val).format('dddd, MMMM D, YYYY')
      },
    },
  },
  yAxis: [
    {
      id: 'Temperature',
      type: 'value',
      name: 'Temperature',
      axisLabel: {
        formatter: `{value} ${props.weatherData.daily_units.temperature_2m_mean}`,
      },
    },
  ],
  series: [
    {
      id: 'Temperature',
      name: 'Temperature',
      type: 'line',
      data: props.weatherData.daily.temperature_2m_mean.map((data, i) => [
        props.weatherData.daily.time[i],
        data,
      ]),
    },
  ],
}))
</script>

<template>
  <div class="min-h-96">
    <VChart class="chart" :option="options" :autoresize="true" />
  </div>
</template>

<style scoped></style>
