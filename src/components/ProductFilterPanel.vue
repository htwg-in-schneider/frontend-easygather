<script setup>
import { ref, onMounted } from 'vue'
import { fetchCategories, fetchCategoryTranslations } from '@/api/backend.js'
import Button from '@/components/Button.vue'

const selectedCategory = defineModel('shopCategory', { type: String, default: '' })
const maxPrice = defineModel('maxPrice', { type: String, default: '' })

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['apply', 'reset'])

const categories = ref([])
const translations = ref({})

onMounted(async () => {
  await Promise.all([loadCategories(), loadTranslations()])
})

async function loadCategories() {
  try {
    categories.value = await fetchCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function loadTranslations() {
  try {
    translations.value = await fetchCategoryTranslations()
  } catch (error) {
    console.error('Error fetching translations:', error)
  }
}

function categoryLabel(category) {
  return translations.value[category.shopCategory] || category.title
}

function applyFilter() {
  emit('apply')
}

function resetFilter() {
  selectedCategory.value = ''
  maxPrice.value = ''
  emit('reset')
}
</script>

<template>
  <div v-show="open" class="shop-filter-panel" role="region" aria-label="Produktfilter">
    <h3 class="shop-filter-heading">Filter</h3>

    <div class="shop-filter-field">
      <label for="filterCategory">Kategorie</label>
      <select id="filterCategory" v-model="selectedCategory" class="shop-filter-select">
        <option value="">Alle Kategorien</option>
        <option v-for="category in categories" :key="category.id" :value="category.shopCategory">
          {{ categoryLabel(category) }}
        </option>
      </select>
    </div>

    <div class="shop-filter-field">
      <label for="filterMaxPrice">Maximalpreis (EUR)</label>
      <input
        id="filterMaxPrice"
        v-model="maxPrice"
        type="number"
        min="0"
        step="1"
        class="shop-filter-input"
        placeholder="z. B. 30"
      />
      <p class="shop-filter-hint">Nur Produkte mit Preis ≤ eingegebenem Betrag.</p>
    </div>

    <Button type="button" variant="primary" class="shop-filter-apply" @click="applyFilter">
      Filter anwenden
    </Button>
    <Button type="button" variant="secondary" class="shop-filter-reset" @click="resetFilter">
      Zurücksetzen
    </Button>
  </div>
</template>
