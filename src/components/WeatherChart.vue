<script setup lang="ts">
import type { HistoricalWeather } from '@/types'
import { computed } from 'vue'
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

const data = computed(() => {
  const { daily } = props.weatherData

  return {
    labels: [...daily.time.map((date) => dayjs(date).format('MMM D'))],
    datasets: [
      {
        type: 'line' as const,
        label: 'Temperature (°C)',
        data: [...daily.temperature_2m_mean],
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        yAxisID: 'yTemperature',
        tension: 0.1,
      },
      {
        type: 'bar' as const,
        label: 'Precipitation (mm)',
        data: [...daily.precipitation_sum],
        backgroundColor: '#60a5fa',
        yAxisID: 'yPrecipitation',
      },
      {
        type: 'bar' as const,
        label: 'Sunshine (h)',
        data: [...daily.sunshine_duration],
        backgroundColor: '#fbbf24',
        yAxisID: 'ySunshine',
      },
    ],
  }
})

const options = computed(() => {
  const style = getComputedStyle(document.documentElement)
  const textColor = style.getPropertyValue('--foreground') || '#000'

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { display: false },
      },
      yTemperature: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#f87171',
        },
        ticks: { color: '#f87171' },
      },
      yPrecipitation: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Precipitation (mm)',
          color: '#60a5fa',
        },
        ticks: { color: '#60a5fa' },
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
          color: '#fbbf24',
        },
        ticks: { color: '#fbbf24' },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: textColor },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  }
})
</script>

<template>
  <div class="h-full w-full">
    <Chart type="bar" :data="data" :options="options" />
  </div>
</template>

<style scoped></style>
