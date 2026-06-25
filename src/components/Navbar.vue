<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useCartStore } from '@/stores/cart.js'
import { useAuthLogin } from '@/composables/useAuthLogin.js'
import { notifyError } from '@/composables/useNotification.js'
import Button from '@/components/Button.vue'
import { useUserProfile } from '@/composables/useUserProfile.js'
import { resolveAdminSearchDestination } from '@/composables/useAdminGlobalSearch.js'

const route = useRoute()
const router = useRouter()
const auth0 = useAuth0()
const isAuthenticated = auth0?.isAuthenticated
const isLoading = auth0?.isLoading
const { getAccessTokenSilently } = auth0
const { isFahrer, isAdmin, displayName } = useUserProfile()
const cartStore = useCartStore()
const { login } = useAuthLogin()

const searchQuery = ref('')

const homeLink = computed(() => (isFahrer.value ? '/lieferauftraege' : '/'))
const showCustomerNav = computed(() => !isFahrer.value)
const showHeaderSearch = computed(() => showCustomerNav.value)
const showCart = computed(() => showCustomerNav.value && !isAdmin.value)
const showShop = computed(() => showCustomerNav.value && !isAdmin.value)
const showMyOrders = computed(() => showCustomerNav.value && !isAdmin.value)
const searchPlaceholder = computed(() =>
  isAdmin.value ? 'Stammdaten durchsuchen …' : 'Produkte suchen …',
)
const searchAriaLabel = computed(() =>
  isAdmin.value ? 'Administration durchsuchen' : 'Produkte suchen',
)

watch(
  () => [route.query.q, route.query.name],
  ([q, name]) => {
    if (typeof q === 'string' && q) {
      searchQuery.value = q
      return
    }
    if (typeof name === 'string' && name) {
      searchQuery.value = name
      return
    }
    if (!route.path.startsWith('/shop') && !route.path.startsWith('/admin')) {
      searchQuery.value = ''
    }
  },
  { immediate: true },
)

function noop(event) {
  event?.preventDefault()
}

async function onSearchSubmit() {
  const term = searchQuery.value.trim()
  if (isAdmin.value) {
    if (!term) {
      router.push('/admin')
      return
    }
    try {
      const token = await getAccessTokenSilently()
      const destination = await resolveAdminSearchDestination(term, token)
      router.push(destination)
    } catch (err) {
      console.error('Admin search failed:', err)
      notifyError('Suche fehlgeschlagen.')
    }
    return
  }

  const query = { ...route.query }
  if (term) {
    query.name = term
  } else {
    delete query.name
  }
  router.push({ path: '/shop', query })
}

async function handleLogin(event) {
  event?.preventDefault()
  await login(route.fullPath)
}

function handleLogout(event) {
  event?.preventDefault()
  auth0?.logout({
    logoutParams: {
      returnTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
    },
  })
}

onMounted(() => {
  const lastError = sessionStorage.getItem('auth0_last_error')
  if (lastError) {
    sessionStorage.removeItem('auth0_last_error')
    notifyError(`Auth0-Fehler: ${lastError}`)
  }
})
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="header-top">
        <router-link :to="homeLink" class="logo">EasyGather</router-link>
        <form
          v-if="showHeaderSearch"
          class="header-search"
          role="search"
          @submit.prevent="onSearchSubmit"
        >
          <input
            v-model="searchQuery"
            type="search"
            class="header-search-input"
            :placeholder="searchPlaceholder"
            :aria-label="searchAriaLabel"
          />
        </form>
      </div>
      <nav class="nav-main">
        <template v-if="showCustomerNav">
          <a href="#" class="nav-link" @click.prevent="noop">Liefergebiet</a>
          <router-link v-if="showShop" to="/shop" class="nav-link">Shop</router-link>
          <router-link v-if="showCart" to="/cart" class="nav-link nav-cart-link">
            Warenkorb
            <span v-if="cartStore.itemCount" class="nav-cart-badge">{{ cartStore.itemCount }}</span>
          </router-link>
        </template>
        <router-link v-else to="/lieferauftraege" class="nav-link">Lieferaufträge</router-link>
        <template v-if="!isLoading">
          <button
            v-if="!isAuthenticated"
            type="button"
            class="nav-link nav-auth-btn"
            @click="handleLogin"
          >
            Anmelden
          </button>
          <template v-else>
            <span v-if="isFahrer && displayName" class="nav-greeting">Hallo, {{ displayName }}</span>
            <router-link v-if="isAdmin" to="/admin" class="nav-link nav-profile-link">
              Administration
            </router-link>
            <router-link v-if="showMyOrders" to="/orders" class="nav-link nav-profile-link">
              Meine Bestellungen
            </router-link>
            <router-link to="/profile" class="nav-link nav-profile-link">Mein Profil</router-link>
            <button type="button" class="nav-link nav-auth-btn" @click="handleLogout">Abmelden</button>
          </template>
        </template>
        <Button v-if="!isAuthenticated" variant="register" href="#" @click="noop">Registrieren</Button>
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

.nav-main .nav-link {
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.15s ease, color 0.15s ease, font-weight 0.15s ease;
}

.nav-main .nav-link:hover,
.nav-main .nav-link.router-link-active {
  color: var(--moss-dark);
  font-weight: 700;
  transform: scale(1.05);
}

.nav-greeting {
  font-size: 0.88rem;
  color: var(--ink);
}

.nav-auth-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

.nav-profile-link {
  /* inherits .nav-link */
}

.nav-cart-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-cart-badge {
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--terracotta);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.15rem;
  text-align: center;
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
