<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavButton from '@/components/NavButton.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  showEditButton: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()

const productLink = computed(() => {
  const query = {}
  const category = route.query.category
  if (typeof category === 'string' && category) {
    query.returnCategory = category
  }
  return {
    name: 'product',
    params: { id: String(props.product.id) },
    query,
  }
})

function formatPrice(product) {
  const amount = `${product.price.toFixed(2).replace('.', ',')} EUR`
  return product.priceFrom ? `ab ${amount}` : amount
}
</script>

<template>
  <article class="card basket-card">
    <img :src="product.imageUrl" :alt="product.imageAlt" />
    <h3>{{ product.title }}</h3>
    <p>{{ product.description }}</p>
    <span class="meta">{{ formatPrice(product) }}</span>
    <div class="basket-card-actions">
      <NavButton :to="productLink" class="basket-btn">Auswählen</NavButton>
      <NavButton
        v-if="showEditButton"
        :to="{ name: 'product-edit', params: { id: String(product.id) } }"
        variant="secondary"
        class="basket-btn-edit"
      >
        Bearbeiten
      </NavButton>
    </div>
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

.basket-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-inline: 0.85rem;
}

.basket-btn-edit {
  font-size: 0.88rem;
}
</style>
