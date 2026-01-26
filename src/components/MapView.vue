<script setup lang="ts">
import type { Coordinates } from '@/types'
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{
  coordinates: Coordinates
}>()

const mapEl = ref<HTMLElement | null>(null)
const map = ref<L.Map | undefined>(undefined)
const marker = ref<L.Marker | undefined>(undefined)

const updateMap = (data?: Coordinates) => {
  if (!mapEl.value) return

  if (!map.value) {
    map.value = L.map(mapEl.value)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.value as L.Map)
  }

  if (marker.value) {
    map.value.removeLayer(marker.value as L.Marker)
  }

  const coordinates = data ?? props.coordinates
  map.value.setView([coordinates.latitude, coordinates.longitude], 13)
  marker.value = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map.value as L.Map)
}

watch(
  () => props.coordinates,
  (data) => {
    if (!data) return
    else updateMap(data)
  },
  { deep: true },
)

onMounted(updateMap)
</script>

<template>
  <div class="h-48 sm:h-72 md:h-96 w-full" ref="mapEl" />
</template>

<style scoped></style>
