<script setup>
import { notificationState, dismissNotification } from '@/composables/useNotification.js'

const typeLabels = {
  success: 'Erfolg',
  error: 'Fehler',
  warning: 'Hinweis',
  info: 'Info',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="app-alert-fade">
      <div
        v-if="notificationState.message"
        class="app-alert"
        :class="`app-alert-${notificationState.type}`"
        role="status"
        :aria-label="typeLabels[notificationState.type] ?? 'Hinweis'"
      >
        <p>{{ notificationState.message }}</p>
        <button type="button" class="app-alert-close" aria-label="Schließen" @click="dismissNotification">
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-alert {
  position: fixed;
  top: 5.5rem;
  left: 50%;
  z-index: 180;
  width: min(calc(100% - 2rem), 36rem);
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  box-shadow: 0 10px 28px rgba(31, 45, 36, 0.14);
}

@media (min-width: 52rem) {
  .app-alert {
    top: 4.25rem;
  }
}

.app-alert p {
  margin: 0;
  line-height: 1.5;
  font-weight: 600;
}

.app-alert-success {
  background: #eef6f0;
  border-color: rgba(61, 107, 79, 0.35);
  color: var(--moss-dark);
}

.app-alert-error {
  background: #fdeeed;
  border-color: rgba(163, 61, 45, 0.35);
  color: #872f22;
}

.app-alert-warning {
  background: #fdf3ea;
  border-color: rgba(201, 107, 74, 0.35);
  color: #8a4a2e;
}

.app-alert-info {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(61, 107, 79, 0.2);
  color: var(--ink);
}

.app-alert-close {
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(31, 45, 36, 0.08);
  color: inherit;
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
}

.app-alert-close:hover {
  background: rgba(31, 45, 36, 0.14);
}

.app-alert-fade-enter-active,
.app-alert-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.app-alert-fade-enter-from,
.app-alert-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
