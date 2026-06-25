import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'configureBasketDraft'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const useConfigureBasketDraftStore = defineStore('configureBasketDraft', () => {
  const quantities = ref(readStorage())

  watch(
    quantities,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function quantityFor(productId) {
    return quantities.value[productId] ?? 0
  }

  function setQuantity(productId, quantity) {
    quantities.value = {
      ...quantities.value,
      [productId]: Math.max(0, quantity),
    }
  }

  function changeQuantity(productId, delta) {
    setQuantity(productId, quantityFor(productId) + delta)
  }

  function ensureProducts(productIds) {
    const next = { ...quantities.value }
    for (const id of productIds) {
      if (next[id] === undefined) {
        next[id] = 0
      }
    }
    quantities.value = next
  }

  function clear() {
    quantities.value = {}
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    quantities,
    quantityFor,
    setQuantity,
    changeQuantity,
    ensureProducts,
    clear,
  }
})
