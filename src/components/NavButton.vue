<script setup>
const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  variant: {
    type: String,
    default: 'secondary',
  },
})

const buttonClass = `btn btn-${props.variant}`
</script>

<template>
  <router-link :to="to" :class="buttonClass">
    <slot />
  </router-link>
</template>
