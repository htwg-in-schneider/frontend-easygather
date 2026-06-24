<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchOrderById } from '@/api/backend.js'
import { formatEuro, orderStatusLabel, paymentMethodLabel } from '@/utils/orderFormat.js'
import { formatDateTime } from '@/utils/dateFormat.js'
import NavButton from '@/components/NavButton.vue'

const route = useRoute()
const { getAccessTokenSilently } = useAuth0()

const order = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently()
    order.value = await fetchOrderById(route.params.id, token)
  } catch (err) {
    console.error('Could not load order confirmation:', err)
    error.value = 'Bestellbestätigung konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="checkout-flow order-confirmation">
    <p v-if="loading" class="section-text order-state">Bestellung wird geladen …</p>
    <p v-else-if="error" class="order-error order-state">{{ error }}</p>

    <div v-else-if="order" class="order-success card">
      <div class="order-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z" fill="currentColor"/></svg>
      </div>

      <h2>Bestellung erfolgreich!</h2>
      <p class="order-success-lead">
        Vielen Dank für deine Bestellung. Deine Bestellung wurde erfolgreich aufgegeben.
      </p>

      <div class="order-info-grid">
        <div class="order-info-item">
          <span class="order-info-icon" aria-hidden="true">📄</span>
          <div>
            <small>Bestellnummer</small>
            <strong>#{{ order.id }}</strong>
          </div>
        </div>
        <div class="order-info-item">
          <span class="order-info-icon" aria-hidden="true">📅</span>
          <div>
            <small>Datum</small>
            <strong>{{ formatDateTime(order.createdAt) }}</strong>
          </div>
        </div>
        <div class="order-info-item">
          <span class="order-info-icon" aria-hidden="true">💳</span>
          <div>
            <small>Zahlungsmethode</small>
            <strong>{{ paymentMethodLabel(order.paymentMethod) }}</strong>
          </div>
        </div>
        <div class="order-info-item order-info-total">
          <span class="order-info-icon" aria-hidden="true">💰</span>
          <div>
            <small>Gesamtbetrag</small>
            <strong class="order-total-highlight">{{ formatEuro(order.total) }}</strong>
          </div>
        </div>
      </div>

      <div class="order-detail-block">
        <h3>Lieferadresse</h3>
        <p>
          {{ order.street }}<br />
          {{ order.postalCode }} {{ order.city }}
        </p>
        <p class="order-status-line">
          Status: <strong>{{ orderStatusLabel(order.status) }}</strong>
        </p>
      </div>

      <div class="order-detail-block">
        <h3>Bestellte Artikel</h3>
        <ul class="order-items-list">
          <li v-for="item in order.items" :key="item.id" class="order-item-row">
            <div class="order-item-copy">
              <strong>{{ item.productTitle }}</strong>
              <span>Menge: {{ item.quantity }}</span>
            </div>
            <span class="order-item-price">{{ formatEuro(item.lineTotal ?? item.unitPrice * item.quantity) }}</span>
          </li>
        </ul>
        <div v-if="order.discountAmount > 0" class="order-discount-line">
          Rabatt ({{ order.couponCode }}): − {{ formatEuro(order.discountAmount) }}
        </div>
      </div>

      <p class="order-email-note">
        Du erhältst in Kürze eine Bestellbestätigung per E-Mail.
      </p>

      <div class="order-success-actions">
        <NavButton to="/orders" variant="primary">Meine Bestellungen ansehen</NavButton>
        <NavButton to="/shop" variant="secondary">Weiter shoppen</NavButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.order-state {
  text-align: center;
}

.order-success {
  max-width: 34rem;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
  text-align: center;
}

.order-success-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(61, 107, 79, 0.12);
  color: var(--moss-dark);
}

.order-success-icon svg {
  width: 2.2rem;
  height: 2.2rem;
}

.order-success h2 {
  margin: 0;
  font-size: 1.75rem;
}

.order-success-lead {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.order-info-grid {
  display: grid;
  gap: 0.65rem;
  text-align: left;
}

.order-info-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border: 1px solid rgba(61, 107, 79, 0.14);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.72);
}

.order-info-item small {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
}

.order-info-item strong {
  display: block;
  margin-top: 0.1rem;
}

.order-total-highlight {
  color: var(--terracotta);
  font-size: 1.05rem;
}

.order-detail-block {
  text-align: left;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(61, 107, 79, 0.14);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.72);
}

.order-detail-block h3 {
  margin: 0 0 0.45rem;
  font-size: 1rem;
}

.order-detail-block p {
  margin: 0;
  line-height: 1.55;
  color: var(--muted);
}

.order-status-line {
  margin-top: 0.45rem !important;
  color: var(--ink) !important;
}

.order-items-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.order-item-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: center;
}

.order-item-copy {
  display: grid;
  gap: 0.1rem;
  text-align: left;
}

.order-item-copy span {
  color: var(--muted);
  font-size: 0.88rem;
}

.order-item-price {
  font-weight: 700;
  white-space: nowrap;
}

.order-discount-line {
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(61, 107, 79, 0.14);
  color: var(--moss-dark);
  font-weight: 600;
  text-align: left;
}

.order-email-note {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.order-success-actions {
  display: grid;
  gap: 0.65rem;
}

.order-error {
  color: #a33d2d;
  text-align: center;
}
</style>
