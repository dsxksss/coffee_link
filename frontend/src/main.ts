import App from './App.vue'
import { createApp } from 'vue'
import './index.css'
import Toast, { POSITION, PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

import router from "./router.js"

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faMugHot, faDoorOpen, faDisease, faRightToBracket,
    faClose, faLink, faRightFromBracket, faHeart, faStar,
    faHeartCrack, faLinkSlash,faPencil,faPenToSquare,faFire,
    faEye, faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faMugHot, faDoorOpen, faDisease,
    faRightToBracket, faClose, faLink,
    faRightFromBracket, faHeart, faStar,
    faHeartCrack, faLinkSlash, faPencil, 
    faPenToSquare, faFire, faEye, faEyeSlash,
);

const options: PluginOptions = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.BOTTOM_CENTER,
    hideProgressBar: true,
    timeout: 3500
};

createApp(App)
    .use(router)
    .use(Toast, options)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
