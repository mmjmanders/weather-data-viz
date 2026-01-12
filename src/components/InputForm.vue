<script setup lang="ts">
import { useForm } from 'vee-validate'
import { DEFAULT_DATE_FORMAT, type InputForm as InputFormType, InputFormSchema } from '@/types'
import { toTypedSchema } from '@vee-validate/yup'
import dayjs from 'dayjs'

const emit = defineEmits<{
  'submit:data': [startDate: string, endDate: string, location: string]
}>()

const { defineField, handleSubmit } = useForm<InputFormType>({
  validationSchema: toTypedSchema(InputFormSchema),
  validateOnMount: false,
  initialValues: {
    startDate: dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT),
    endDate: dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT),
  },
})

const maxDate = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)

const [startDateField, startDateFieldAttrs] = defineField('startDate')
const [endDateField, endDateFieldAttrs] = defineField('endDate')
const [locationField, locationFieldAttrs] = defineField('location')

const onSubmit = handleSubmit(({ startDate, endDate, location }) => {
  emit('submit:data', startDate, endDate, location)
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="input-group">
      <label for="startDate">Start date</label>
      <input
        id="startDate"
        name="startDate"
        type="date"
        :max="maxDate"
        v-model="startDateField"
        v-bind="startDateFieldAttrs"
      />
    </div>
    <div class="input-group">
      <label for="endDate">End date</label>
      <input
        id="endDate"
        name="endDate"
        type="date"
        :max="maxDate"
        v-model="endDateField"
        v-bind="endDateFieldAttrs"
      />
    </div>
    <div class="input-group">
      <label for="location">Location</label>
      <input id="location" name="location" v-model="locationField" v-bind="locationFieldAttrs" />
    </div>
  </form>
</template>

<style scoped></style>
