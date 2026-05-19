<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAllProducts } from '@/api/backend.js'
import ProductCard from '@/components/ProductCard.vue'
import Button from '@/components/Button.vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

const displayedProducts = computed(() => products.value)

onMounted(async () => {
  await loadProducts()
})

async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    products.value = await fetchAllProducts()
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Produkte konnten nicht geladen werden.'
    products.value = []
  } finally {
    loading.value = false
  }
}

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <section id="shop-produkte">
    <div class="shop-section-header">
      <div class="shop-section-intro">
        <h2>Produkte</h2>
        <p class="section-text">
          Picknickkörbe, Party & Event sowie Essen & Getränke – alles in einer Bestellung.
        </p>
      </div>
      <Button
        variant="secondary"
        class="basket-filter-toggle"
        title="Filter folgt in einer späteren Iteration"
        @click="noop"
      >
        Filter
      </Button>
    </div>

    <p v-if="loading" class="section-text">Produkte werden geladen …</p>
    <p v-else-if="error" class="section-text">{{ error }}</p>
    <p v-else-if="displayedProducts.length === 0" class="section-text">Keine Produkte gefunden.</p>

    <div v-if="displayedProducts.length" class="basket-grid">
      <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
    </div>
  </section>
</template>
