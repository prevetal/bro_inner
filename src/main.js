import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locale'
import Notifications from '@kyvg/vue3-notification'


// Create App
const app = createApp(App)


// Pinia
const pinia = createPinia()


// Vue use
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Notifications)


// Vue provide
app.provide('i18n', i18n)


// Mount
app.mount('#app')
