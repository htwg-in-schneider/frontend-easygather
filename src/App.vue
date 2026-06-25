<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SpecialBanner from '@/components/SpecialBanner.vue'
import AppAlert from '@/components/AppAlert.vue'
import { useUserProfile } from '@/composables/useUserProfile.js'
import { useAuthLogin } from '@/composables/useAuthLogin.js'
import { useCartStore, resolveCartUserKey } from '@/stores/cart.js'

const route = useRoute()
const { isFahrer, isAdmin } = useUserProfile()
const showBanner = computed(
  () => !isFahrer.value && !isAdmin.value && route.path !== '/lieferauftraege',
)

const auth0 = useAuth0()
const isAuthenticated = auth0?.isAuthenticated
const isLoading = auth0?.isLoading
const user = auth0?.user
const cartStore = useCartStore()
const { completeReturnAfterLogin } = useAuthLogin()

watch(
  () => [isLoading?.value, isAuthenticated?.value, user?.value?.sub],
  ([loading]) => {
    if (loading) {
      return
    }
    cartStore.switchAccount(
      resolveCartUserKey(isAuthenticated?.value, user?.value?.sub),
    )
  },
  { immediate: true },
)

watch(
  () => isAuthenticated?.value,
  (value) => {
    completeReturnAfterLogin(value)
  },
  { immediate: true },
)

</script>

<template>
  <Navbar />
  <AppAlert />
  <SpecialBanner v-if="showBanner" />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<style scoped></style>
