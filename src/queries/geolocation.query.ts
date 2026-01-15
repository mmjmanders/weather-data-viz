import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { type Geolocation, GeolocationSchema } from '@/types'

const { VITE_LOCATIONIQ_API_URL: apiUrl, VITE_LOCATIONIQ_API_KEY: apiKey } = import.meta.env

export const useGeolocation = (
  location: Ref<string | undefined>,
  place: Ref<string | null | undefined>,
) =>
  useQuery<Geolocation | undefined, Error>({
    queryKey: ['geolocation', location, place],
    enabled: computed(() => location.value != undefined),
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/search?format=json&key=${apiKey}&accept-language=native&q=${location.value}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch geolocation')
      }
      const data = await response.json()
      const geolocation = data.find((d: any) => d.place_id === place.value) || data[0]
      return GeolocationSchema.parse(geolocation)
    },
  })
