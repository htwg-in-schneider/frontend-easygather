<script setup>
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SpecialBanner from '@/components/SpecialBanner.vue'
import AppAlert from '@/components/AppAlert.vue'
import { useAuthLogin } from '@/composables/useAuthLogin.js'
import { useCartStore, resolveCartUserKey } from '@/stores/cart.js'

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

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <Navbar />
  <AppAlert />
  <SpecialBanner />
  <main>
    <router-view />
  </main>
  <Footer @noop="noop" />
</template>

<style scoped></style>
