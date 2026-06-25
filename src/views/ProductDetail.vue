<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProductById } from '@/api/backend.js'
import { useCartStore } from '@/stores/cart.js'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'
import { useUserProfile } from '@/composables/useUserProfile.js'
import { isConfigurableBasket } from '@/config/basketConfigurator.js'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { isAdmin } = useUserProfile()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

const shopBackLink = computed(() => {
  const returnCategory = route.query.returnCategory
  if (typeof returnCategory === 'string' && returnCategory) {
    return { path: '/shop', query: { category: returnCategory } }
  }
  return { path: '/shop' }
})

onMounted(() => {
  loadProduct()
})

watch(
  () => route.params.id,
  () => {
    loadProduct()
  },
)

async function loadProduct() {
  loading.value = true
  error.value = null
  product.value = null
  try {
    product.value = await fetchProductById(route.params.id)
    if (product.value && isConfigurableBasket(product.value)) {
      router.replace({ name: 'configure-basket' })
      return
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Produkt konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function formatPrice(item) {
  const amount = `${item.price.toFixed(2).replace('.', ',')} EUR`
  return item.priceFrom ? `ab ${amount}` : amount
}

function addToCart() {
  if (!product.value) {
    return
  }
  cartStore.addToCart(product.value)
  router.push('/cart')
}
</script>

<template>
  <section class="product-detail">
    <p v-if="loading" class="section-text">Produkt wird geladen …</p>
    <p v-else-if="error" class="section-text">{{ error }}</p>

    <div v-else-if="product" class="product-detail-grid">
      <img :src="product.imageUrl" :alt="product.imageAlt" class="product-detail-image" />
      <div>
        <h2>{{ product.title }}</h2>
        <p class="product-detail-description">{{ product.description }}</p>
        <div class="product-detail-price-box">
          <span class="product-detail-price-label">Preis</span>
          <span class="product-detail-price-value">{{ formatPrice(product) }}</span>
        </div>
        <template v-if="product.includedItems?.length">
          <h3 class="product-detail-included-title">Enthaltene Artikel</h3>
          <ul class="product-detail-included">
            <li v-for="(item, index) in product.includedItems" :key="index">{{ item }}</li>
          </ul>
        </template>
        <div class="product-detail-actions">
          <NavButton :to="shopBackLink">Zurück</NavButton>
          <NavButton
            v-if="isAdmin"
            :to="{ name: 'product-edit', params: { id: String(product.id) } }"
            variant="primary"
          >
            Bearbeiten
          </NavButton>
          <Button v-else variant="primary" @click="addToCart">In den Warenkorb</Button>
        </div>
      </div>
    </div>
    <div v-else class="product-detail-missing">
      <p>Produkt wurde nicht gefunden.</p>
      <NavButton :to="shopBackLink">Zurück zum Shop</NavButton>
    </div>
  </section>
</template>
