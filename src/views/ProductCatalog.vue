<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { products } from '@/data.js'
import ProductCard from '@/components/ProductCard.vue'
import Button from '@/components/Button.vue'

const route = useRoute()

const displayedProducts = computed(() => {
  const category = route.query.category
  if (category && typeof category === 'string') {
    return products.filter((product) => product.category === category)
  }
  return products
})

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
    <p v-if="displayedProducts.length === 0" class="section-text">Keine Produkte gefunden.</p>

    <div v-if="displayedProducts.length" class="basket-grid">
      <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
    </div>
  </section>
</template>
