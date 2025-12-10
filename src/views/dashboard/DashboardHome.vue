<template>
    <div class="dashboard-home">
        <!-- Hàng card thống kê -->
        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-label">Doanh thu hôm nay</div>
                <div class="stat-value">12.500.000₫</div>
                <div class="stat-sub">+15% so với hôm qua</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Đơn hàng hôm nay</div>
                <div class="stat-value">37</div>
                <div class="stat-sub">+5 đơn</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Sản phẩm sắp hết hàng</div>
                <div class="stat-value">8</div>
                <div class="stat-sub">Cần nhập thêm</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Khách hàng mới</div>
                <div class="stat-value">4</div>
                <div class="stat-sub">Trong 24h qua</div>
            </div>
        </div>

        <!-- Bảng đơn hàng gần đây -->
        <div class="panel">
            <div class="panel-header">
                <h2>Đơn hàng gần đây</h2>
                <button class="btn-link">Xem tất cả</button>
            </div>

            <table class="table">
                <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Khách hàng</th>
                    <th>Thời gian</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="invoice in recentInvoices" :key="invoice.id">
                    <td>{{ invoice.code }}</td>
                    <td>{{ invoice.customer }}</td>
                    <td>{{ invoice.time }}</td>
                    <td>{{ formatCurrency(invoice.total) }}</td>
                    <td>
              <span class="badge" :class="`badge--${invoice.status}`">
                {{ statusText(invoice.status) }}
              </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const recentInvoices = [
    {
        id: 1,
        code: 'HD240001',
        customer: 'Nguyễn Văn A',
        time: '10:25 - 10/12/2025',
        total: 1250000,
        status: 'paid',
    },
    {
        id: 2,
        code: 'HD240002',
        customer: 'Trần Thị B',
        time: '11:12 - 10/12/2025',
        total: 356000,
        status: 'pending',
    },
    {
        id: 3,
        code: 'HD240003',
        customer: 'Khách lẻ',
        time: '11:45 - 10/12/2025',
        total: 890000,
        status: 'cancelled',
    },
]

const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
        value
    )

const statusText = (status) => {
    switch (status) {
        case 'paid':
            return 'Đã thanh toán'
        case 'pending':
            return 'Chờ thanh toán'
        case 'cancelled':
            return 'Đã hủy'
        default:
            return status
    }
}
</script>

<style scoped>
.dashboard-home {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Stats cards */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
}

.stat-card {
    background: #ffffff;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.stat-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 6px;
}

.stat-value {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
}

.stat-sub {
    font-size: 12px;
    color: #10b981;
}

/* Panel */
.panel {
    background: #ffffff;
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.panel-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.btn-link {
    background: transparent;
    border: none;
    color: #2563eb;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 0;
}

.btn-link:hover {
    text-decoration: underline;
}

/* Table */
.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.table thead {
    background: #f9fafb;
}

.table th,
.table td {
    padding: 10px 8px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.table th {
    font-weight: 500;
    color: #6b7280;
}

/* Badge trạng thái */
.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
}

.badge--paid {
    background: #dcfce7;
    color: #15803d;
}

.badge--pending {
    background: #fef3c7;
    color: #92400e;
}

.badge--cancelled {
    background: #fee2e2;
    color: #b91c1c;
}

/* Responsive */
@media (max-width: 1024px) {
    .stats-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .stats-row {
        grid-template-columns: 1fr;
    }
}
</style>
