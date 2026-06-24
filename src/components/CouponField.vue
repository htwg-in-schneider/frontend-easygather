<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.js'

const cartStore = useCartStore()
const inputValue = ref(cartStore.appliedCoupon || '')

function applyCoupon() {
  cartStore.applyCoupon(inputValue.value)
}

function onEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    applyCoupon()
  }
}
</script>

<template>
  <div class="coupon-field">
    <label for="couponCode" class="coupon-label">Gutscheincode</label>
    <div class="coupon-row">
      <input
        id="couponCode"
        v-model="inputValue"
        type="text"
        class="coupon-input"
        placeholder="z. B. EASY10"
        autocomplete="off"
        @keydown="onEnter"
      />
      <button type="button" class="btn btn-secondary coupon-apply-btn" @click="applyCoupon">
        Anwenden
      </button>
    </div>
    <p v-if="cartStore.couponMessage" :class="cartStore.couponError ? 'coupon-error' : 'coupon-success'">
      {{ cartStore.couponMessage }}
    </p>
    <p v-if="cartStore.appliedCoupon" class="coupon-applied">
      Aktiver Code: <strong>{{ cartStore.appliedCoupon }}</strong>
      ({{ cartStore.discountPercent }}&nbsp;Rabatt)
    </p>
  </div>
</template>

<style scoped>
.coupon-field {
  display: grid;
  gap: 0.45rem;
}

.coupon-label {
  font-weight: 700;
  font-size: 0.92rem;
}

.coupon-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;
}

.coupon-input {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid rgba(31, 45, 36, 0.2);
  border-radius: 0.5rem;
  font: inherit;
  color: var(--ink);
  background: #fff;
}

.coupon-apply-btn {
  white-space: nowrap;
  padding-inline: 0.85rem;
}

.coupon-success {
  margin: 0;
  color: var(--moss-dark);
  font-size: 0.88rem;
  font-weight: 600;
}

.coupon-error {
  margin: 0;
  color: #a33d2d;
  font-size: 0.88rem;
  font-weight: 600;
}

.coupon-applied {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}
</style>
