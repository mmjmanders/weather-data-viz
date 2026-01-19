<script setup lang="ts">
import type { HistoricalWeather } from '@/types'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
} from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
)

const props = defineProps<{
  weatherData: HistoricalWeather
}>()

const style = window.getComputedStyle(document.documentElement)
const temperatureColor = style.getPropertyValue('--color-temperature')
const precipitationColor = style.getPropertyValue('--color-precipitation')
const sunshineColor = style.getPropertyValue('--color-sunshine')

const data = computed(() => {
  const { daily } = props.weatherData

  return {
    labels: [...daily.time.map((date) => dayjs(date).format('MMM D'))],
    datasets: [
      {
        type: 'line' as const,
        label: 'Temperature (°C)',
        data: [...daily.temperature_2m_mean],
        borderColor: temperatureColor,
        backgroundColor: temperatureColor,
        yAxisID: 'yTemperature',
        tension: 0.1,
      },
      {
        type: 'bar' as const,
        label: 'Precipitation (mm)',
        data: [...daily.precipitation_sum],
        backgroundColor: precipitationColor,
        yAxisID: 'yPrecipitation',
      },
      {
        type: 'bar' as const,
        label: 'Sunshine (h)',
        data: [...daily.sunshine_duration],
        backgroundColor: sunshineColor,
        yAxisID: 'ySunshine',
      },
    ],
  }
})

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
    },
    yTemperature: {
      type: 'linear' as const,
      position: 'left' as const,
      title: {
        display: true,
        text: 'Temperature (°C)',
      },
    },
    yPrecipitation: {
      type: 'linear' as const,
      position: 'right' as const,
      title: {
        display: true,
        text: 'Precipitation (mm)',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    ySunshine: {
      type: 'linear' as const,
      position: 'right' as const,
      title: {
        display: true,
        text: 'Sunshine (h)',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
}))
</script>

<template>
  <div class="h-full w-full">
    <Chart type="bar" :data="data" :options="options" />
  </div>
</template>

<style scoped></style>
