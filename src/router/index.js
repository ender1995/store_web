import {createRouter, createWebHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'

const routes = [
    {path: '/login', name: 'Login', component: Login},
    {path: '/', component: Dashboard, meta: {requiresAuth: true}},
    {path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword},
    {path: '/reset-password', name: 'ResetPassword', component: ResetPassword}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')

    if (to.meta?.requiresAuth && !token) {
        next('/login') // chưa có token → redirect login
    } else if (to.path === '/login' && token) {
        next('/') // đã login mà vào login → redirect dashboard
    } else {
        next()
    }
})

export default router