<script setup>
import Button from '@/components/Button.vue'

defineProps({
  shopActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['home', 'shop', 'noop'])

function onHome(event) {
  emit('home', event)
}

function onShop(event) {
  emit('shop', event)
}

function onNoop(event) {
  emit('noop', event)
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a href="#" class="logo" @click="onHome">EasyGather</a>
      <nav class="nav-main">
        <a href="#" @click="onNoop">Liefergebiet</a>
        <a href="#" :class="{ 'nav-active': shopActive }" @click="onShop">Shop</a>
        <a href="#" @click="onNoop">Warenkorb</a>
        <a href="#" @click="onNoop">Anmelden</a>
        <Button variant="register" href="#" @click="onNoop">Registrieren</Button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(61, 107, 79, 0.18);
  background: rgba(250, 246, 239, 0.95);
}

.header-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.logo {
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.55rem;
  color: var(--moss-dark);
  text-decoration: none;
}

.nav-main {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.nav-main a {
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
}

.nav-active {
  color: var(--moss-dark);
  font-weight: 700;
}
</style>
