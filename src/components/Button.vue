<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
  href: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :type="href ? undefined : type"
    :class="['btn', `btn-${variant}`]"
    @click="emit('click', $event)"
  >
    <slot />
  </component>
</template>
