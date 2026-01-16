<script setup lang="ts">
import type { HistoricalWeather } from '@/types'
import { format, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
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

const options = computed(() => {
  const temperatureColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--color-temperature',
  )
  const precipitationColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--color-precipitation',
  )
  const sunshineColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--color-sunshine',
  )
  return {
    color: [temperatureColor, precipitationColor, sunshineColor],
    title: {
      text: 'Weather data',
    },
    grid: {
      left: 0,
      right: 0,
    },
    legend: {
      data: ['Temperature', 'Precipitation', 'Sunshine'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (
        series: {
          seriesName: string
          data: [Date, number]
          color: string
        }[],
      ) => {
        return `
<div class="flex flex-col gap-1">
  <h2 class="text-sm text-slate-950 dark:text-slate-50 border-b border-b-slate-950 dark:border-b-slate-50">${format.encodeHTML(dayjs(series[0]!.data[0]!).format('dddd, MMMM D, YYYY'))}</h2>
  <table class="text-sm text-slate-950 dark:text-slate-50">
    <tr>
      <td><span style="color: ${series[0]!.color}">&#x25cf;</span>&nbsp;${format.encodeHTML(series[0]!.seriesName!)}</td>
      <td class="text-right font-bold">${format.encodeHTML(series[0]!.data[1]!.toFixed(1))}</td>
    </tr>
    <tr>
     <td><span style="color: ${series[1]!.color}">&#x25cf;</span>&nbsp;${format.encodeHTML(series[1]!.seriesName!)}</td>
     <td class="text-right font-bold">${format.encodeHTML(series[1]!.data[1]!.toFixed(1))}</td>
    </tr>
    <tr>
      <td><span style="color: ${series[2]!.color}">&#x25cf;</span>&nbsp;${format.encodeHTML(series[2]!.seriesName!)}</td>
      <td class="text-right font-bold">${format.encodeHTML(series[2]!.data[1]!.toFixed(1))}</td>
    </tr>
  </table>
</div>
`
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        rotate: 45,
        formatter: (val: Date) => {
          return dayjs(val).format('dddd, MMMM D, YYYY')
        },
      },
    },
    yAxis: [
      {
        id: 'Temperature',
        name: 'Temperature',
        type: 'value',
        axisLabel: {
          formatter: `{value} ${props.weatherData.daily_units.temperature_2m_mean}`,
        },
      },
      {
        id: 'Precipitation',
        name: 'Precipitation',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: `{value} ${props.weatherData.daily_units.precipitation_sum}`,
        },
      },
      {
        id: 'Sunshine',
        name: 'Sunshine',
        type: 'value',
        position: 'right',
        offset: 80,
        axisLabel: {
          formatter: '{value} hours',
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
        yAxisIndex: 0,
      },
      {
        id: 'Precipitation',
        name: 'Precipitation',
        type: 'bar',
        data: props.weatherData.daily.precipitation_sum.map((data, i) => [
          props.weatherData.daily.time[i],
          data,
        ]),
        yAxisIndex: 1,
      },
      {
        id: 'Sunshine',
        name: 'Sunshine',
        type: 'bar',
        data: props.weatherData.daily.sunshine_duration.map((data, i) => [
          props.weatherData.daily.time[i],
          data,
        ]),
        yAxisIndex: 2,
      },
    ],
  }
})
</script>

<template>
  <div class="h-full">
    <VChart class="chart" :option="options" :autoresize="true" />
  </div>
</template>

<style scoped></style>
