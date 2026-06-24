<script setup>

import { onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth0 } from '@auth0/auth0-vue'

import { fetchProfile } from '@/api/backend.js'

import { useCartStore } from '@/stores/cart.js'

import { useCheckoutStore } from '@/stores/checkout.js'

import { notifyWarning } from '@/composables/useNotification.js'
import Button from '@/components/Button.vue'

import NavButton from '@/components/NavButton.vue'



const router = useRouter()

const cartStore = useCartStore()

const checkoutStore = useCheckoutStore()

const { getAccessTokenSilently } = useAuth0()



onMounted(async () => {

  if (!cartStore.items.length) {

    router.replace('/cart')

    return

  }



  try {

    const token = await getAccessTokenSilently()

    const profile = await fetchProfile(token)

    checkoutStore.setDelivery({

      firstName: profile.firstName ?? '',

      lastName: profile.lastName ?? '',

      street: profile.street ?? '',

      postalCode: profile.postalCode ?? '',

      city: profile.city ?? '',

    })

    if (!checkoutStore.paymentDetails.cardHolder.trim()) {

      const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ')

      checkoutStore.paymentDetails.cardHolder = name

    }

  } catch (error) {

    console.error('Could not prefill delivery address:', error)

  }

})



function continueToPayment() {

  const { firstName, lastName, street, postalCode, city, phone } = checkoutStore.delivery

  if (!firstName.trim() || !lastName.trim() || !street.trim() || !postalCode.trim() || !city.trim() || !phone.trim()) {

    notifyWarning('Bitte fülle alle Pflichtfelder aus.')

    return

  }

  if (!/^\d{5}$/.test(postalCode.trim())) {

    notifyWarning('Bitte gib eine gültige PLZ mit 5 Ziffern ein.')

    return

  }

  router.push('/checkout/payment')

}

</script>



<template>

  <section class="checkout-flow checkout-page">

    <header class="checkout-flow-header">

      <NavButton to="/cart" variant="secondary" class="checkout-back-link">

        ← Zurück zum Warenkorb

      </NavButton>

      <p class="checkout-step">Schritt 1 von 2 · Lieferung</p>

      <h2>Lieferdaten</h2>

      <p class="section-text">

        Bitte gib deine Lieferadresse und weiteren Informationen ein, damit wir deine Bestellung

        zuverlässig zustellen können.

      </p>

    </header>



    <form class="checkout-form card" @submit.prevent="continueToPayment">

      <div class="checkout-form-grid">

        <div class="product-form-field">

          <label for="deliveryFirstName">Vorname <span class="field-required">*</span></label>

          <input id="deliveryFirstName" v-model="checkoutStore.delivery.firstName" type="text" required autocomplete="given-name" />

        </div>

        <div class="product-form-field">

          <label for="deliveryLastName">Nachname <span class="field-required">*</span></label>

          <input id="deliveryLastName" v-model="checkoutStore.delivery.lastName" type="text" required autocomplete="family-name" />

        </div>

      </div>



      <div class="product-form-field">

        <label for="deliveryStreet">Straße &amp; Hausnummer <span class="field-required">*</span></label>

        <input id="deliveryStreet" v-model="checkoutStore.delivery.street" type="text" required autocomplete="street-address" placeholder="z. B. Hauptstraße 12" />

      </div>



      <div class="checkout-form-grid">

        <div class="product-form-field">

          <label for="deliveryPostalCode">PLZ <span class="field-required">*</span></label>

          <input id="deliveryPostalCode" v-model="checkoutStore.delivery.postalCode" type="text" required inputmode="numeric" maxlength="5" placeholder="78464" />

        </div>

        <div class="product-form-field">

          <label for="deliveryCity">Ort <span class="field-required">*</span></label>

          <input id="deliveryCity" v-model="checkoutStore.delivery.city" type="text" required autocomplete="address-level2" placeholder="Konstanz" />

        </div>

      </div>



      <div class="product-form-field">

        <label for="deliveryPhone">Telefonnummer <span class="field-required">*</span></label>

        <input id="deliveryPhone" v-model="checkoutStore.delivery.phone" type="tel" required autocomplete="tel" placeholder="0151 12345678" />

      </div>



      <div class="product-form-field">

        <label for="deliveryNote">Lieferhinweis (optional)</label>

        <textarea

          id="deliveryNote"

          v-model="checkoutStore.delivery.deliveryNote"

          rows="3"

          placeholder="z. B. An der Haustür klingeln, Klingel defekt"

        />

      </div>



      <div class="checkout-form-actions">

        <Button type="submit" variant="primary">Weiter zur Zahlung</Button>

      </div>

    </form>

  </section>

</template>

