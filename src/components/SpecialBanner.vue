<script setup>
import { useBannerStore } from '@/stores/banner'
import Button from '@/components/Button.vue'

const bannerStore = useBannerStore()

defineProps({
  text: {
    type: String,
    default: "Nur heute 10% Rabatt mit dem Code 'EASY10'",
  },
})
</script>

<template>
  <div v-if="bannerStore.isVisible" class="special-banner">
    <p class="special-banner-text">{{ text }}</p>
    <Button variant="secondary" class="special-banner-btn" @click="bannerStore.hideBanner">OK</Button>
  </div>
</template>

<style scoped>
.special-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.65rem 1rem;
  padding: 0.75rem 1rem;
  text-align: center;
  background: var(--terracotta);
  color: #fff;
}

.special-banner-text {
  margin: 0;
  font-weight: 500;
  font-size: 0.95rem;
}

.special-banner-btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.88rem;
  border-color: #fff;
  color: #fff;
  background: transparent;
}

.special-banner-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
