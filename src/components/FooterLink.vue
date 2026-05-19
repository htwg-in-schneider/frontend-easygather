<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  href: {
    type: String,
    default: '#',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <a :href="href" class="footer-link" :aria-label="label || text" @click="emit('click', $event)">
    {{ text }}
  </a>
</template>

<style scoped>
.footer-link {
  color: var(--muted);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--terracotta);
}
</style>
