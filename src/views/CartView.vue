<script setup>

import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { useCartStore, SHIPPING_COST } from '@/stores/cart.js'

import { formatEuro } from '@/utils/orderFormat.js'

import { useAuthLogin } from '@/composables/useAuthLogin.js'

import ConfirmModal from '@/components/ConfirmModal.vue'

import CouponField from '@/components/CouponField.vue'

import Button from '@/components/Button.vue'

import NavButton from '@/components/NavButton.vue'



const router = useRouter()

const auth0 = useAuth0()

const isAuthenticated = auth0?.isAuthenticated

const cartStore = useCartStore()

const { login } = useAuthLogin()



const addedMessage = ref('')

const showRemoveConfirm = ref(false)

const itemToRemove = ref(null)



function lineTotal(item) {

  return item.price * item.quantity

}



function addOne(item) {

  cartStore.updateQuantity(item.id, item.quantity + 1)

}



function removeOne(item) {

  if (item.quantity <= 1) {

    askRemove(item)

    return

  }

  cartStore.updateQuantity(item.id, item.quantity - 1)

}



function askRemove(item) {

  itemToRemove.value = item

  showRemoveConfirm.value = true

}



function confirmRemove() {

  if (itemToRemove.value) {

    cartStore.removeFromCart(itemToRemove.value.id)

  }

  showRemoveConfirm.value = false

  itemToRemove.value = null

}



function cancelRemove() {

  showRemoveConfirm.value = false

  itemToRemove.value = null

}



function goToCheckout() {

  if (!cartStore.items.length) {

    return

  }

  if (!isAuthenticated?.value) {

    login('/checkout/delivery')

    return

  }

  router.push('/checkout/delivery')

}



function openProduct(item) {

  router.push(`/product/view/${item.id}`)

}

</script>



<template>

  <section class="checkout-flow cart-page">

    <header class="checkout-flow-header">

      <NavButton to="/shop" variant="secondary" class="checkout-back-link">

        ← Zurück zum Shop

      </NavButton>

      <h2>Warenkorb</h2>

      <p class="section-text">

        Prüfe deine Auswahl und fahre mit der Bestellung fort.

      </p>

    </header>



    <p v-if="addedMessage" class="cart-feedback">{{ addedMessage }}</p>



    <div v-if="!cartStore.items.length" class="checkout-empty card">

      <p class="checkout-empty-title">Dein Warenkorb ist noch leer</p>

      <p class="section-text">Entdecke unsere Picknickkörbe und stelle dein perfektes Paket zusammen.</p>

      <NavButton to="/shop" variant="primary">Zum Shop</NavButton>

    </div>



    <div v-else class="cart-layout">

      <ul class="cart-list">

        <li v-for="item in cartStore.items" :key="item.id" class="cart-item card">

          <button
            type="button"
            class="cart-item-link"
            :class="{ 'cart-item-link--no-image': !item.imageUrl }"
            @click="openProduct(item)"
          >

            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.imageAlt" class="cart-item-image" />

            <div class="cart-item-body">

              <h3>{{ item.title }}</h3>

              <p class="cart-item-unit-price">{{ formatEuro(item.price) }}</p>

            </div>

          </button>



          <div class="cart-item-controls">

            <div class="cart-item-quantity" aria-label="Menge">

              <button type="button" class="cart-qty-btn" aria-label="Menge verringern" @click="removeOne(item)">

                −

              </button>

              <span class="cart-qty-value">{{ item.quantity }}</span>

              <button type="button" class="cart-qty-btn" aria-label="Menge erhöhen" @click="addOne(item)">

                +

              </button>

            </div>

            <button

              type="button"

              class="cart-remove-btn"

              aria-label="Artikel entfernen"

              title="Artikel entfernen"

              @click="askRemove(item)"

            >

              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">

                <path

                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"

                  fill="currentColor"

                />

              </svg>

            </button>

            <p class="cart-item-total">{{ formatEuro(lineTotal(item)) }}</p>

          </div>

        </li>

      </ul>



      <aside class="cart-summary card">

        <h3>Übersicht</h3>

        <div class="cart-summary-row">

          <span>Zwischensumme</span>

          <span>{{ formatEuro(cartStore.subtotal) }}</span>

        </div>

        <CouponField />

        <div v-if="cartStore.discountAmount > 0" class="cart-summary-row cart-summary-discount">

          <span>Rabatt ({{ cartStore.appliedCoupon }})</span>

          <span>− {{ formatEuro(cartStore.discountAmount) }}</span>

        </div>

        <div class="cart-summary-row">

          <span>Versand</span>

          <span>{{ formatEuro(SHIPPING_COST) }}</span>

        </div>

        <div class="cart-summary-row cart-summary-total">

          <span>Gesamtpreis</span>

          <span class="cart-summary-total-value">{{ formatEuro(cartStore.cartTotal) }}</span>

        </div>



        <div v-if="!isAuthenticated" class="cart-login-notice">

          <p>

            Für den Checkout musst du angemeldet sein.

            <button type="button" class="cart-login-link" @click="login('/checkout/delivery')">

              Jetzt anmelden

            </button>

          </p>

        </div>



        <Button variant="primary" class="cart-checkout-btn" @click="goToCheckout">

          Zur Kasse

        </Button>

        <NavButton to="/shop" variant="secondary">Weiter einkaufen</NavButton>

      </aside>

    </div>



    <ConfirmModal

      :open="showRemoveConfirm"

      title="Artikel entfernen?"

      :message="`Möchtest du „${itemToRemove?.title ?? 'diesen Artikel'}“ wirklich aus dem Warenkorb entfernen?`"

      confirm-label="Ja, entfernen"

      cancel-label="Abbrechen"

      @confirm="confirmRemove"

      @cancel="cancelRemove"

    />

  </section>

</template>



<style scoped>

.cart-feedback {

  margin: 0 0 1rem;

  color: var(--moss-dark);

  font-weight: 600;

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



.cart-layout {

  display: grid;

  gap: 1.25rem;

}



@media (min-width: 52rem) {

  .cart-layout {

    grid-template-columns: minmax(0, 1.5fr) minmax(17rem, 0.85fr);

    align-items: start;

  }

}



.cart-list {

  list-style: none;

  margin: 0;

  padding: 0;

  display: grid;

  gap: 0.85rem;

}



.cart-item {

  display: grid;

  gap: 0.85rem;

  padding: 1rem;

}



@media (min-width: 40rem) {

  .cart-item {

    grid-template-columns: minmax(0, 1fr) auto;

    align-items: center;

  }

}



.cart-item-link {

  display: grid;

  grid-template-columns: 5.5rem minmax(0, 1fr);

  gap: 0.85rem;

  align-items: center;

  padding: 0;

  border: none;

  background: none;

  text-align: left;

  cursor: pointer;

  font: inherit;

  color: inherit;

}



.cart-item-link:hover h3 {

  color: var(--moss-dark);

}

.cart-item-link--no-image {
  grid-template-columns: minmax(0, 1fr);
}

.cart-item-image {

  width: 5.5rem;

  height: 5.5rem;

  object-fit: cover;

  border-radius: 0.65rem;

}



.cart-item-body h3 {

  margin: 0 0 0.25rem;

  font-size: 1.05rem;

  transition: color 0.15s ease;

}



.cart-item-unit-price {

  margin: 0;

  color: var(--terracotta);

  font-weight: 700;

}



.cart-item-controls {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 0.65rem;

  justify-content: flex-end;

}



.cart-item-quantity {

  display: inline-flex;

  align-items: center;

  gap: 0.45rem;

  padding: 0.2rem 0.35rem;

  border: 1px solid rgba(31, 45, 36, 0.14);

  border-radius: 999px;

  background: #fff;

}



.cart-qty-btn {

  width: 1.8rem;

  height: 1.8rem;

  border: none;

  border-radius: 999px;

  background: rgba(61, 107, 79, 0.08);

  cursor: pointer;

  font: inherit;

  font-size: 1.05rem;

  line-height: 1;

}



.cart-qty-btn:hover {

  background: rgba(61, 107, 79, 0.16);

}



.cart-qty-value {

  min-width: 1.2rem;

  text-align: center;

  font-weight: 700;

}



.cart-remove-btn {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 2rem;

  height: 2rem;

  padding: 0;

  border: 1px solid rgba(163, 61, 45, 0.25);

  border-radius: 0.55rem;

  background: rgba(163, 61, 45, 0.06);

  color: #a33d2d;

  cursor: pointer;

}



.cart-remove-btn svg {

  width: 1rem;

  height: 1rem;

}



.cart-remove-btn:hover {

  background: rgba(163, 61, 45, 0.12);

}



.cart-item-total {

  margin: 0;

  min-width: 5rem;

  font-weight: 700;

  text-align: right;

  white-space: nowrap;

}



.cart-summary {

  padding: 1.15rem;

  display: grid;

  gap: 0.65rem;

}



.cart-summary h3 {

  margin: 0;

  font-size: 1.15rem;

}



.cart-summary-row {

  display: flex;

  justify-content: space-between;

  gap: 1rem;

  color: var(--muted);

}



.cart-summary-total {

  margin-top: 0.35rem;

  padding-top: 0.75rem;

  border-top: 1px solid rgba(61, 107, 79, 0.15);

  color: var(--ink);

  font-weight: 700;

}



.cart-summary-total-value {

  color: var(--terracotta);

  font-size: 1.05rem;

}

.cart-summary-discount span:last-child {

  color: var(--moss-dark);

  font-weight: 700;

}



.cart-login-notice {

  padding: 0.75rem;

  border-radius: 0.65rem;

  background: rgba(201, 107, 74, 0.1);

  color: var(--ink);

}



.cart-login-notice p {

  margin: 0;

  line-height: 1.5;

}



.cart-login-link {

  padding: 0;

  border: none;

  background: none;

  color: var(--moss);

  font: inherit;

  font-weight: 700;

  text-decoration: underline;

  cursor: pointer;

}



.cart-checkout-btn {

  width: 100%;

}

</style>

