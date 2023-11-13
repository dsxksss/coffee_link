import { createRouter, createWebHistory } from "vue-router"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"

const routesMap = [
    { path: '/:pathMatch(.*)', component: NotFound },
    { path: '/', component: Home },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routesMap
})

export default router