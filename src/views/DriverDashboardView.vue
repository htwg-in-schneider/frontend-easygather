<script setup>

import { ref, computed, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { acceptDelivery, fetchDriverDashboard, updateDeliveryStatus } from '@/api/backend.js'

import { useUserProfile } from '@/composables/useUserProfile.js'

import { formatDateTime, parseDateTime } from '@/utils/dateFormat.js'

import Button from '@/components/Button.vue'

import DeliveryFilterPanel from '@/components/DeliveryFilterPanel.vue'



const MY_STATUS_OPTIONS = [
  { value: 'ANGENOMMEN', label: 'angenommen' },
  { value: 'UNTERWEGS', label: 'unterwegs' },
  { value: 'GELIEFERT', label: 'geliefert' },
]

const STATUS_TRANSITIONS = {
  ANGENOMMEN: ['ANGENOMMEN', 'UNTERWEGS'],
  UNTERWEGS: ['UNTERWEGS', 'GELIEFERT'],
  GELIEFERT: ['GELIEFERT'],
}

function statusOptionsFor(order) {
  const allowed = STATUS_TRANSITIONS[order.status] ?? [order.status]
  return MY_STATUS_OPTIONS.filter((option) => allowed.includes(option.value))
}



const router = useRouter()

const { getAccessTokenSilently } = useAuth0()

const { isFahrer, refreshProfile } = useUserProfile()



const availableDeliveries = ref([])

const myDeliveries = ref([])

const loading = ref(true)

const error = ref(null)

const savingOrderId = ref(null)

const acceptingOrderId = ref(null)

const filterOpen = ref(false)

const selectedStatus = ref('')

const appliedStatus = ref('')



const activeStatusLabel = computed(() => {

  if (!appliedStatus.value) {

    return ''

  }

  return MY_STATUS_OPTIONS.find((option) => option.value === appliedStatus.value)?.label ?? ''

})



const displayedMyDeliveries = computed(() => {

  const filtered = appliedStatus.value

    ? myDeliveries.value.filter((order) => order.status === appliedStatus.value)

    : myDeliveries.value



  return sortByDateDesc(filtered)

})



const displayedAvailableDeliveries = computed(() => sortByDateDesc(availableDeliveries.value))



function sortByDateDesc(orders) {

  return [...orders].sort((a, b) => {

    const dateA = parseDateTime(a.orderCreatedAt)?.getTime() ?? 0

    const dateB = parseDateTime(b.orderCreatedAt)?.getTime() ?? 0

    return dateB - dateA

  })

}



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

    const dashboard = await fetchDriverDashboard(token)

    availableDeliveries.value = dashboard.available ?? []

    myDeliveries.value = dashboard.myDeliveries ?? []

  } catch (err) {

    console.error('Error loading deliveries:', err)

    error.value = 'Lieferaufträge konnten nicht geladen werden.'

    availableDeliveries.value = []

    myDeliveries.value = []

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



async function onAccept(order) {

  acceptingOrderId.value = order.id

  try {

    const token = await getAccessTokenSilently()

    const accepted = await acceptDelivery(order.id, token)

    availableDeliveries.value = availableDeliveries.value.filter((item) => item.id !== order.id)

    myDeliveries.value = [accepted, ...myDeliveries.value.filter((item) => item.id !== accepted.id)]

  } catch (err) {

    console.error('Error accepting delivery:', err)

    if (err.message === 'DELIVERY_ALREADY_ACCEPTED') {

      alert('Dieser Auftrag wurde bereits von einem anderen Fahrer angenommen.')

      await loadDeliveries()

    } else {

      alert('Auftrag konnte nicht angenommen werden.')

    }

  } finally {

    acceptingOrderId.value = null

  }

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
        <h1>Lieferaufträge</h1>
      </div>
    </div>

    <p v-if="loading" class="section-text">Lieferaufträge werden geladen …</p>

    <p v-else-if="error" class="section-text">{{ error }}</p>



    <template v-else>

      <section class="driver-dashboard-section">

        <div class="driver-section-intro">
          <h2>Neue Lieferaufträge</h2>
          <p class="section-text">Eingegangene Bestellungen – für alle Fahrer sichtbar.</p>
        </div>



        <p v-if="displayedAvailableDeliveries.length === 0" class="section-text">

          Aktuell keine neuen Lieferaufträge.

        </p>



        <div v-else class="driver-order-grid">

          <article

            v-for="order in displayedAvailableDeliveries"

            :key="order.id"

            class="card driver-order-card driver-order-card-available"

          >

            <div class="driver-order-content">

              <p class="driver-order-badge">Eingegangen</p>

              <h3>Auftrag {{ order.orderNumber }}</h3>

              <p class="driver-order-date">{{ formatDateTime(order.orderCreatedAt) }}</p>

              <p><strong>Adresse:</strong> {{ order.deliveryAddress }}</p>

              <p><strong>Inhalt:</strong> {{ order.contentSummary }}</p>

              <div class="driver-order-actions">

                <Button

                  type="button"

                  variant="primary"

                  :disabled="acceptingOrderId === order.id"

                  @click="onAccept(order)"

                >

                  {{ acceptingOrderId === order.id ? 'Wird zugewiesen …' : 'Mir zuweisen' }}

                </Button>

              </div>

            </div>

          </article>

        </div>

      </section>



      <section class="driver-dashboard-section">
        <div class="driver-section-header">
          <div>
            <h2>Deine zugewiesenen Lieferaufträge</h2>
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
          :status-options="MY_STATUS_OPTIONS"
          @apply="applyFilters"
          @reset="resetFilters"
          @close="closeFilter"
        />

        <p v-if="myDeliveries.length === 0" class="section-text">Noch keine Lieferaufträge zugewiesen.</p>

        <p v-else-if="displayedMyDeliveries.length === 0" class="section-text">

          Keine Lieferaufträge für diesen Filter gefunden.

        </p>



        <div v-else class="driver-order-grid">

          <article v-for="order in displayedMyDeliveries" :key="order.id" class="card driver-order-card">

            <div class="driver-order-content">

              <h3>Auftrag {{ order.orderNumber }}</h3>

              <p class="driver-order-date">{{ formatDateTime(order.orderCreatedAt) }}</p>

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

                  <option v-for="option in statusOptionsFor(order)" :key="option.value" :value="option.value">

                    {{ option.label }}

                  </option>

                </select>

              </div>

            </div>

          </article>

        </div>

      </section>

    </template>

  </section>

</template>


