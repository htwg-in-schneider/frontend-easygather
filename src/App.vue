<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <Navbar />
  <main>
    <router-view />
  </main>
  <Footer @noop="noop" />
</template>

<style scoped></style>
