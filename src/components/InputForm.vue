<script setup lang="ts">
import { checkEndDateAfterStartDate, DEFAULT_DATE_FORMAT } from '@/utils'
import { type InputForm as InputFormType, InputFormSchema } from '@/types'
import dayjs from 'dayjs'
import { useForm } from '@tanstack/vue-form'
import { ref } from 'vue'
import { offset, useFloating } from '@floating-ui/vue'

const today = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)
const { Field, useStore, Subscribe, handleSubmit } = useForm({
  defaultValues: {
    startDate: today,
    endDate: today,
    location: '',
  } as InputFormType,
  validators: {
    onChange: ({ value }) => {
      const errors: Record<string, string> = {}
      const result = InputFormSchema.safeParse(value)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errors[String(issue.path[0])] = issue.message
        })
      }
      if (!checkEndDateAfterStartDate(value.startDate, value.endDate)) {
        errors.endDate = 'End date cannot be before start date'
      }
      return Object.keys(errors).length ? errors : undefined
    },
  },
  onSubmit: ({ value }) => {
    emit('submit:data', value.startDate, value.endDate, value.location)
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
  placement: 'bottom-start',
  middleware: [offset(5)],
})

const locationInputRef = ref(null)
const locationFloating = ref(null)
const { floatingStyles: locationFloatingStyles } = useFloating(locationInputRef, locationFloating, {
  placement: 'bottom-start',
  middleware: [offset(5)],
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 flex flex-col gap-1">
        <Field name="startDate">
          <template v-slot="{ field }">
            <label :for="field.name" class="text-slate-950 dark:text-slate-50">Start date</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              type="date"
              :max="maxDate"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="bg-slate-50 px-2 py-1 rounded-md border border-slate-500 focus:outline-none"
            />
          </template>
        </Field>
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <Field name="endDate">
          <template v-slot="{ field }">
            <label :for="field.name" class="text-slate-950 dark:text-slate-50">End date</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              ref="endDateInputRef"
              type="date"
              :max="maxDate"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="bg-slate-50 px-2 py-1 rounded-md border focus:outline-none"
              :class="{
                'border-slate-500': !errorMap?.endDate,
                'border-coral-400': errorMap?.endDate,
              }"
            />
            <div
              ref="endDateFloating"
              v-if="errorMap?.endDate"
              class="text-coral-400 text-xs"
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
            <label :for="field.name" class="text-slate-950 dark:text-slate-50">Location</label>
            <input
              :id="field.name"
              :name="field.name"
              ref="locationInputRef"
              :value="field.state.value"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="bg-slate-50 px-2 py-1 rounded-md border focus:outline-none"
              :class="{
                'border-slate-500': !errorMap?.location,
                'border-coral-400': errorMap?.location,
              }"
            />
            <div
              ref="locationFloating"
              v-if="errorMap?.location"
              class="text-coral-400 text-xs"
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
            :disabled="isPristine || !canSubmit"
            class="disabled:cursor-not-allowed rounded-md bg-cyan-300 px-2 py-1 disabled:opacity-50 cursor-pointer text-slate-950"
          >
            Submit
          </button>
        </template>
      </Subscribe>
    </div>
  </form>
</template>

<style scoped></style>
