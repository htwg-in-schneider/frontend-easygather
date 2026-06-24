<script setup>

import { ref, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { fetchOrderById } from '@/api/backend.js'

import { formatEuro, orderStatusLabel, paymentMethodLabel } from '@/utils/orderFormat.js'

import { resolveOrderItemImage } from '@/utils/productImage.js'

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

    console.error('Could not load order detail:', err)

    error.value = 'Bestelldetails konnten nicht geladen werden.'

  } finally {

    loading.value = false

  }

})

</script>



<template>

  <section class="checkout-flow order-detail-page">

    <header class="checkout-flow-header">

      <NavButton to="/orders" variant="secondary" class="checkout-back-link">

        ← Zurück zu Meine Bestellungen

      </NavButton>

      <h2>Bestelldetails</h2>

      <p v-if="order" class="section-text">

        Bestellung #{{ order.id }} · {{ formatDateTime(order.createdAt) }}

      </p>

    </header>



    <p v-if="loading" class="section-text">Bestellung wird geladen …</p>

    <p v-else-if="error" class="order-error">{{ error }}</p>



    <div v-else-if="order" class="order-detail-layout">

      <div class="order-detail-main card">

        <div class="order-detail-meta">

          <div class="order-meta-chip">

            <small>Status</small>

            <strong>{{ orderStatusLabel(order.status) }}</strong>

          </div>

          <div class="order-meta-chip">

            <small>Zahlungsart</small>

            <strong>{{ paymentMethodLabel(order.paymentMethod) }}</strong>

          </div>

          <div class="order-meta-chip order-meta-total">

            <small>Gesamtbetrag</small>

            <strong>{{ formatEuro(order.total) }}</strong>

          </div>

        </div>



        <div class="order-detail-block">

          <h3>Lieferadresse</h3>

          <p>

            {{ order.street }}<br />

            {{ order.postalCode }} {{ order.city }}

          </p>

        </div>



        <div class="order-detail-block">

          <h3>Bestellte Artikel</h3>

          <ul class="order-items-list">

            <li v-for="item in order.items" :key="item.id" class="order-item-card">

              <img

                :src="resolveOrderItemImage(item).imageUrl"

                :alt="resolveOrderItemImage(item).imageAlt"

                class="order-item-image"

              />

              <div class="order-item-body">

                <h4>{{ item.productTitle }}</h4>

                <p>Menge: {{ item.quantity }} · Einzelpreis: {{ formatEuro(item.unitPrice) }}</p>

                <p class="order-item-line-total">

                  Summe: {{ formatEuro(item.lineTotal ?? item.unitPrice * item.quantity) }}

                </p>

                <NavButton

                  v-if="item.productId"

                  :to="`/product/view/${item.productId}`"

                  variant="secondary"

                >

                  Erneut bestellen

                </NavButton>

              </div>

            </li>

          </ul>

        </div>

      </div>

    </div>

  </section>

</template>



<style scoped>

.order-detail-layout {

  max-width: 42rem;

  margin: 0 auto;

}



.order-detail-main {

  padding: 1.15rem;

  display: grid;

  gap: 1rem;

}



.order-detail-meta {

  display: grid;

  gap: 0.65rem;

}



@media (min-width: 40rem) {

  .order-detail-meta {

    grid-template-columns: repeat(3, minmax(0, 1fr));

  }

}



.order-meta-chip {

  padding: 0.75rem 0.85rem;

  border: 1px solid rgba(61, 107, 79, 0.14);

  border-radius: 0.75rem;

  background: rgba(255, 255, 255, 0.72);

}



.order-meta-chip small {

  display: block;

  color: var(--muted);

  font-size: 0.82rem;

}



.order-meta-chip strong {

  display: block;

  margin-top: 0.15rem;

}



.order-meta-total strong {

  color: var(--terracotta);

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



.order-items-list {

  list-style: none;

  margin: 0;

  padding: 0;

  display: grid;

  gap: 0.85rem;

}



.order-item-card {

  display: grid;

  grid-template-columns: 5.5rem minmax(0, 1fr);

  gap: 0.85rem;

  padding: 0.85rem;

  border: 1px solid rgba(61, 107, 79, 0.14);

  border-radius: 0.75rem;

  background: rgba(255, 255, 255, 0.72);

}



.order-item-image {

  width: 5.5rem;

  height: 5.5rem;

  object-fit: cover;

  border-radius: 0.65rem;

}



.order-item-body h4 {

  margin: 0 0 0.25rem;

  font-size: 1rem;

}



.order-item-body p {

  margin: 0 0 0.35rem;

  font-size: 0.92rem;

}



.order-item-line-total {

  color: var(--ink) !important;

  font-weight: 700;

}



.order-error {

  color: #a33d2d;

}

</style>

