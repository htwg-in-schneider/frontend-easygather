<script setup>
import Button from '@/components/Button.vue'

const selectedStatus = defineModel('status', { type: String, default: '' })

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['apply', 'reset', 'close'])

function applyFilter() {
  emit('apply')
}

function resetFilter() {
  selectedStatus.value = ''
  emit('reset')
}

function closeFilter() {
  emit('close')
}
</script>

<template>
  <div v-show="open" class="shop-filter-panel" role="region" aria-label="Lieferstatus-Filter">
    <div class="shop-filter-header">
      <h3 class="shop-filter-heading">Filter</h3>
      <button
        type="button"
        class="shop-filter-close"
        aria-label="Filter schließen"
        @click="closeFilter"
      >
        ×
      </button>
    </div>

    <div class="shop-filter-field">
      <label for="filterDeliveryStatus">Status</label>
      <select id="filterDeliveryStatus" v-model="selectedStatus" class="shop-filter-select">
        <option value="">Alle Lieferaufträge</option>
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <p class="shop-filter-hint">Nur Lieferaufträge mit dem gewählten Status anzeigen.</p>
    </div>

    <Button type="button" variant="primary" class="shop-filter-apply" @click="applyFilter">
      Filter anwenden
    </Button>
    <Button type="button" variant="secondary" class="shop-filter-reset" @click="resetFilter">
      Zurücksetzen
    </Button>
  </div>
</template>
