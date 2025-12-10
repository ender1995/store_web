<template>
    <div class="dashboard-layout">
        <!-- Sidebar trái -->
        <Sidebar/>

        <!-- Nội dung phải -->
        <div class="dashboard-main">
            <!-- Header trên -->
            <header class="dashboard-header">
                <h1 class="dashboard-title">Bảng điều khiển</h1>

                <div class="dashboard-user">
                    <span class="dashboard-user__name">Xin chào, Admin</span>
                    <!-- chỗ này bạn có thể thêm avatar / dropdown logout -->
                    <button class="btn-logout" @click="logout">
                        Đăng xuất
                    </button>
                </div>
            </header>

            <!-- Nội dung chính -->
            <section class="dashboard-content">
                <!-- Nếu Dashboard.vue là layout, bạn có thể dùng router-view bên trong -->
                <router-view/>

                <!-- Hoặc nếu đây là màn dashboard thực sự, để các card thống kê ở đây -->
                <!--
                <div class="cards">
                  ...
                </div>
                -->
            </section>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const logout = () => {
    // Xoá token + quyền
    localStorage.removeItem('access_token')
    localStorage.removeItem('roles')
    localStorage.removeItem('scope')

    // tuỳ bạn muốn giữ hay xoá thông tin remember
    // localStorage.removeItem('remember_user')
    // localStorage.removeItem('remember_pwd')

    // Điều hướng về login
    router.push({name: 'Login'})
}
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background: #f3f4f6;
}

.dashboard-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.dashboard-header {
    height: 64px;
    padding: 0 24px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.dashboard-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
}

.dashboard-user {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dashboard-user__name {
    font-size: 14px;
    color: #4b5563;
}

.dashboard-content {
    padding: 20px 24px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
}
</style>
