<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import InputForm from '@/components/InputForm.vue'

const logValues = (startDate: string, endDate: string, location: string) => {
  console.log('Received data:', startDate, endDate, location)
}
</script>

<template>
  <header class="w-full flex justify-center bg-slate-300 dark:bg-slate-700">
    <nav class="w-full h-full md:w-3xl lg:w-5xl mx-auto flex gap-2 items-center px-4">
      <img src="/logo.svg" alt="logo" class="w-12 h-12" />
      <h1 class="text-4xl font-bold text-slate-950 dark:text-slate-50">Weather Data Viz</h1>
    </nav>
  </header>
  <main class="w-full md:w-3xl lg:w-5xl mx-auto px-4">
    <InputForm @submit:data="logValues" />
  </main>
  <VueQueryDevtools />
</template>

<style scoped></style>
