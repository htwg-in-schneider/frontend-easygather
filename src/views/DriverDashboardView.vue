<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchAssignedDeliveries, updateDeliveryStatus } from '@/api/backend.js'
import { useUserProfile } from '@/composables/useUserProfile.js'
import Button from '@/components/Button.vue'
import DeliveryFilterPanel from '@/components/DeliveryFilterPanel.vue'

const STATUS_OPTIONS = [
  { value: 'OFFEN', label: 'offen' },
  { value: 'UNTERWEGS', label: 'unterwegs' },
  { value: 'GELIEFERT', label: 'geliefert' },
]

const STATUS_SORT_ORDER = {
  OFFEN: 0,
  UNTERWEGS: 1,
  GELIEFERT: 2,
}

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { isFahrer, refreshProfile } = useUserProfile()

const deliveries = ref([])
const loading = ref(true)
const error = ref(null)
const savingOrderId = ref(null)
const filterOpen = ref(false)
const selectedStatus = ref('')
const appliedStatus = ref('')

const activeStatusLabel = computed(() => {
  if (!appliedStatus.value) {
    return ''
  }
  return STATUS_OPTIONS.find((option) => option.value === appliedStatus.value)?.label ?? ''
})

const displayedDeliveries = computed(() => {
  const filtered = appliedStatus.value
    ? deliveries.value.filter((order) => order.status === appliedStatus.value)
    : deliveries.value

  return [...filtered].sort((a, b) => {
    const statusDiff = (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99)
    if (statusDiff !== 0) {
      return statusDiff
    }
    return a.orderNumber.localeCompare(b.orderNumber)
  })
})

onMounted(async () => {
  await refreshProfile()
  if (!isFahrer.value) {
    router.replace('/')
    return
  }
  await loadDeliveries()
})

async function loadDeliveries() {
  loading.value = true
  error.value = null
  try {
    const token = await getAccessTokenSilently()
    deliveries.value = await fetchAssignedDeliveries(token)
  } catch (err) {
    console.error('Error loading deliveries:', err)
    error.value = 'Lieferaufträge konnten nicht geladen werden.'
    deliveries.value = []
  } finally {
    loading.value = false
  }
}

function statusClass(status) {
  return status === 'GELIEFERT' ? 'order-status-select status-delivered' : 'order-status-select'
}

function toggleFilter() {
  filterOpen.value = !filterOpen.value
}

function closeFilter() {
  filterOpen.value = false
}

function applyFilters() {
  appliedStatus.value = selectedStatus.value
  filterOpen.value = false
}

function resetFilters() {
  selectedStatus.value = ''
  appliedStatus.value = ''
  filterOpen.value = false
}

async function onStatusChange(order, event) {
  const newStatus = event.target.value
  if (newStatus === order.status) {
    return
  }
  savingOrderId.value = order.id
  try {
    const token = await getAccessTokenSilently()
    const updated = await updateDeliveryStatus(order.id, newStatus, token)
    order.status = updated.status
  } catch (err) {
    console.error('Error updating delivery status:', err)
    alert('Status konnte nicht gespeichert werden.')
    event.target.value = order.status
  } finally {
    savingOrderId.value = null
  }
}
</script>

<template>
  <section class="driver-dashboard">
    <div class="shop-section-header">
      <div class="shop-section-intro">
        <p class="eyebrow">Fahrer-Dashboard</p>
        <h1>Deine zugewiesenen Lieferaufträge</h1>
        <p class="section-text">
          Hier siehst du alle Lieferungen mit Adresse, Inhalt und aktuellem Bestellstatus.
        </p>
        <p v-if="activeStatusLabel" class="shop-active-filter">
          Status: <strong>{{ activeStatusLabel }}</strong>
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        class="basket-filter-toggle"
        :aria-expanded="filterOpen"
        @click="toggleFilter"
      >
        Filter
      </Button>
    </div>

    <DeliveryFilterPanel
      v-model:status="selectedStatus"
      :open="filterOpen"
      :status-options="STATUS_OPTIONS"
      @apply="applyFilters"
      @reset="resetFilters"
      @close="closeFilter"
    />

    <p v-if="loading" class="section-text">Lieferaufträge werden geladen …</p>
    <p v-else-if="error" class="section-text">{{ error }}</p>
    <p v-else-if="deliveries.length === 0" class="section-text">Keine Lieferaufträge zugewiesen.</p>
    <p v-else-if="displayedDeliveries.length === 0" class="section-text">
      Keine Lieferaufträge für diesen Filter gefunden.
    </p>

    <div v-else class="driver-order-grid">
      <article v-for="order in displayedDeliveries" :key="order.id" class="card driver-order-card">
        <div class="driver-order-content">
          <h3>Auftrag {{ order.orderNumber }}</h3>
          <p><strong>Adresse:</strong> {{ order.deliveryAddress }}</p>
          <p><strong>Inhalt:</strong> {{ order.contentSummary }}</p>
          <div class="driver-order-meta">
            <span>Status</span>
            <select
              :class="statusClass(order.status)"
              :value="order.status"
              :disabled="savingOrderId === order.id"
              aria-label="Lieferstatus ändern"
              @change="onStatusChange(order, $event)"
            >
              <option v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
