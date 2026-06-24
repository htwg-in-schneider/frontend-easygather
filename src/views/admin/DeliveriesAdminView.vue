<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  assignDeliveryDriver,
  fetchAdminDeliveries,
  fetchUsers,
  unassignDeliveryDriver,
} from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { deliveryStatusLabel, displayOrderNumber } from '@/utils/orderFormat.js'
import { formatDateTime } from '@/utils/dateFormat.js'
import { notifyError, notifySuccess } from '@/composables/useNotification.js'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const route = useRoute()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const deliveries = ref([])
const drivers = ref([])
const loading = ref(true)
const searchQuery = ref('')
const savingId = ref(null)
const selectedDriverByDelivery = ref({})

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  if (typeof route.query.q === 'string') {
    searchQuery.value = route.query.q
  }
  await Promise.all([loadDeliveries(), loadDrivers()])
})

async function loadDrivers() {
  try {
    const token = await getAccessTokenSilently()
    drivers.value = await fetchUsers(token, '', 'FAHRER')
  } catch (err) {
    console.error('Could not load drivers:', err)
    notifyError('Fahrer konnten nicht geladen werden.')
  }
}

async function loadDeliveries() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    deliveries.value = await fetchAdminDeliveries(token, searchQuery.value)
    for (const delivery of deliveries.value) {
      if (delivery.driverId) {
        selectedDriverByDelivery.value[delivery.id] = delivery.driverId
      }
    }
  } catch (err) {
    console.error('Could not load deliveries:', err)
    notifyError('Lieferaufträge konnten nicht geladen werden.')
  } finally {
    loading.value = false
  }
}

function onSearchSubmit() {
  loadDeliveries()
}

function driverName(delivery) {
  const name = [delivery.driverFirstName, delivery.driverLastName].filter(Boolean).join(' ')
  return name || 'Nicht zugewiesen'
}

function driverLabel(driver) {
  return [driver.firstName, driver.lastName].filter(Boolean).join(' ') || driver.email
}

function canAssign(delivery) {
  return delivery.status !== 'GELIEFERT'
}

function canUnassign(delivery) {
  return delivery.driverId && delivery.status !== 'GELIEFERT' && delivery.status !== 'UNTERWEGS'
}

async function onAssign(delivery) {
  const driverId = selectedDriverByDelivery.value[delivery.id]
  if (!driverId) {
    notifyError('Bitte einen Fahrer auswählen.')
    return
  }
  savingId.value = delivery.id
  try {
    const token = await getAccessTokenSilently()
    const updated = await assignDeliveryDriver(delivery.id, driverId, token)
    replaceDelivery(updated)
    notifySuccess('Fahrer zugewiesen.')
  } catch (err) {
    console.error('Could not assign driver:', err)
    notifyError('Fahrer konnte nicht zugewiesen werden.')
  } finally {
    savingId.value = null
  }
}

async function onUnassign(delivery) {
  savingId.value = delivery.id
  try {
    const token = await getAccessTokenSilently()
    const updated = await unassignDeliveryDriver(delivery.id, token)
    replaceDelivery(updated)
    selectedDriverByDelivery.value[delivery.id] = ''
    notifySuccess('Zuweisung aufgehoben.')
  } catch (err) {
    console.error('Could not unassign driver:', err)
    notifyError('Zuweisung konnte nicht aufgehoben werden.')
  } finally {
    savingId.value = null
  }
}

function replaceDelivery(updated) {
  const index = deliveries.value.findIndex((item) => item.id === updated.id)
  if (index >= 0) {
    deliveries.value[index] = updated
  }
  if (updated.driverId) {
    selectedDriverByDelivery.value[updated.id] = updated.driverId
  }
}

function openOrder(orderId) {
  if (orderId) {
    router.push(`/admin/orders/${orderId}`)
  }
}
</script>

<template>
  <section class="admin-page checkout-flow">
    <header class="admin-header checkout-flow-header">
      <NavButton to="/admin" variant="secondary" class="admin-back">← Administration</NavButton>
      <h2>Lieferaufträge</h2>
      <p class="section-text">Lieferaufträge einsehen und Fahrern zuweisen.</p>
    </header>

    <form class="admin-toolbar admin-search" role="search" @submit.prevent="onSearchSubmit">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Nach Bestellnr., Adresse, Fahrer oder Status suchen …"
        aria-label="Lieferaufträge suchen"
      />
      <Button type="submit" variant="secondary">Suchen</Button>
    </form>

    <p v-if="loading" class="section-text">Lieferaufträge werden geladen …</p>

    <div v-else-if="!deliveries.length" class="checkout-empty card">
      <p class="checkout-empty-title">Keine Lieferaufträge gefunden</p>
    </div>

    <ul v-else class="delivery-list">
      <li v-for="delivery in deliveries" :key="delivery.id">
        <article class="delivery-card card">
          <div class="delivery-card-head">
            <div>
              <strong>{{ displayOrderNumber(delivery) }}</strong>
              <span class="delivery-date">{{ formatDateTime(delivery.orderCreatedAt) }}</span>
            </div>
            <span class="delivery-status">{{ deliveryStatusLabel(delivery.status) }}</span>
          </div>

          <p class="delivery-address">{{ delivery.deliveryAddress }}</p>
          <p class="delivery-content">{{ delivery.contentSummary }}</p>

          <div class="delivery-driver-row">
            <span class="delivery-driver-label">Fahrer:</span>
            <strong>{{ driverName(delivery) }}</strong>
            <span v-if="delivery.driverEmail" class="delivery-driver-email">{{ delivery.driverEmail }}</span>
          </div>

          <div v-if="canAssign(delivery)" class="delivery-actions">
            <select
              v-model="selectedDriverByDelivery[delivery.id]"
              class="driver-select"
              :aria-label="`Fahrer für ${displayOrderNumber(delivery)}`"
            >
              <option value="">Fahrer wählen …</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                {{ driverLabel(driver) }}
              </option>
            </select>
            <Button
              type="button"
              variant="primary"
              :disabled="savingId === delivery.id"
              @click="onAssign(delivery)"
            >
              Zuweisen
            </Button>
            <Button
              v-if="canUnassign(delivery)"
              type="button"
              variant="secondary"
              :disabled="savingId === delivery.id"
              @click="onUnassign(delivery)"
            >
              Zuweisung aufheben
            </Button>
          </div>

          <div class="delivery-footer">
            <Button
              v-if="delivery.orderId"
              type="button"
              variant="secondary"
              @click="openOrder(delivery.orderId)"
            >
              Bestellung anzeigen
            </Button>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 52rem;
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

.delivery-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.delivery-card {
  padding: 1rem;
  display: grid;
  gap: 0.65rem;
}

.delivery-card-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.delivery-date {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 0.15rem;
}

.delivery-status {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(61, 107, 79, 0.12);
  color: var(--moss-dark);
  font-size: 0.85rem;
  font-weight: 600;
}

.delivery-address,
.delivery-content {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.delivery-driver-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.65rem;
  align-items: baseline;
}

.delivery-driver-label {
  color: var(--muted);
}

.delivery-driver-email {
  color: var(--muted);
  font-size: 0.9rem;
}

.delivery-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.driver-select {
  flex: 1 1 12rem;
  min-width: 0;
  padding: 0.45rem 0.65rem;
  border: 1px solid rgba(31, 45, 36, 0.18);
  border-radius: 0.5rem;
  font: inherit;
  background: #fff;
}

.delivery-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
