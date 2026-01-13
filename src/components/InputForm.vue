<script setup lang="ts">
import { DEFAULT_DATE_FORMAT } from '@/utils'
import { type InputForm as InputFormType, InputFormSchema } from '@/types'
import dayjs from 'dayjs'

const emit = defineEmits<{
  'submit:data': [startDate: string, endDate: string, location: string]
}>()

const maxDate = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)
</script>

<template>
  <form class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 flex flex-col gap-1">
        <label for="startDate">Start date</label>
        <input id="startDate" name="startDate" type="date" :max="maxDate" />
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <label for="endDate">End date</label>
        <input id="endDate" name="endDate" type="date" :max="maxDate" />
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <label for="location">Location</label>
        <input id="location" name="location" />
      </div>
    </div>
    <div>
      <button type="submit" :disabled="true" class="disabled:cursor-not-allowed">Submit</button>
    </div>
  </form>
</template>

<style scoped></style>
