import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { type HistoricalWeather, HistoricalWeatherSchema } from '@/types'

const { VITE_OPENMETEO_API_URL: apiUrl } = import.meta.env

export const useHistoricalWeather = (
  startDate: Ref<string | undefined>,
  endDate: Ref<string | undefined>,
  latitude: Ref<number | undefined>,
  longitude: Ref<number | undefined>,
) =>
  useQuery<HistoricalWeather | undefined>({
    queryKey: ['historical-weather', startDate, endDate, latitude, longitude],
    enabled: computed(
      () =>
        startDate.value != undefined &&
        endDate.value != undefined &&
        latitude.value != undefined &&
        longitude.value != undefined,
    ),
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/archive?daily=temperature_2m_mean,sunshine_duration,precipitation_sum&start_date=${startDate.value}&end_date=${endDate.value}&latitude=${latitude.value}&longitude=${longitude.value}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch reverse geolocation')
      }
      const data = await response.json()
      return HistoricalWeatherSchema.parse(data)
    },
  })
