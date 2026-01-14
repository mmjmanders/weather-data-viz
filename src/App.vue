<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import InputForm from '@/components/InputForm.vue'

const logValues = (startDate: string, endDate: string, location: string) => {
  console.log('Received data:', startDate, endDate, location)
}
</script>

<template>
  <header>
    <nav>
      <img src="/logo.svg" alt="logo" class="w-12 h-12" />
      <h1>Weather Data Viz</h1>
    </nav>
  </header>
  <main>
    <InputForm @submit:data="logValues" />
  </main>
  <VueQueryDevtools />
</template>

<style scoped></style>
