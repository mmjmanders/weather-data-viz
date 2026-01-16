<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import InputForm from '@/components/InputForm.vue'
import type { HistoricalWeather } from '@/types'
import { ref } from 'vue'
import WeatherChart from '@/components/WeatherChart.vue'

const { VITE_BUILD_SHA } = import.meta.env
const version = VITE_BUILD_SHA || 'dev'

const weatherData = ref<HistoricalWeather | undefined>(undefined)
</script>

<template>
  <header>
    <nav>
      <img src="/logo.svg" alt="logo" class="w-12 h-12" />
      <h1 class="title">Weather Data Viz</h1>
      <a
        class="version"
        rel="noopener"
        target="_blank"
        :href="'https://github.com/mmjmanders/weather-data-viz/tree/' + version"
        >{{ version }}</a
      >
    </nav>
  </header>
  <main>
    <InputForm v-model="weatherData" />
    <WeatherChart v-if="weatherData" :weatherData="weatherData" />
  </main>
  <VueQueryDevtools />
</template>

<style scoped></style>
