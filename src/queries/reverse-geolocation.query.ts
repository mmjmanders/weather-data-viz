import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { type ReverseGeolocation, ReverseGeolocationSchema } from '@/types'
import { upfetch } from '@/utils'

const { VITE_LOCATIONIQ_API_URL: apiUrl, VITE_LOCATIONIQ_API_KEY: apiKey } = import.meta.env

export const useReverseGeolocation = (
  latitude: Ref<number | undefined>,
  longitude: Ref<number | undefined>,
) =>
  useQuery<ReverseGeolocation | undefined, Error>({
    queryKey: ['reverse-geolocation', latitude, longitude],
    enabled: computed(() => latitude.value != undefined && longitude.value != undefined),
    queryFn: async () =>
      upfetch(`${apiUrl}/reverse`, {
        schema: ReverseGeolocationSchema,
        params: {
          format: 'json',
          key: apiKey,
          'accept-language': 'native',
          lat: latitude.value,
          lon: longitude.value,
        },
      }),
  })
