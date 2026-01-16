import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { type Geolocation, GeolocationSchema } from '@/types'
import { upfetch } from '@/utils'

const { VITE_LOCATIONIQ_API_URL: apiUrl, VITE_LOCATIONIQ_API_KEY: apiKey } = import.meta.env

export const useGeolocation = (
  location: Ref<string | null | undefined>,
  place: Ref<string | null | undefined>,
) =>
  useQuery<Geolocation | undefined, Error>({
    queryKey: ['geolocation', location, place],
    enabled: computed(() => location.value != undefined),
    queryFn: () =>
      upfetch(`${apiUrl}/search`, {
        schema: GeolocationSchema,
        parseResponse: async (response) => {
          const data = await response.json()
          return data.find((d: any) => d.place_id === place.value) || data[0]
        },
        params: {
          format: 'json',
          key: apiKey,
          'accept-language': 'native',
          q: location.value,
        },
      }),
  })
