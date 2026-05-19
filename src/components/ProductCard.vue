<script setup>
import Button from '@/components/Button.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

function formatPrice(product) {
  const amount = `${product.price.toFixed(2).replace('.', ',')} EUR`
  return product.priceFrom ? `ab ${amount}` : amount
}

function showProductAlert() {
  const product = props.product
  const items = product.includedItems?.length
    ? '\n\nEnthaltene Artikel:\n• ' + product.includedItems.join('\n• ')
    : ''
  alert(product.description + items)
}
</script>

<template>
  <article class="card basket-card">
    <img :src="product.imageUrl" :alt="product.imageAlt" />
    <h3>{{ product.title }}</h3>
    <p>{{ product.description }}</p>
    <span class="meta">{{ formatPrice(product) }}</span>
    <Button variant="secondary" class="basket-btn" @click="showProductAlert">Auswählen</Button>
  </article>
</template>

<style scoped>
.basket-card {
  padding-bottom: 1rem;
  overflow: hidden;
}

.basket-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.basket-card h3 {
  margin: 0.8rem 0 0.35rem;
  padding-inline: 0.85rem;
  font-size: 1.15rem;
  font-family: "Fraunces", Georgia, serif;
}

.basket-card p {
  margin: 0 0 0.5rem;
  padding-inline: 0.85rem;
  color: var(--muted);
}

.basket-card .meta {
  display: inline-block;
  margin: 0 0 0.75rem 0.85rem;
  color: var(--terracotta);
  font-weight: 700;
  font-size: 0.9rem;
}

.basket-btn {
  margin-left: 0.85rem;
}
</style>
