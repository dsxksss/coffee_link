import { createRouter, createWebHistory } from "vue-router"
import BlogManager from "./pages/BlogManager.vue"
import Home from "./pages/Home.vue"
import UserManager from "./pages/UserManager.vue"
import Login from './pages/Login.vue'
import NotFound from "./pages/NotFound.vue"

const routesMap = [
    { path: '/:pathMatch(.*)', component: NotFound },
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/blogmanager', component: BlogManager },
    { path: '/usermanager', component: UserManager },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routesMap
})

// router.beforeEach(async (to, _) => {
//     console.log(localStorage.getItem("isLogin"));
//     if (!localStorage.getItem("isLogin") && to.path !== "/login") {
//         // 将用户重定向到登录页面
//         return { path: '/login' }
//     }
// })

export default router