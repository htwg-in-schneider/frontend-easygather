<script setup>

import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { fetchMyOrders } from '@/api/backend.js'

import { formatEuro, orderStatusLabel, paymentMethodLabel, displayOrderNumber } from '@/utils/orderFormat.js'

import { formatDateTime } from '@/utils/dateFormat.js'

import { resolveOrderItemImage } from '@/utils/productImage.js'

import NavButton from '@/components/NavButton.vue'



const router = useRouter()

const { getAccessTokenSilently } = useAuth0()



const orders = ref([])

const loading = ref(true)

const error = ref('')



onMounted(async () => {

  try {

    const token = await getAccessTokenSilently()

    orders.value = await fetchMyOrders(token)

  } catch (err) {

    console.error('Could not load orders:', err)

    error.value = 'Bestellungen konnten nicht geladen werden.'

  } finally {

    loading.value = false

  }

})



function formatDate(value) {
  return formatDateTime(value)
}



function primaryItem(order) {

  return order.items?.[0] ?? null

}



function openOrder(orderId) {

  router.push(`/orders/${orderId}`)

}

</script>



<template>

  <section class="checkout-flow orders-page">

    <header class="checkout-flow-header">

      <h2>Meine Bestellungen</h2>

      <p class="section-text">

        Hier findest du alle deine bisherigen Bestellungen. Klicke auf eine Bestellung, um Details

        zu sehen oder Artikel erneut zu bestellen.

      </p>

    </header>



    <p v-if="loading" class="section-text">Bestellungen werden geladen …</p>

    <p v-else-if="error" class="orders-error">{{ error }}</p>



    <div v-else-if="!orders.length" class="checkout-empty card">

      <p class="checkout-empty-title">Noch keine Bestellungen</p>

      <p class="section-text">Sobald du etwas bestellst, erscheint es hier in deiner Übersicht.</p>

      <NavButton to="/shop" variant="primary">Zum Shop</NavButton>

    </div>



    <ul v-else class="orders-list">

      <li v-for="order in orders" :key="order.id">

        <button type="button" class="orders-card card" @click="openOrder(order.id)">

          <img
            v-if="primaryItem(order) && resolveOrderItemImage(primaryItem(order)).imageUrl"
            :src="resolveOrderItemImage(primaryItem(order)).imageUrl"
            :alt="resolveOrderItemImage(primaryItem(order)).imageAlt"
            class="orders-card-image"
          />

          <div class="orders-card-body">

            <div class="orders-card-header">

              <h3>Bestellnummer {{ displayOrderNumber(order) }}</h3>

              <span class="orders-status">{{ orderStatusLabel(order.status) }}</span>

            </div>

            <p class="orders-meta">

              {{ formatDate(order.createdAt) }} · {{ paymentMethodLabel(order.paymentMethod) }}

            </p>

            <p class="orders-items-preview">

              <span v-for="(item, index) in order.items" :key="item.id">

                {{ item.productTitle }}<template v-if="index < order.items.length - 1">, </template>

              </span>

            </p>

            <p class="orders-address">

              {{ order.street }}, {{ order.postalCode }} {{ order.city }}

            </p>

            <p class="orders-total">{{ formatEuro(order.total) }}</p>

            <span class="orders-card-cta">Details ansehen →</span>

          </div>

        </button>

      </li>

    </ul>

  </section>

</template>



<style scoped>

.orders-list {

  list-style: none;

  margin: 0;

  padding: 0;

  display: grid;

  gap: 0.85rem;

  max-width: 42rem;

  margin-inline: auto;

}



.orders-card {

  width: 100%;

  display: grid;

  grid-template-columns: 6.5rem minmax(0, 1fr);

  gap: 0.85rem;

  padding: 0.85rem;

  border: 1px solid rgba(61, 107, 79, 0.15);

  background: rgba(255, 255, 255, 0.78);

  text-align: left;

  cursor: pointer;

  font: inherit;

  color: inherit;

  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

}



.orders-card:hover {

  transform: translateY(-2px);

  border-color: rgba(201, 107, 74, 0.35);

  box-shadow: 0 8px 22px rgba(31, 45, 36, 0.1);

}



.orders-card-image {

  width: 6.5rem;

  height: 6.5rem;

  object-fit: cover;

  border-radius: 0.65rem;

}



.orders-card-body {

  display: grid;

  gap: 0.35rem;

  align-content: start;

}



.orders-card-header {

  display: flex;

  justify-content: space-between;

  gap: 1rem;

  align-items: center;

}



.orders-card-header h3 {

  margin: 0;

  font-size: 1.05rem;

}



.orders-status {

  font-size: 0.82rem;

  font-weight: 700;

  color: var(--moss-dark);

  white-space: nowrap;

}



.orders-meta,

.orders-address,

.orders-items-preview {

  margin: 0;

  color: var(--muted);

  font-size: 0.92rem;

  line-height: 1.45;

}



.orders-total {

  margin: 0;

  color: var(--terracotta);

  font-weight: 700;

  font-size: 1.02rem;

}



.orders-card-cta {

  margin-top: 0.15rem;

  color: var(--moss);

  font-weight: 700;

  font-size: 0.92rem;

}



.checkout-empty {

  max-width: 28rem;

  margin: 0 auto;

  padding: 1.5rem;

  text-align: center;

  display: grid;

  gap: 0.75rem;

}



.checkout-empty-title {

  margin: 0;

  font-family: "Fraunces", Georgia, serif;

  font-size: 1.25rem;

  font-weight: 700;

}



.orders-error {

  color: #a33d2d;

  text-align: center;

}

</style>

