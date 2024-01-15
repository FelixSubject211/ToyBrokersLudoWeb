import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import './registerServiceWorker'

const emitter = mitt();

const app = createApp(App);
app.use(PrimeVue);
app.provide('emitter', emitter);
app.mount('#app');

