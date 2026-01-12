<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <header class="w-full flex justify-center bg-slate-300 dark:bg-slate-700">
    <nav class="w-full h-full md:w-4xl mx-auto flex gap-2 items-center px-4">
      <img src="/logo.svg" alt="logo" class="w-12 h-12" />
      <h1 class="text-4xl font-bold text-slate-950 dark:text-slate-50">Weather Data Viz</h1>
    </nav>
  </header>
  <VueQueryDevtools />
</template>

<style scoped></style>
