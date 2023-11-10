import App from './App.vue'
import { createApp } from 'vue'
import './assets/index.css'
import Toast, { PluginOptions } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)

const options: PluginOptions = {
    // You can set your default options here
};

createApp(App)
    .use(Toast, options)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
