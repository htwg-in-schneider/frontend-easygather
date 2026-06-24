<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Bestätigung' },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Entfernen' },
  cancelLabel: { type: String, default: 'Abbrechen' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="confirm-modal-backdrop" @click.self="emit('cancel')">
      <div class="confirm-modal card" role="dialog" aria-modal="true" :aria-label="title">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="confirm-modal-actions">
          <button type="button" class="btn btn-secondary" @click="emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button type="button" class="btn btn-danger" @click="emit('confirm')">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(31, 45, 36, 0.45);
}

.confirm-modal {
  width: min(100%, 24rem);
  padding: 1.25rem;
  display: grid;
  gap: 0.85rem;
}

.confirm-modal h3 {
  margin: 0;
  font-size: 1.2rem;
}

.confirm-modal p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.confirm-modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: flex-end;
}
</style>
