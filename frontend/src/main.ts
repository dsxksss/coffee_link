import App from './App.vue'
import { createApp } from 'vue'
import './index.css'
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

import router from "./router.js"

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faMugHot, faDoorOpen, faDisease, faRightToBracket,
    faClose, faLink, faRightFromBracket, faHeart, faStar, faHeartCrack
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faMugHot, faDoorOpen, faDisease,
    faRightToBracket, faClose, faLink,
    faRightFromBracket, faHeart, faStar, faHeartCrack
);

const options: PluginOptions = {
    // You can set your default options here
};

createApp(App)
    .use(router)
    .use(Toast, options)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
