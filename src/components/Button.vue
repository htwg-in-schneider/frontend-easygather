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

<style scoped>
.btn {
  display: inline-block;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.62rem 1.15rem;
  font-weight: 700;
  font-size: 0.94rem;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: center;
}

.btn-primary {
  background: var(--moss);
  color: #fff;
}

.btn-primary:hover {
  background: var(--moss-dark);
  color: #fff;
}

.btn-secondary {
  border: 2px solid var(--moss);
  color: var(--moss);
  background: transparent;
}

.btn-secondary:hover {
  background: rgba(61, 107, 79, 0.08);
}

.btn-register {
  background: var(--moss);
  color: #fff;
  padding: 0.35rem 0.8rem;
  font-size: 0.88rem;
}

.btn-register:hover {
  background: var(--moss-dark);
  color: #fff;
}
</style>
