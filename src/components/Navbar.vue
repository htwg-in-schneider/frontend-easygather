<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')

watch(
  () => route.query.name,
  (name) => {
    searchQuery.value = typeof name === 'string' ? name : ''
  },
  { immediate: true },
)

function noop(event) {
  event?.preventDefault()
}

function onSearchSubmit() {
  const query = { ...route.query }
  const term = searchQuery.value.trim()
  if (term) {
    query.name = term
  } else {
    delete query.name
  }
  router.push({ path: '/shop', query })
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="header-top">
        <router-link to="/" class="logo">EasyGather</router-link>
        <form class="header-search" role="search" @submit.prevent="onSearchSubmit">
          <input
            v-model="searchQuery"
            type="search"
            class="header-search-input"
            placeholder="Suche …"
            aria-label="Produkte suchen"
          />
        </form>
      </div>
      <nav class="nav-main">
        <a href="#" @click.prevent="noop">Liefergebiet</a>
        <router-link to="/shop">Shop</router-link>
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
  flex-direction: column;
  gap: 0.65rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  flex-shrink: 0;
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.55rem;
  color: var(--moss-dark);
  text-decoration: none;
}

.header-search {
  flex: 1 1 auto;
  min-width: 0;
}

.header-search-input {
  width: 100%;
  padding: 0.45rem 1rem;
  border: 1px solid rgba(31, 45, 36, 0.18);
  border-radius: 999px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--ink);
  background: #fff;
}

.header-search-input::placeholder {
  color: var(--muted);
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

.nav-main a.router-link-active {
  color: var(--moss-dark);
  font-weight: 700;
}

@media (min-width: 52rem) {
  .header-inner {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .header-top {
    flex: 1 1 20rem;
    max-width: 28rem;
  }

  .nav-main {
    flex: 1 1 auto;
    justify-content: flex-end;
  }
}
</style>
