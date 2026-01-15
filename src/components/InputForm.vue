<script setup lang="ts">
import { DEFAULT_DATE_FORMAT } from '@/utils'
import { type InputForm as InputFormType, InputFormSchema } from '@/types'
import dayjs from 'dayjs'
import { useForm } from '@tanstack/vue-form'
import { onMounted, ref, watch } from 'vue'
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { useGeolocation, useReverseGeolocation } from '@/queries'

const today = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)
const { Field, useStore, Subscribe, handleSubmit, setFieldValue } = useForm({
  defaultValues: {
    startDate: today,
    endDate: today,
    location: '',
  } as InputFormType,
  validators: {
    onChange: ({ value: formData }) => {
      const errors: Record<string, string> = {}
      const result = InputFormSchema.safeParse(formData)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errors[String(issue.path[0])] = issue.message
        })
      }
      return Object.keys(errors).length ? errors : undefined
    },
  },
  onSubmit: ({ value: formData }) => {
    location.value = formData.location
    emit('submit:data', formData.startDate, formData.endDate, formData.location)
  },
})

const emit = defineEmits<{
  'submit:data': [startDate: string, endDate: string, location: string]
}>()

const maxDate = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)

const errorMap = useStore((state) => state.errorMap.onChange)

const endDateInputRef = ref(null)
const endDateFloating = ref(null)
const { floatingStyles: endDateFloatingStyles } = useFloating(endDateInputRef, endDateFloating, {
  placement: 'bottom-end',
  middleware: [offset(5)],
  whileElementsMounted: autoUpdate,
})

const locationInputRef = ref(null)
const locationFloating = ref(null)
const { floatingStyles: locationFloatingStyles } = useFloating(locationInputRef, locationFloating, {
  placement: 'bottom-end',
  middleware: [offset(5)],
  whileElementsMounted: autoUpdate,
})

const latitude = ref<number | undefined>(undefined)
const longitude = ref<number | undefined>(undefined)
const isUsingGeolocation = ref<boolean>(false)
const { data: reverseGeolocationData } = useReverseGeolocation(latitude, longitude)

const location = ref<string | undefined>(undefined)
const placeId = ref<string | undefined>(undefined)
const { data: geolocationData } = useGeolocation(location, placeId)

watch(
  () => reverseGeolocationData.value,
  (data) => {
    if (data?.display_name) {
      setFieldValue('location', data.display_name)
    }
    if (data?.place_id) {
      placeId.value = data.place_id
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (navigator.geolocation) {
    isUsingGeolocation.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude
        longitude.value = position.coords.longitude
        isUsingGeolocation.value = false
      },
      () => {
        isUsingGeolocation.value = false
      },
    )
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 flex flex-col gap-1">
        <Field name="startDate">
          <template v-slot="{ field }">
            <label :for="field.name">Start date</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              type="date"
              :max="maxDate"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="input"
            />
          </template>
        </Field>
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <Field name="endDate">
          <template v-slot="{ field }">
            <label :for="field.name">End date</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              ref="endDateInputRef"
              type="date"
              :max="maxDate"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="input"
              :class="{
                'has-error': errorMap?.endDate,
              }"
            />
            <div
              ref="endDateFloating"
              v-if="errorMap?.endDate"
              class="input-error"
              :style="endDateFloatingStyles"
            >
              {{ errorMap.endDate }}
            </div>
          </template>
        </Field>
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <Field name="location">
          <template v-slot="{ field }">
            <label :for="field.name">Location</label>
            <input
              :id="field.name"
              :name="field.name"
              ref="locationInputRef"
              :value="field.state.value"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="input"
              :class="{
                'has-error': errorMap?.location,
              }"
            />
            <div
              ref="locationFloating"
              v-if="errorMap?.location"
              class="input-error"
              :style="locationFloatingStyles"
            >
              {{ errorMap.location }}
            </div>
          </template>
        </Field>
      </div>
    </div>
    <div>
      <Subscribe>
        <template v-slot="{ canSubmit, isPristine }">
          <button
            type="submit"
            :aria-disabled="isUsingGeolocation || isPristine || !canSubmit"
            :disabled="isUsingGeolocation || isPristine || !canSubmit"
            class="btn btn-primary"
          >
            Submit
          </button>
        </template>
      </Subscribe>
    </div>
  </form>
</template>

<style scoped></style>
