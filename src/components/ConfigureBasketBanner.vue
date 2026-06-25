<script setup>
import NavButton from '@/components/NavButton.vue'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="configure-basket-banner card">
    <div class="configure-basket-banner-body">
      <p class="configure-basket-banner-eyebrow">Oder selbst zusammenstellen</p>
      <h3>{{ product.title }}</h3>
      <p>{{ product.description }}</p>
    </div>
    <div class="configure-basket-banner-actions">
      <NavButton :to="{ name: 'configure-basket' }" variant="primary">Eigenen Korb zusammenstellen</NavButton>
    </div>
  </article>
</template>

<style scoped>
.configure-basket-banner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 1.15rem 1.25rem;
}

@media (min-width: 48rem) {
  .configure-basket-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
}

.configure-basket-banner-eyebrow {
  margin: 0 0 0.25rem;
  color: var(--moss);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.configure-basket-banner-body h3 {
  margin: 0 0 0.35rem;
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.35rem;
}

.configure-basket-banner-body p {
  margin: 0;
  color: var(--muted);
  max-width: 42rem;
}

.configure-basket-banner-actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
}
</style>
