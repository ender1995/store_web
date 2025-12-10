<template>
    <div class="content-wrapper p-3">
        <section class="content">
            <div class="container-fluid">

                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="card-title mb-0">Quản lý người dùng</h3>

                        <button
                            v-if="isAdmin"
                            class="btn btn-primary btn-sm"
                            @click="openCreateForm"
                        >
                            <i class="fas fa-user-plus mr-1"></i> Thêm người dùng
                        </button>
                    </div>

                    <div class="card-body">

                        <!-- Bộ lọc -->
                        <div class="row mb-3">
                            <div class="col-md-4 mb-2">
                                <input
                                    v-model="searchKeyword"
                                    type="text"
                                    class="form-control"
                                    placeholder="Tìm theo tên hoặc email..."
                                    @keyup.enter="applyFilters"
                                />
                            </div>

                            <div class="col-md-3 mb-2">
                                <select v-model="roleFilter" class="form-control" @change="applyFilters">
                                    <option value="">Tất cả vai trò</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Quản lý</option>
                                    <option value="CASHIER">Thu ngân</option>
                                    <option value="EMPLOYEE">Nhân viên</option>
                                </select>
                            </div>

                            <div class="col-md-3 mb-2">
                                <select v-model="statusFilter" class="form-control" @change="applyFilters">
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="BLOCKED">Đã khóa</option>
                                </select>
                            </div>

                            <div class="col-md-2 mb-2 text-right">
                                <button class="btn btn-primary btn-sm mr-1" @click="applyFilters">
                                    <i class="fas fa-search mr-1"></i> Lọc
                                </button>
                                <button class="btn btn-default btn-sm" @click="resetFilters">
                                    <i class="fas fa-undo mr-1"></i> Reset
                                </button>
                            </div>
                        </div>

                        <!-- Thông báo lỗi -->
                        <div v-if="errorMessage" class="alert alert-danger py-2">
                            {{ errorMessage }}
                        </div>

                        <!-- Bảng dữ liệu -->
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover table-sm mb-0">
                                <thead class="thead-light">
                                <tr>
                                    <th style="width: 60px;">#</th>

                                    <th @click="changeSort('fullName')" class="sortable">
                                        Tên
                                        <SortIcon
                                            field="fullName"
                                            :sort-field="sortField"
                                            :direction="sortDirection"
                                        />
                                    </th>

                                    <th @click="changeSort('email')" class="sortable">
                                        Email
                                        <SortIcon
                                            field="email"
                                            :sort-field="sortField"
                                            :direction="sortDirection"
                                        />
                                    </th>

                                    <th style="width: 140px;">Vai trò</th>

                                    <th
                                        style="width: 150px;"
                                        @click="changeSort('createdAt')"
                                        class="sortable"
                                    >
                                        Ngày tạo
                                        <SortIcon
                                            field="createdAt"
                                            :sort-field="sortField"
                                            :direction="sortDirection"
                                        />
                                    </th>

                                    <th style="width: 110px;">Trạng thái</th>
                                    <th style="width: 210px;">Hành động</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr v-if="loading">
                                    <td colspan="7" class="text-center">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>

                                <tr v-for="(user, index) in users" :key="user.id">
                                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                                    <td>{{ user.fullName }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>
                      <span
                          v-for="role in user.roles"
                          :key="role"
                          class="badge badge-info mr-1"
                      >
                        {{ role }}
                      </span>
                                    </td>
                                    <td>{{ formatDate(user.createdAt) }}</td>
                                    <td>
                      <span
                          class="badge"
                          :class="user.active ? 'badge-success' : 'badge-secondary'"
                      >
                        {{ user.active ? 'Hoạt động' : 'Đã khóa' }}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            class="btn btn-xs btn-outline-primary mr-1"
                                            @click="openEditForm(user)"
                                        >
                                            <i class="fas fa-edit"></i> Sửa
                                        </button>

                                        <button
                                            class="btn btn-xs"
                                            :class="user.active ? 'btn-outline-warning' : 'btn-outline-success'"
                                            @click="toggleBlock(user)"
                                        >
                                            <i :class="user.active ? 'fas fa-ban' : 'fas fa-unlock'"></i>
                                            {{ user.active ? 'Khóa' : 'Mở khóa' }}
                                        </button>

                                        <button
                                            v-if="isAdmin"
                                            class="btn btn-xs btn-outline-danger ml-1"
                                            @click="deleteUser(user)"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="!loading && users.length === 0">
                                    <td colspan="7" class="text-center">
                                        Không có người dùng nào.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card-footer">
                        <BasePagination
                            :current-page="currentPage"
                            :page-size="pageSize"
                            :total-items="totalItems"
                            @update:currentPage="onPageChange"
                        />
                    </div>
                </div>

                <!-- Modal form -->
                <UserFormModal
                    :visible="showForm"
                    :mode="formMode"
                    :user="editingUser"
                    @close="closeForm"
                    @save="handleSaveUser"
                />
            </div>
        </section>
    </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import BasePagination from '@/components/common/BasePagination.vue'
import UserFormModal from '@/components/users/UserFormModal.vue'

// Component nhỏ hiển thị icon sort
const SortIcon = {
    props: {
        field: String,
        sortField: String,
        direction: String,
    },
    template: `
        <span v-if="sortField === field">
      <i v-if="direction === 'asc'" class="fas fa-sort-up ml-1"></i>
      <i v-else class="fas fa-sort-down ml-1"></i>
    </span>
        <span v-else>
      <i class="fas fa-sort ml-1 text-muted"></i>
    </span>
    `,
}

const users = ref([])
const loading = ref(false)
const errorMessage = ref('')

const searchKeyword = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// sort server-side
const sortField = ref('createdAt')
const sortDirection = ref('desc')

// phân trang
const currentPage = ref(1) // 1-based cho UI
const pageSize = ref(10)
const totalItems = ref(0)

// modal
const showForm = ref(false)
const formMode = ref('create') // 'create' | 'edit'
const editingUser = ref(null)

const isAdmin = ref(false)

// ================== ROLE HIỆN TẠI ==================

const initRoles = () => {
    try {
        const raw = localStorage.getItem('roles')
        const arr = raw ? JSON.parse(raw) : []
        isAdmin.value = Array.isArray(arr) && arr.includes('ADMIN')
    } catch (e) {
        console.error('Cannot parse roles', e)
        isAdmin.value = false
    }
}

// ================== API BASE ==================

const API_BASE = 'http://localhost:8080/api/users' // đổi theo config của bạn

// ================== FETCH USERS (PAGE + FILTER + SORT) ==================

const buildQueryParams = () => {
    const params = new URLSearchParams()
    params.append('page', String(currentPage.value - 1)) // backend 0-based
    params.append('size', String(pageSize.value))
    params.append('sort', `${sortField.value},${sortDirection.value}`)

    if (searchKeyword.value) params.append('keyword', searchKeyword.value)
    if (roleFilter.value) params.append('role', roleFilter.value)
    if (statusFilter.value) params.append('status', statusFilter.value)

    return params.toString()
}

const fetchUsers = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const token = localStorage.getItem('access_token')
        const query = buildQueryParams()

        const res = await fetch(`${API_BASE}?${query}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        })

        if (!res.ok) {
            throw new Error('Không thể tải danh sách người dùng')
        }

        const json = await res.json()

        // TH1: Page của Spring Data
        if (Array.isArray(json.content)) {
            users.value = json.content
            totalItems.value = json.totalElements ?? json.content.length
        }
        // TH2: bạn bọc trong data: { code, data: { content, totalElements } }
        else if (json.data && Array.isArray(json.data.content)) {
            users.value = json.data.content
            totalItems.value = json.data.totalElements ?? json.data.content.length
        }
        // Fallback các TH khác
        else if (Array.isArray(json.data)) {
            users.value = json.data
            totalItems.value = json.data.length
        } else if (Array.isArray(json)) {
            users.value = json
            totalItems.value = json.length
        } else {
            users.value = []
            totalItems.value = 0
        }
    } catch (e) {
        console.error(e)
        errorMessage.value = e.message || 'Lỗi tải dữ liệu'
    } finally {
        loading.value = false
    }
}

const onPageChange = (page) => {
    currentPage.value = page
    fetchUsers()
}

const changeSort = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
    currentPage.value = 1
    fetchUsers()
}

const applyFilters = () => {
    currentPage.value = 1
    fetchUsers()
}

const resetFilters = () => {
    searchKeyword.value = ''
    roleFilter.value = ''
    statusFilter.value = ''
    currentPage.value = 1
    fetchUsers()
}

// ================== CRUD & BLOCK ==================

const handleSaveUser = async (payload) => {
    if (formMode.value === 'create') {
        await createUser(payload)
    } else {
        await updateUser(payload)
    }
    closeForm()
}

const createUser = async (payload) => {
    try {
        const token = localStorage.getItem('access_token')

        const body = {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            role: payload.role,
            active: payload.active,
        }

        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            throw new Error('Không thể tạo người dùng')
        }

        currentPage.value = 1
        await fetchUsers()
    } catch (e) {
        console.error(e)
        alert(e.message || 'Lỗi tạo người dùng')
    }
}

const updateUser = async (payload) => {
    try {
        const token = localStorage.getItem('access_token')

        const body = {
            fullName: payload.fullName,
            email: payload.email,
            role: payload.role,
            active: payload.active,
        }

        // chỉ gửi password nếu có nhập (muốn đổi)
        if (payload.password) {
            body.password = payload.password
        }

        const url = `${API_BASE}/${editingUser.value.id}`
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            throw new Error('Không thể cập nhật người dùng')
        }

        await fetchUsers()
    } catch (e) {
        console.error(e)
        alert(e.message || 'Lỗi cập nhật người dùng')
    }
}

const toggleBlock = async (user) => {
    const confirmText = user.active
        ? `Khóa tài khoản của "${user.fullName}"?`
        : `Mở khóa tài khoản của "${user.fullName}"?`
    if (!confirm(confirmText)) return

    try {
        const token = localStorage.getItem('access_token')
        const url = `${API_BASE}/${user.id}/block` // chỉnh endpoint theo backend
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({active: !user.active}),
        })

        if (!res.ok) {
            throw new Error('Không thể cập nhật trạng thái người dùng')
        }

        await fetchUsers()
    } catch (e) {
        console.error(e)
        alert(e.message || 'Lỗi cập nhật trạng thái')
    }
}

const deleteUser = async (user) => {
    if (!isAdmin.value) {
        alert('Chỉ Admin mới được xóa người dùng')
        return
    }
    if (!confirm(`Bạn chắc chắn muốn xóa "${user.fullName}"?`)) return

    try {
        const token = localStorage.getItem('access_token')
        const url = `${API_BASE}/${user.id}`
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        })

        if (!res.ok) {
            throw new Error('Không thể xóa người dùng')
        }

        if (users.value.length === 1 && currentPage.value > 1) {
            currentPage.value -= 1
        }
        await fetchUsers()
    } catch (e) {
        console.error(e)
        alert(e.message || 'Lỗi xóa người dùng')
    }
}

// ================== FORM CONTROL ==================

const openCreateForm = () => {
    formMode.value = 'create'
    editingUser.value = null
    showForm.value = true
}

const openEditForm = (user) => {
    formMode.value = 'edit'
    editingUser.value = {...user}
    showForm.value = true
}

const closeForm = () => {
    showForm.value = false
}

const formatDate = (value) => {
    if (!value) return ''
    const d = new Date(value)
    return d.toLocaleDateString('vi-VN')
}

// ================== INIT ==================

onMounted(() => {
    initRoles()
    fetchUsers()
})
</script>

<style scoped>
.content-wrapper {
    background-color: #f4f6f9;
}

/* clickable sort header */
.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable:hover {
    background-color: #f3f4f6;
}
</style>
