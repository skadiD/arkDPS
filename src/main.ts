import { createApp } from 'vue'
import {router} from "./plugins/router.ts";
import './style.css'
import './components/main.css'
import VueClickAway from "vue3-click-away";
import App from './App.vue'
createApp(App).use(router).use(VueClickAway).mount('#app')
