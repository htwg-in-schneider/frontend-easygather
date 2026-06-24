<script setup>

import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { buildOrderPayload, placeOrder } from '@/api/backend.js'

import { useCartStore, SHIPPING_COST } from '@/stores/cart.js'

import { useCheckoutStore } from '@/stores/checkout.js'

import { formatEuro, paymentMethodLabel } from '@/utils/orderFormat.js'

import { notifyError, notifyWarning } from '@/composables/useNotification.js'

import Button from '@/components/Button.vue'

import NavButton from '@/components/NavButton.vue'

import CouponField from '@/components/CouponField.vue'



const router = useRouter()

const cartStore = useCartStore()

const checkoutStore = useCheckoutStore()

const { getAccessTokenSilently } = useAuth0()



const submitting = ref(false)



const paymentOptions = [

  {

    value: 'KARTE',

    label: 'Kreditkarte',

    hint: 'Visa, Mastercard, American Express',

    icon: 'card',

  },

  {

    value: 'PAYPAL',

    label: 'PayPal',

    hint: 'Sicher bezahlen mit deinem PayPal-Konto',

    icon: 'paypal',

  },

  {

    value: 'RECHNUNG',

    label: 'Rechnung',

    hint: 'Zahlung nach Erhalt der Ware',

    icon: 'invoice',

  },

]



onMounted(() => {

  if (!cartStore.items.length) {

    router.replace('/cart')

    return

  }

  const { street, postalCode, city, firstName, lastName, phone } = checkoutStore.delivery

  if (!street.trim() || !postalCode.trim() || !city.trim() || !firstName.trim() || !lastName.trim() || !phone.trim()) {

    router.replace('/checkout/delivery')

  }

})



function formatCardNumber(value) {

  const digits = value.replace(/\D/g, '').slice(0, 16)

  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()

}



function onCardNumberInput(event) {

  checkoutStore.paymentDetails.cardNumber = formatCardNumber(event.target.value)

}



function formatExpiry(value) {

  const digits = value.replace(/\D/g, '').slice(0, 4)

  if (digits.length <= 2) {

    return digits

  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`

}



function onExpiryInput(event) {

  checkoutStore.paymentDetails.expiry = formatExpiry(event.target.value)

}



function validatePaymentForm() {

  if (checkoutStore.paymentMethod === 'KARTE') {

    const { cardHolder, cardNumber, expiry, cvc } = checkoutStore.paymentDetails

    if (!cardHolder.trim() || !cardNumber.trim() || !expiry.trim() || !cvc.trim()) {

      notifyWarning('Bitte fülle alle Kreditkartenfelder aus.')

      return false

    }

    if (cardNumber.replace(/\s/g, '').length < 16) {

      notifyWarning('Bitte gib eine gültige 16-stellige Kartennummer ein.')

      return false

    }

    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) {

      notifyWarning('Bitte gib das Ablaufdatum im Format MM/JJ ein.')

      return false

    }

    if (!/^\d{3}$/.test(cvc.trim())) {

      notifyWarning('Bitte gib eine gültige 3-stellige Prüfziffer ein.')

      return false

    }

  }

  if (checkoutStore.paymentMethod === 'PAYPAL') {

    const email = checkoutStore.paymentDetails.paypalEmail.trim()

    if (!email || !email.includes('@')) {

      notifyWarning('Bitte gib deine PayPal-E-Mail-Adresse ein.')

      return false

    }

  }

  return true

}



async function submitOrder() {

  if (!validatePaymentForm()) {

    return

  }



  submitting.value = true

  try {

    const token = await getAccessTokenSilently()

    const payload = buildOrderPayload(cartStore.items, checkoutStore, cartStore.appliedCoupon)

    const order = await placeOrder(payload, token)

    cartStore.clearCart()

    checkoutStore.reset()

    router.push(`/order/confirmation/${order.id}`)

  } catch (error) {

    console.error('Order failed:', error)

    notifyError('Bestellung konnte nicht abgeschlossen werden.')

  } finally {

    submitting.value = false

  }

}

</script>



<template>

  <section class="checkout-flow checkout-page">

    <header class="checkout-flow-header">

      <NavButton to="/checkout/delivery" variant="secondary" class="checkout-back-link">

        ← Zurück zu deinen Lieferdaten

      </NavButton>

      <p class="checkout-step">Schritt 2 von 2 · Zahlung</p>

      <h2>Zahlung</h2>

      <p class="section-text">
        Wähle deine bevorzugte Zahlungsmethode und schließe deine Bestellung ab.
      </p>

    </header>



    <div class="checkout-layout">

      <form class="checkout-form checkout-payment-form" @submit.prevent="submitOrder">

        <fieldset class="payment-options">

          <legend class="payment-legend">Zahlungsmethode</legend>



          <label

            v-for="option in paymentOptions"

            :key="option.value"

            class="payment-option"

            :class="{ 'payment-option-active': checkoutStore.paymentMethod === option.value }"

          >

            <input

              v-model="checkoutStore.paymentMethod"

              type="radio"

              name="paymentMethod"

              :value="option.value"

            />

            <span class="payment-option-icon" aria-hidden="true">

              <svg v-if="option.icon === 'card'" viewBox="0 0 24 24">

                <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 4v2h18v-2H3zm4 6h4v2H7v-2z" fill="currentColor" />

              </svg>

              <svg v-else-if="option.icon === 'paypal'" viewBox="0 0 24 24">

                <path d="M7 4h6.5c2.8 0 4.5 1.5 4.2 4.2-.2 2-1.4 3.3-3.2 3.6l1.3 6.2H12l-1-4.8H9.2L7 4zm2.2 2.2L9.8 12h2.1c1.6 0 2.5-.8 2.7-2.4.3-2-1-2.4-2.8-2.4H9.2z" fill="currentColor" />

              </svg>

              <svg v-else viewBox="0 0 24 24">

                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h6v2H8v-2z" fill="currentColor" />

              </svg>

            </span>

            <span class="payment-option-copy">

              <strong>{{ option.label }}</strong>

              <small>{{ option.hint }}</small>

            </span>

          </label>

        </fieldset>



        <div v-if="checkoutStore.paymentMethod === 'KARTE'" class="payment-details card">

          <h3>Kreditkartendaten</h3>

          <div class="product-form-field">

            <label for="cardHolder">Karteninhaber <span class="field-required">*</span></label>

            <input id="cardHolder" v-model="checkoutStore.paymentDetails.cardHolder" type="text" required autocomplete="cc-name" />

          </div>

          <div class="product-form-field">

            <label for="cardNumber">Kartennummer <span class="field-required">*</span></label>

            <div class="input-with-icon">

              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="currentColor"/></svg>

              <input

                id="cardNumber"

                :value="checkoutStore.paymentDetails.cardNumber"

                type="text"

                inputmode="numeric"

                required

                autocomplete="cc-number"

                placeholder="1234 5678 9012 3456"

                @input="onCardNumberInput"

              />

            </div>

          </div>

          <div class="checkout-form-grid">

            <div class="product-form-field">

              <label for="cardExpiry">Ablaufdatum <span class="field-required">*</span></label>

              <input

                id="cardExpiry"

                :value="checkoutStore.paymentDetails.expiry"

                type="text"

                inputmode="numeric"

                required

                autocomplete="cc-exp"

                placeholder="MM/JJ"

                maxlength="5"

                @input="onExpiryInput"

              />

            </div>

            <div class="product-form-field">

              <label for="cardCvc">Prüfziffer (CVC) <span class="field-required">*</span></label>

              <input

                id="cardCvc"

                v-model="checkoutStore.paymentDetails.cvc"

                type="password"

                inputmode="numeric"

                required

                autocomplete="cc-csc"

                maxlength="3"

                placeholder="123"

              />

            </div>

          </div>

        </div>



        <div v-else-if="checkoutStore.paymentMethod === 'PAYPAL'" class="payment-details card">

          <h3>PayPal</h3>

          <p class="payment-details-lead">
            Melde dich mit deinem PayPal-Konto an, um die Zahlung abzuschließen.
          </p>

          <div class="product-form-field">

            <label for="paypalEmail">PayPal E-Mail <span class="field-required">*</span></label>

            <input id="paypalEmail" v-model="checkoutStore.paymentDetails.paypalEmail" type="email" required placeholder="name@beispiel.de" />

          </div>

        </div>



        <div v-else class="payment-details card">

          <h3>Rechnung</h3>

          <p class="payment-details-lead">

            Die Rechnung wird zusammen mit deiner Bestellung per E-Mail versendet. Bitte überweise

            den Betrag innerhalb von 14 Tagen nach Erhalt der Ware.

          </p>

          <ul class="payment-invoice-list">

            <li>Zahlungsziel: 14 Tage nach Lieferung</li>

            <li>Rechnungsadresse entspricht deiner Lieferadresse</li>

            <li>Keine Vorauszahlung erforderlich</li>

          </ul>

        </div>



        <div class="payment-total-bar card">

          <span class="payment-total-icon" aria-hidden="true">🛍</span>

          <span>Zu zahlender Betrag</span>

          <strong>{{ formatEuro(cartStore.cartTotal) }}</strong>

        </div>



        <div class="checkout-form-actions">

          <Button type="submit" variant="primary" :disabled="submitting">

            {{ submitting ? 'Wird verarbeitet …' : 'Jetzt bezahlen' }}

          </Button>

        </div>

      </form>



      <aside class="cart-summary card checkout-summary">

        <h3>Bestellübersicht</h3>

        <ul class="checkout-items">
          <li v-for="item in cartStore.items" :key="item.id" class="checkout-item-row">
            <div class="checkout-item-copy">
              <span>{{ item.title }}</span>
              <small>× {{ item.quantity }}</small>
            </div>
            <span>{{ formatEuro(item.price * item.quantity) }}</span>
          </li>
        </ul>
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

          <span>Gesamt</span>

          <span class="cart-summary-total-value">{{ formatEuro(cartStore.cartTotal) }}</span>

        </div>
        <div class="checkout-address-block">

          <h4>Lieferung an</h4>

          <p>

            {{ checkoutStore.delivery.firstName }} {{ checkoutStore.delivery.lastName }}<br />

            {{ checkoutStore.delivery.street }}<br />

            {{ checkoutStore.delivery.postalCode }} {{ checkoutStore.delivery.city }}

          </p>

          <p class="checkout-address-meta">

            {{ paymentMethodLabel(checkoutStore.paymentMethod) }}

          </p>

        </div>

      </aside>

    </div>

  </section>

</template>



<style scoped>

.checkout-layout {

  display: grid;

  gap: 1.25rem;

}



@media (min-width: 52rem) {

  .checkout-layout {

    grid-template-columns: minmax(0, 1.15fr) minmax(16rem, 0.85fr);

    align-items: start;

  }

}



.payment-options {

  border: none;

  margin: 0;

  padding: 0;

  display: grid;

  gap: 0.65rem;

}



.payment-legend {

  margin-bottom: 0.45rem;

  font-weight: 700;

}



.payment-option {

  display: grid;

  grid-template-columns: auto auto 1fr;

  gap: 0.75rem;

  align-items: center;

  padding: 0.85rem 1rem;

  border: 1px solid rgba(31, 45, 36, 0.16);

  border-radius: 0.75rem;

  background: #fff;

  cursor: pointer;

  transition: border-color 0.15s ease, box-shadow 0.15s ease;

}



.payment-option-active {

  border-color: rgba(61, 107, 79, 0.45);

  box-shadow: 0 0 0 2px rgba(61, 107, 79, 0.12);

}



.payment-option-icon {

  display: inline-flex;

  width: 2rem;

  height: 2rem;

  align-items: center;

  justify-content: center;

  border-radius: 0.55rem;

  background: rgba(61, 107, 79, 0.08);

  color: var(--moss-dark);

}



.payment-option-icon svg {

  width: 1.2rem;

  height: 1.2rem;

}



.payment-option-copy {

  display: grid;

  gap: 0.15rem;

}



.payment-option-copy small {

  color: var(--muted);

}



.payment-details {

  padding: 1rem;

  display: grid;

  gap: 0.85rem;

}



.payment-details h3 {

  margin: 0;

  font-size: 1.05rem;

}



.payment-details-lead {

  margin: 0;

  color: var(--muted);

  line-height: 1.55;

}



.payment-invoice-list {

  margin: 0;

  padding-left: 1.1rem;

  color: var(--muted);

  line-height: 1.55;

}



.input-with-icon {

  position: relative;

}



.input-with-icon svg {

  position: absolute;

  left: 0.7rem;

  top: 50%;

  transform: translateY(-50%);

  width: 1rem;

  height: 1rem;

  color: var(--muted);

}



.input-with-icon input {

  padding-left: 2.2rem;

}



.payment-total-bar {

  display: grid;

  grid-template-columns: auto 1fr auto;

  gap: 0.65rem;

  align-items: center;

  padding: 0.85rem 1rem;

}



.payment-total-bar strong {

  color: var(--terracotta);

  font-size: 1.05rem;

}



.checkout-summary {

  padding: 1rem;

  display: grid;

  gap: 0.65rem;

}



.checkout-summary h3 {

  margin: 0;

}



.checkout-items {

  list-style: none;

  margin: 0;

  padding: 0;

  display: grid;

  gap: 0.55rem;

}



.checkout-item-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.55rem;
  align-items: center;
  color: var(--muted);
}

.cart-summary-discount span:last-child {
  color: var(--moss-dark);
  font-weight: 700;
}



.checkout-item-copy {

  display: grid;

  gap: 0.1rem;

  min-width: 0;

}



.checkout-item-copy span {

  color: var(--ink);

  font-weight: 600;

  font-size: 0.92rem;

}



.cart-summary-row {

  display: flex;

  justify-content: space-between;

  gap: 1rem;

  color: var(--muted);

}



.cart-summary-total {

  margin-top: 0.35rem;

  padding-top: 0.65rem;

  border-top: 1px solid rgba(61, 107, 79, 0.15);

  color: var(--ink);

  font-weight: 700;

}



.cart-summary-total-value {

  color: var(--terracotta);

}



.checkout-address-block h4 {

  margin: 0 0 0.35rem;

  font-size: 0.92rem;

}



.checkout-address-block p {

  margin: 0;

  line-height: 1.55;

  color: var(--muted);

  font-size: 0.92rem;

}



.checkout-address-meta {

  margin-top: 0.35rem !important;

  font-weight: 600;

  color: var(--moss-dark) !important;

}

</style>

