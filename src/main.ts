import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import '@fontsource-variable/manrope'
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './main.css'

createApp(App)
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 60 * 60 * 1000,
        },
      },
    },
  })
  .mount('#app')
