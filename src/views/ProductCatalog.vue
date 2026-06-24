<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchProducts, fetchCategoryTranslations, fetchProfile } from '@/api/backend.js'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilterPanel from '@/components/ProductFilterPanel.vue'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()

const products = ref([])
const loading = ref(true)
const error = ref(null)
const searchName = ref('')
const selectedCategory = ref('')
const selectedMaxPrice = ref('')
const filterOpen = ref(false)
const translations = ref({})
const isAdmin = ref(false)

const displayedProducts = computed(() => products.value)

const activeCategoryLabel = computed(() => {
  if (!selectedCategory.value) return ''
  return translations.value[selectedCategory.value] || selectedCategory.value
})

const activePriceLabel = computed(() => {
  if (!selectedMaxPrice.value) return ''
  return `bis ${selectedMaxPrice.value} EUR`
})

onMounted(async () => {
  await loadTranslations()
  syncCategoryFromRoute()
  syncSearchFromRoute()
  syncMaxPriceFromRoute()
  await loadProducts(currentFilters())
  await checkAdminRole()
})

watch(
  () => [route.query.category, route.query.name, route.query.maxPrice],
  () => {
    syncCategoryFromRoute()
    syncSearchFromRoute()
    syncMaxPriceFromRoute()
    loadProducts(currentFilters())
  },
)

watch(isAuthenticated, () => {
  checkAdminRole()
})

async function checkAdminRole() {
  isAdmin.value = false
  if (!isAuthenticated.value) {
    return
  }
  try {
    const token = await getAccessTokenSilently()
    const profile = await fetchProfile(token)
    isAdmin.value = profile.role === 'ADMIN'
  } catch (err) {
    console.error('Error checking admin role:', err)
  }
}

async function loadTranslations() {
  try {
    translations.value = await fetchCategoryTranslations()
  } catch (err) {
    console.error('Error fetching translations:', err)
  }
}

function syncCategoryFromRoute() {
  const category = route.query.category
  selectedCategory.value = typeof category === 'string' ? category : ''
}

function syncSearchFromRoute() {
  const name = route.query.name
  searchName.value = typeof name === 'string' ? name : ''
}

function syncMaxPriceFromRoute() {
  const maxPrice = route.query.maxPrice
  selectedMaxPrice.value = typeof maxPrice === 'string' ? maxPrice : ''
}

function currentFilters() {
  return {
    name: searchName.value,
    shopCategory: selectedCategory.value,
    maxPrice: selectedMaxPrice.value || null,
  }
}

async function loadProducts(filters = {}) {
  loading.value = true
  error.value = null
  try {
    products.value = await fetchProducts(filters)
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Produkte konnten nicht geladen werden.'
    products.value = []
  } finally {
    loading.value = false
  }
}

function toggleFilter() {
  filterOpen.value = !filterOpen.value
}

function closeFilter() {
  filterOpen.value = false
}

function applyFilters() {
  filterOpen.value = false
  updateFiltersInUrl()
  loadProducts(currentFilters())
}

function resetFilters() {
  filterOpen.value = false
  selectedCategory.value = ''
  selectedMaxPrice.value = ''
  updateFiltersInUrl()
  loadProducts(currentFilters())
}

function updateFiltersInUrl() {
  const query = {}
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  if (searchName.value.trim()) {
    query.name = searchName.value.trim()
  }
  if (selectedMaxPrice.value) {
    query.maxPrice = selectedMaxPrice.value
  }
  router.replace({ path: '/shop', query })
}
</script>

<template>
  <section id="shop-produkte">
    <div class="shop-section-header">
      <div class="shop-section-intro">
        <h2>Produkte</h2>
        <p class="section-text">
          Picknickkörbe, Party & Event sowie Essen & Getränke – alles in einer Bestellung.
        </p>
        <p v-if="activeCategoryLabel || activePriceLabel || searchName" class="shop-active-filter">
          <span v-if="activeCategoryLabel">Kategorie: <strong>{{ activeCategoryLabel }}</strong></span>
          <span v-if="activeCategoryLabel && (activePriceLabel || searchName)"> · </span>
          <span v-if="activePriceLabel">Preis: <strong>{{ activePriceLabel }}</strong></span>
          <span v-if="activePriceLabel && searchName"> · </span>
          <span v-if="searchName">Suche: <strong>{{ searchName }}</strong></span>
        </p>
        <NavButton v-if="isAdmin" to="/product/create" variant="primary" class="shop-create-btn">
          Neues Produkt
        </NavButton>
      </div>
      <Button
        type="button"
        variant="secondary"
        class="basket-filter-toggle"
        :aria-expanded="filterOpen"
        @click="toggleFilter"
      >
        Filter
      </Button>
    </div>

    <ProductFilterPanel
      v-model:shop-category="selectedCategory"
      v-model:max-price="selectedMaxPrice"
      :open="filterOpen"
      @apply="applyFilters"
      @reset="resetFilters"
      @close="closeFilter"
    />

    <p v-if="loading" class="section-text">Produkte werden geladen …</p>
    <p v-else-if="error" class="section-text">{{ error }}</p>
    <p v-else-if="displayedProducts.length === 0" class="section-text">Keine Produkte gefunden.</p>

    <div v-if="displayedProducts.length" class="basket-grid">
      <ProductCard
        v-for="product in displayedProducts"
        :key="product.id"
        :product="product"
        :show-edit-button="isAdmin"
      />
    </div>
  </section>
</template>
