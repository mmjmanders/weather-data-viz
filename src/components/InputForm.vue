<script setup lang="ts">
import { useForm } from 'vee-validate'
import { type InputForm as InputFormType, InputFormSchema } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'

const emit = defineEmits<{
  'submit:data': [startDate: string, endDate: string, location: string]
}>()

const { values, defineField } = useForm<InputFormType>({
  validationSchema: toTypedSchema(InputFormSchema),
  validateOnMount: false,
})
</script>

<template></template>

<style scoped></style>
