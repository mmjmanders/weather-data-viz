<script setup lang="ts">
import { DEFAULT_DATE_FORMAT, MINIMUM_DATE } from '@/utils'
import { type HistoricalWeather, type InputForm as InputFormType, InputFormSchema } from '@/types'
import dayjs from 'dayjs'
import { useForm } from '@tanstack/vue-form'
import { computed, ref, watch } from 'vue'
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { useGeolocation, useHistoricalWeather, useReverseGeolocation } from '@/queries'

// Constants
const weatherData = defineModel<HistoricalWeather>()
const minDate = dayjs(MINIMUM_DATE).format(DEFAULT_DATE_FORMAT)
const maxDate = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)

// Form setup
const { Field, useStore, Subscribe, handleSubmit, setFieldValue } = useForm({
  defaultValues: {
    startDate: maxDate,
    endDate: maxDate,
    location: undefined,
    useLocationApi: false,
  } as InputFormType,
  validators: {
    onChange: ({ value: formData }) => {
      const result = InputFormSchema.safeParse(formData)
      if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.issues.forEach((issue) => {
          errors[String(issue.path[0])] = issue.message
        })
        return errors
      }
      return undefined
    },
  },
  onSubmit: ({ value: formData }) => {
    startDate.value = formData.startDate
    endDate.value = formData.endDate

    if (formData.useLocationApi) {
      lat.value = latitude.value
      lon.value = longitude.value
    } else if (formData.location) {
      location.value = formData.location
    }
  },
})

const errorMap = useStore((state) => state.errorMap.onChange)
const useLocationApiValue = useStore<boolean>((state) => state.values.useLocationApi)

// Floating UI setup for error messages
const createFloatingSetup = () => {
  const inputRef = ref(null)
  const floatingRef = ref(null)
  const { floatingStyles } = useFloating(inputRef, floatingRef, {
    placement: 'bottom-end',
    middleware: [offset(5)],
    whileElementsMounted: autoUpdate,
  })
  return { inputRef, floatingRef, floatingStyles }
}

const endDateFloat = createFloatingSetup()
const locationFloat = createFloatingSetup()

// Location API state
const latitude = ref<number | undefined>(undefined)
const longitude = ref<number | undefined>(undefined)
const location = ref<string | null | undefined>(undefined)
const placeId = ref<string | null | undefined>(undefined)

// Weather data state
const startDate = ref<string | undefined>(undefined)
const endDate = ref<string | undefined>(undefined)
const lat = ref<number | undefined>(undefined)
const lon = ref<number | undefined>(undefined)

// Queries
const { data: reverseGeolocationData } = useReverseGeolocation(latitude, longitude)
const { data: geolocationData, isLoading: isLoadingGeolocationData } = useGeolocation(
  location,
  placeId,
)
const { data: historicalWeatherData, isLoading: isLoadingWeatherData } = useHistoricalWeather(
  startDate,
  endDate,
  lat,
  lon,
)

// Computed
const isLocationApiSupported = computed(() => 'geolocation' in navigator)
const isLocationApiPending = ref<boolean>(false)

// Handle location API toggle
const handleLocationApiToggle = (enabled: boolean) => {
  if (!enabled) {
    latitude.value = undefined
    longitude.value = undefined
    return
  }

  if (!isLocationApiSupported.value) {
    setFieldValue('useLocationApi', false)
    return
  }

  isLocationApiPending.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude.value = position.coords.latitude
      longitude.value = position.coords.longitude
      isLocationApiPending.value = false
    },
    (error) => {
      console.error('Geolocation error:', error.message)
      setFieldValue('useLocationApi', false)
      latitude.value = undefined
      longitude.value = undefined
      isLocationApiPending.value = false
    },
    { maximumAge: 0, timeout: 10000, enableHighAccuracy: true },
  )
}

// Watchers
watch(useLocationApiValue, handleLocationApiToggle)

watch(reverseGeolocationData, (data) => {
  if (data) {
    setFieldValue('location', data.display_name)
    placeId.value = data.place_id
  }
})

watch(geolocationData, (data) => {
  if (data) {
    lat.value = data.lat
    lon.value = data.lon
  }
})

watch(historicalWeatherData, (data) => {
  if (data) {
    weatherData.value = data
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex flex-col gap-1">
          <Field name="startDate">
            <template v-slot="{ field }">
              <label :for="field.name">Start date</label>
              <input
                :id="field.name"
                :name="field.name"
                :value="field.state.value"
                type="date"
                :min="minDate"
                :max="maxDate"
                @input="field.handleChange(($event.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                class="input"
              />
            </template>
          </Field>
        </div>
        <div class="flex flex-col gap-1">
          <Field name="endDate">
            <template v-slot="{ field }">
              <label :for="field.name">End date</label>
              <input
                :id="field.name"
                :name="field.name"
                :value="field.state.value"
                ref="endDateFloat.inputRef"
                type="date"
                :min="minDate"
                :max="maxDate"
                @input="field.handleChange(($event.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                class="input"
                :class="{ 'has-error': errorMap?.endDate }"
              />
              <div
                ref="endDateFloat.floatingRef"
                v-if="errorMap?.endDate"
                class="input-error"
                :style="endDateFloat.floatingStyles"
              >
                {{ errorMap.endDate }}
              </div>
            </template>
          </Field>
        </div>
        <div class="flex flex-col gap-1">
          <Field name="location">
            <template v-slot="{ field }">
              <label :for="field.name">Location</label>
              <input
                :id="field.name"
                :name="field.name"
                ref="locationFloat.inputRef"
                :value="field.state.value"
                @input="field.handleChange(($event.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                :disabled="useLocationApiValue"
                :readonly="useLocationApiValue"
                class="input"
                :class="{ 'has-error': errorMap?.location }"
              />
              <div
                ref="locationFloat.floatingRef"
                v-if="errorMap?.location"
                class="input-error"
                :style="locationFloat.floatingStyles"
              >
                {{ errorMap.location }}
              </div>
            </template>
          </Field>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <Field name="useLocationApi">
          <template v-slot="{ field }">
            <label :for="field.name" class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :id="field.name"
                :name="field.name"
                :checked="field.state.value"
                @change="field.handleChange(($event.target as HTMLInputElement).checked)"
                class="cursor-pointer"
              />
              <span>Use current location</span>
            </label>
          </template>
        </Field>
        <Subscribe>
          <template v-slot="{ canSubmit, isPristine }">
            <button
              type="submit"
              :aria-disabled="
                isLocationApiPending || isLoadingGeolocationData || isPristine || !canSubmit
              "
              :disabled="
                isLocationApiPending || isLoadingGeolocationData || isPristine || !canSubmit
              "
              class="btn btn-primary md:ml-auto"
            >
              <font-awesome-icon
                v-if="isLoadingWeatherData || isLoadingGeolocationData"
                icon="fa-solid fa-spinner"
                spin
              />
              Submit
            </button>
          </template>
        </Subscribe>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
