import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const SHIPPING_COST = 4.9
export const VALID_COUPON_CODE = 'EASY10'
export const COUPON_DISCOUNT_PERCENT = 10

const GUEST_KEY = 'guest'

function itemsStorageKey(userKey) {
  return `cartItems:${userKey}`
}

function couponStorageKey(userKey) {
  return `cartCoupon:${userKey}`
}

export const useCartStore = defineStore('cart', () => {
  let activeUserKey = GUEST_KEY

  const items = ref([])
  const appliedCoupon = ref('')
  const couponMessage = ref('')
  const couponError = ref(false)

  function persistCart() {
    localStorage.setItem(itemsStorageKey(activeUserKey), JSON.stringify(items.value))
    if (appliedCoupon.value) {
      localStorage.setItem(couponStorageKey(activeUserKey), appliedCoupon.value)
    } else {
      localStorage.removeItem(couponStorageKey(activeUserKey))
    }
  }

  function loadCartForUser(userKey) {
    activeUserKey = userKey
    const storedItems = localStorage.getItem(itemsStorageKey(userKey))
    items.value = storedItems ? JSON.parse(storedItems) : []
    appliedCoupon.value = localStorage.getItem(couponStorageKey(userKey)) ?? ''
    couponMessage.value = ''
    couponError.value = false
  }

  function switchAccount(userKey) {
    const nextKey = userKey || GUEST_KEY
    if (nextKey === activeUserKey) {
      return
    }
    persistCart()
    loadCartForUser(nextKey)
  }

  watch(items, persistCart, { deep: true })
  watch(appliedCoupon, persistCart)

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  const discountPercent = computed(() =>
    appliedCoupon.value === VALID_COUPON_CODE ? COUPON_DISCOUNT_PERCENT : 0,
  )

  const discountAmount = computed(() => (subtotal.value * discountPercent.value) / 100)

  const cartTotal = computed(() =>
    Math.max(0, subtotal.value - discountAmount.value + SHIPPING_COST).toFixed(2),
  )

  const itemCount = computed(() => items.value.reduce((count, item) => count + item.quantity, 0))

  function applyCoupon(rawCode) {
    const code = rawCode.trim().toUpperCase()
    if (!code) {
      appliedCoupon.value = ''
      couponMessage.value = ''
      couponError.value = false
      return
    }
    if (code === VALID_COUPON_CODE) {
      appliedCoupon.value = code
      couponMessage.value = `Gutscheincode angewendet – ${COUPON_DISCOUNT_PERCENT}% Rabatt auf die Zwischensumme.`
      couponError.value = false
      return
    }
    appliedCoupon.value = ''
    couponMessage.value = 'Ungültiger Gutscheincode. Bitte prüfe deine Eingabe.'
    couponError.value = true
  }

  function addToCart(product) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        imageAlt: product.imageAlt ?? product.title,
        quantity: 1,
      })
    }
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((entry) => entry.id === productId)
    if (!item) {
      return
    }
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    item.quantity = quantity
  }

  function clearCart() {
    items.value = []
    appliedCoupon.value = ''
    couponMessage.value = ''
    couponError.value = false
    persistCart()
  }

  return {
    items,
    subtotal,
    discountPercent,
    discountAmount,
    cartTotal,
    itemCount,
    appliedCoupon,
    couponMessage,
    couponError,
    switchAccount,
    applyCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})

export function resolveCartUserKey(isAuthenticated, userSub) {
  if (isAuthenticated && userSub) {
    return `user:${userSub}`
  }
  return GUEST_KEY
}
