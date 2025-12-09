import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'admin-lte/dist/css/adminlte.min.css'

// JS
import 'jquery'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'admin-lte/dist/js/adminlte.min.js'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
