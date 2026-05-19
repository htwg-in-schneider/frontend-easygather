<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SpecialBanner from '@/components/SpecialBanner.vue'

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <Navbar />
  <SpecialBanner />
  <main>
    <router-view />
  </main>
  <Footer @noop="noop" />
</template>

<style scoped></style>
