<template>
    <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="text-muted small">
            Hiển thị
            <strong>{{ startItem }}–{{ endItem }}</strong>
            / {{ totalItems }} bản ghi
        </div>

        <ul class="pagination pagination-sm m-0">
            <li class="page-item"
                :class="{ disabled: currentPageInternal === 1 }"
                @click="goToPage(currentPageInternal - 1)">
                <a class="page-link" href="javascript:void(0)">&laquo;</a>
            </li>

            <li v-for="page in pages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPageInternal }"
                @click="goToPage(page)">
                <a class="page-link" href="javascript:void(0)">{{ page }}</a>
            </li>

            <li class="page-item"
                :class="{ disabled: currentPageInternal === totalPages }"
                @click="goToPage(currentPageInternal + 1)">
                <a class="page-link" href="javascript:void(0)">&raquo;</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue'

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    maxButtons: {
        type: Number,
        default: 5,
    },
})

const emit = defineEmits(['update:currentPage'])

const currentPageInternal = ref(props.currentPage)

watch(
    () => props.currentPage,
    (val) => {
        currentPageInternal.value = val || 1
    },
)

const totalPages = computed(() =>
    props.totalItems === 0 ? 1 : Math.ceil(props.totalItems / props.pageSize),
)

const pages = computed(() => {
    const pages = []
    const total = totalPages.value
    const max = props.maxButtons
    let start = Math.max(1, currentPageInternal.value - Math.floor(max / 2))
    let end = start + max - 1

    if (end > total) {
        end = total
        start = Math.max(1, end - max + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const startItem = computed(() =>
    props.totalItems === 0 ? 0 : (currentPageInternal.value - 1) * props.pageSize + 1,
)
const endItem = computed(() =>
    Math.min(currentPageInternal.value * props.pageSize, props.totalItems),
)

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value || page === currentPageInternal.value) return
    currentPageInternal.value = page
    emit('update:currentPage', page)
}
</script>
