<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchAdminOrders } from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { formatEuro, orderStatusLabel, paymentMethodLabel, displayOrderNumber } from '@/utils/orderFormat.js'
import { formatDateTime } from '@/utils/dateFormat.js'
import { notifyError } from '@/composables/useNotification.js'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const route = useRoute()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  if (typeof route.query.q === 'string') {
    searchQuery.value = route.query.q
  }
  await loadOrders()
})

async function loadOrders() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    orders.value = await fetchAdminOrders(token, searchQuery.value)
  } catch (err) {
    console.error('Could not load admin orders:', err)
    notifyError('Bestellungen konnten nicht geladen werden.')
  } finally {
    loading.value = false
  }
}

function onSearchSubmit() {
  loadOrders()
}

function customerName(order) {
  return [order.customerFirstName, order.customerLastName].filter(Boolean).join(' ') || 'Unbekannt'
}

function openOrder(id) {
  router.push(`/admin/orders/${id}`)
}
</script>

<template>
  <section class="admin-page checkout-flow">
    <header class="admin-header checkout-flow-header">
      <NavButton to="/admin" variant="secondary" class="admin-back">← Administration</NavButton>
      <h2>Bestellungen</h2>
      <p class="section-text">Alle Kundenbestellungen einsehen und Details aufrufen.</p>
    </header>

    <form class="admin-toolbar admin-search" role="search" @submit.prevent="onSearchSubmit">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Nach Bestellnr., Kunde, E-Mail oder Status suchen …"
        aria-label="Bestellungen suchen"
      />
      <Button type="submit" variant="secondary">Suchen</Button>
    </form>

    <p v-if="loading" class="section-text">Bestellungen werden geladen …</p>

    <div v-else-if="!orders.length" class="checkout-empty card">
      <p class="checkout-empty-title">Keine Bestellungen gefunden</p>
    </div>

    <ul v-else class="orders-list">
      <li v-for="order in orders" :key="order.id">
        <button type="button" class="order-card card" @click="openOrder(order.id)">
          <div class="order-card-main">
            <strong>Bestellung {{ displayOrderNumber(order) }}</strong>
            <span>{{ formatDateTime(order.createdAt) }}</span>
          </div>
          <div class="order-card-meta">
            <span>{{ customerName(order) }}</span>
            <span>{{ order.customerEmail }}</span>
          </div>
          <div class="order-card-footer">
            <span>{{ orderStatusLabel(order.status) }} · {{ paymentMethodLabel(order.paymentMethod) }}</span>
            <strong>{{ formatEuro(order.total) }}</strong>
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.admin-header {
  margin-bottom: 1rem;
}

.admin-back {
  margin-bottom: 0.65rem;
}

.admin-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.admin-search input {
  flex: 1 1 14rem;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(31, 45, 36, 0.18);
  border-radius: 0.5rem;
  font: inherit;
}

.orders-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.order-card {
  width: 100%;
  text-align: left;
  padding: 1rem;
  display: grid;
  gap: 0.45rem;
  cursor: pointer;
  border: 1px solid rgba(61, 107, 79, 0.15);
  background: #fff;
  font: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.order-card:hover {
  border-color: rgba(61, 107, 79, 0.35);
  box-shadow: 0 2px 8px rgba(31, 45, 36, 0.06);
}

.order-card-main,
.order-card-meta,
.order-card-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.order-card-meta {
  color: var(--muted);
  font-size: 0.92rem;
}

.order-card-footer strong {
  color: var(--terracotta);
}
</style>
