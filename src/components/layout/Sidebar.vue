<template>
    <aside class="sidebar">
        <div class="sidebar__logo">
            <span class="sidebar__logo-main">EDR Store</span>
            <span class="sidebar__logo-sub">Quản lý bán hàng</span>
        </div>

        <nav class="sidebar__menu">
            <router-link
                v-for="item in menus"
                :key="item.name"
                :to="item.to"
                class="sidebar__item"
                :class="{ 'sidebar__item--active': isActive(item) }"
            >
        <span class="sidebar__icon">
          <!-- Chỗ này nếu bạn dùng icon lib thì nhét vào -->
          {{ item.icon }}
        </span>
                <span class="sidebar__text">{{ item.label }}</span>
            </router-link>
        </nav>
    </aside>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const userRoles = ref([])

onMounted(() => {
    try {
        const raw = localStorage.getItem('scope')
        userRoles.value = raw ? JSON.parse(raw) : []
    } catch (e) {
        console.error('Cannot parse roles from localStorage', e)
        userRoles.value = []
    }
})

// Khai báo menu
const allMenus = [
    {
        name: 'DashboardHome',
        label: 'Tổng quan',
        to: '/dashboard',
        icon: '🏠',
        roles: ['ADMIN', 'MANAGER', 'CASHIER', 'EMPLOYEE'],
    },
    {
        name: 'ProductList',
        label: 'Sản phẩm',
        to: '/dashboard/products',
        icon: '📦',
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    },
    {
        name: 'InvoiceList',
        label: 'Hóa đơn',
        to: '/dashboard/invoices',
        icon: '🧾',
        roles: ['ADMIN', 'MANAGER', 'CASHIER'],
    },
    {
        name: 'UserList',
        label: 'Người dùng',
        to: '/dashboard/users',
        icon: '👥',
        roles: ['ADMIN', 'MANAGER'],
    },
]

// **Hàm check role – bản không dùng TypeScript**
const hasRole = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    if (!userRoles.value || userRoles.value.length === 0) return false
    return userRoles.value.some((r) => allowedRoles.includes(r))
}

const menus = computed(() => allMenus.filter((m) => hasRole(m.roles)))

const isActive = (item) => {
    if (item.name && route.name === item.name) return true
    return route.path === item.to || route.path.startsWith(item.to + '/')
}
</script>


<style scoped>
.sidebar {
    width: 240px;
    height: 100vh;
    background: #111827;
    color: #e5e7eb;
    display: flex;
    flex-direction: column;
    padding: 16px 12px;
    box-sizing: border-box;
}

.sidebar__logo {
    padding: 12px 10px 20px;
    border-bottom: 1px solid rgba(156, 163, 175, 0.3);
    margin-bottom: 16px;
}

.sidebar__logo-main {
    display: block;
    font-size: 18px;
    font-weight: 700;
}

.sidebar__logo-sub {
    display: block;
    font-size: 12px;
    color: #9ca3af;
}

.sidebar__menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
}

.sidebar__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    font-size: 14px;
    transition: background 0.15s, color 0.15s, transform 0.1s;
}

.sidebar__item:hover {
    background: rgba(55, 65, 81, 0.9);
    transform: translateX(2px);
}

.sidebar__item--active {
    background: #2563eb;
    color: #f9fafb;
}

.sidebar__icon {
    width: 20px;
    text-align: center;
}

.sidebar__text {
    flex: 1;
}
</style>
