<script setup lang="ts">
import type { Coordinates } from '@/types'
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{
  coordinates: Coordinates
}>()

const mapEl = ref<HTMLElement | null>(null)
const map = ref<L.Map | undefined>(undefined)

const initMap = () => {
  if (!mapEl.value || map.value) return

  map.value = L.map(mapEl.value).setView(
    [props.coordinates.latitude, props.coordinates.longitude],
    13,
  )
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value as L.Map)
}

watch(
  () => props.coordinates,
  (data) => {
    if (!data) return
    if (map.value) map.value.setView([data.latitude, data.longitude], 13)
    else initMap()
  },
  { deep: true },
)

onMounted(initMap)
</script>

<template>
  <div class="h-96 w-full" ref="mapEl" />
</template>

<style scoped></style>
