import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { type HistoricalWeather, HistoricalWeatherSchema } from '@/types'
import { upfetch } from '@/utils'

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
    queryFn: () =>
      upfetch(`${apiUrl}/archive`, {
        schema: HistoricalWeatherSchema,
        params: {
          daily: 'temperature_2m_mean,sunshine_duration,precipitation_sum',
          start_date: startDate.value,
          end_date: endDate.value,
          latitude: latitude.value,
          longitude: longitude.value,
        },
      }),
  })
