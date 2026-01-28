<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import InputForm from '@/components/InputForm.vue'
import type { Coordinates, HistoricalWeather } from '@/types'
import { ref } from 'vue'
import WeatherChart from '@/components/WeatherChart.vue'
import MapView from '@/components/MapView.vue'

const { VITE_BUILD_SHA } = import.meta.env
const version = VITE_BUILD_SHA || 'dev'

const weatherData = ref<HistoricalWeather | undefined>(undefined)
const coordinates = ref<Coordinates | undefined>(undefined)
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
    <InputForm v-model:weatherData="weatherData" v-model:coordinates="coordinates" />
    <MapView v-if="coordinates" :coordinates="coordinates" />
    <WeatherChart v-if="weatherData" :weatherData="weatherData"
      >Unable to render chart</WeatherChart
    >
  </main>
  <VueQueryDevtools />
</template>

<style scoped></style>
