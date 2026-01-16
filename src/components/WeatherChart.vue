<script setup lang="ts">
import type { HistoricalWeather } from '@/types'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'

const props = defineProps<{
  weatherData: HistoricalWeather
}>()

use([CanvasRenderer, LineChart, BarChart, TitleComponent, GridComponent])

const options = computed<EChartsOption>(() => ({
  title: {
    text: 'Weather data',
  },
  xAxis: {
    type: 'time',
  },
  yAxis: [
    {
      id: 'Temperature',
      type: 'value',
      name: 'Temperature',
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
  <VChart class="chart w-full" :option="options" />
</template>

<style scoped>
@reference "tailwindcss"

.chart {
  @apply h-96;
}
</style>
