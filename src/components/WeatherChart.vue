<script setup lang="ts">
import type { HistoricalWeather } from '@/types'

defineProps<{
  weatherData: HistoricalWeather
}>()
</script>

<template>
  <div>{{ weatherData }}</div>
</template>

<style scoped></style>
