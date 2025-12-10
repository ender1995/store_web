import {createRouter, createWebHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import ProductList from '@/views/ProductList.vue'
import InvoiceList from '@/views/InvoiceList.vue'
import UserList from "@/views/users/UserList.vue";

const routes = [
    // Redirect root → dashboard
    {
        path: '/',
        redirect: '/dashboard',
    },

    {path: '/login', name: 'Login', component: Login},

    {
        path: '/dashboard',
        component: Dashboard,
        meta: {requiresAuth: true}, // tất cả màn trong dashboard yêu cầu login
        children: [
            {
                path: '',
                name: 'DashboardHome',
                component: () => import('@/views/dashboard/DashboardHome.vue'),
            },
            {
                path: 'users',
                name: 'UserList',
                component: UserList,
            },
            {
                path: 'products', // /dashboard/products
                name: 'ProductList',
                component: ProductList,
            },
            {
                path: 'invoices', // /dashboard/invoices
                name: 'InvoiceList',
                component: InvoiceList,
            },
        ],
    },

    {path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword},
    {path: '/reset-password', name: 'ResetPassword', component: ResetPassword},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')

    // Cách 1: dùng matched để check meta (rõ ràng nhất)
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !token) {
        // chưa có token → bắt login
        next({name: 'Login'})
    } else if (to.name === 'Login' && token) {
        // đã login mà vào login → đẩy về dashboard
        next({name: 'DashboardHome'})
    } else {
        next()
    }
})

export default router
