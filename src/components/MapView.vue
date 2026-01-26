<script setup lang="ts">
import type { Coordinates } from '@/types'
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps<{
  coordinates: Coordinates
}>()

const mapEl = ref<HTMLElement | null>(null)
const map = ref<L.Map | undefined>(undefined)
const marker = ref<L.Marker | undefined>(undefined)

const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

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
  marker.value = L.marker([coordinates.latitude, coordinates.longitude], {
    icon,
  }).addTo(map.value as L.Map)

  map.value.invalidateSize()
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
