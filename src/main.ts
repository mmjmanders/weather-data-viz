import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faLocationCrosshairs, faCheck } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
} from 'chart.js'
import '@fontsource-variable/manrope'
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './main.css'

library.add(faSpinner, faLocationCrosshairs, faCheck)

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
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
