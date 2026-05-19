<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/Button.vue'

const route = useRoute()

const shopActive = computed(
  () => route.name === 'shop' || route.name === 'product',
)

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="logo">EasyGather</router-link>
      <nav class="nav-main">
        <a href="#" @click.prevent="noop">Liefergebiet</a>
        <router-link to="/shop" :class="{ 'nav-active': shopActive }">Shop</router-link>
        <a href="#" @click.prevent="noop">Warenkorb</a>
        <a href="#" @click.prevent="noop">Anmelden</a>
        <Button variant="register" href="#" @click="noop">Registrieren</Button>
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
