<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SpecialBanner from '@/components/SpecialBanner.vue'
import { useUserProfile } from '@/composables/useUserProfile.js'

const route = useRoute()
const { isFahrer } = useUserProfile()
const showBanner = computed(() => !isFahrer.value && route.path !== '/lieferauftraege')

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <Navbar />
  <SpecialBanner v-if="showBanner" />
  <main>
    <router-view />
  </main>
  <Footer @noop="noop" />
</template>

<style scoped></style>
