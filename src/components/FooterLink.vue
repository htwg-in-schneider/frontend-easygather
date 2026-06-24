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
    default: '',
  },
  to: {
    type: [String, Object],
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <router-link
    v-if="to"
    :to="to"
    class="footer-link"
    :aria-label="label || text"
    @click="emit('click', $event)"
  >
    {{ text }}
  </router-link>
  <a
    v-else
    :href="href || '#'"
    class="footer-link"
    :aria-label="label || text"
    @click="emit('click', $event)"
  >
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
