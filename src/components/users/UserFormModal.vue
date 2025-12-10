<template>
    <div
        v-if="visible"
        class="modal fade show"
        style="display: block; background: rgba(0,0,0,0.4);"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="onSubmit">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ mode === 'create' ? 'Thêm người dùng' : 'Cập nhật người dùng' }}
                        </h5>
                        <button type="button" class="close" @click="emitClose">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label>Họ tên</label>
                            <input v-model="localForm.fullName" type="text" class="form-control" required/>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input v-model="localForm.email" type="email" class="form-control" required/>
                        </div>

                        <div class="form-group" v-if="mode === 'create'">
                            <label>Mật khẩu</label>
                            <input v-model="localForm.password" type="password" class="form-control" required/>
                        </div>

                        <div class="form-group" v-else>
                            <label>Mật khẩu (để trống nếu không đổi)</label>
                            <input v-model="localForm.password" type="password" class="form-control"/>
                        </div>

                        <div class="form-group">
                            <label>Vai trò</label>
                            <select v-model="localForm.role" class="form-control" required>
                                <option disabled value="">-- Chọn vai trò --</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Quản lý</option>
                                <option value="CASHIER">Thu ngân</option>
                                <option value="EMPLOYEE">Nhân viên</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <div class="form-check">
                                <input
                                    id="active"
                                    v-model="localForm.active"
                                    type="checkbox"
                                    class="form-check-input"
                                />
                                <label class="form-check-label" for="active">
                                    Hoạt động
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="emitClose">
                            Hủy
                        </button>
                        <button type="submit" class="btn btn-primary">
                            {{ mode === 'create' ? 'Lưu mới' : 'Cập nhật' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: 'create', // 'create' | 'edit'
    },
    // dữ liệu người dùng đang edit; create thì null
    user: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['close', 'save'])

const localForm = ref({
    fullName: '',
    email: '',
    password: '',
    role: '',
    active: true,
})

watch(
    () => props.user,
    (val) => {
        if (val) {
            localForm.value = {
                fullName: val.fullName || '',
                email: val.email || '',
                password: '',
                role: Array.isArray(val.roles) && val.roles.length > 0 ? val.roles[0] : '',
                active: val.active !== undefined ? val.active : true,
            }
        } else {
            localForm.value = {
                fullName: '',
                email: '',
                password: '',
                role: '',
                active: true,
            }
        }
    },
    {immediate: true},
)

const emitClose = () => {
    emit('close')
}

const onSubmit = () => {
    emit('save', {...localForm.value})
}
</script>
