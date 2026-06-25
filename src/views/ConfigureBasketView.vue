<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts } from '@/api/backend.js'
import { useCartStore } from '@/stores/cart.js'
import { useConfigureBasketDraftStore } from '@/stores/configureBasketDraft.js'
import { getCartItemImage } from '@/productImages.js'
import {
  CONFIGURABLE_BASKET_TITLE,
  PICKNICK_ACCESSORY_TITLES,
} from '@/config/basketConfigurator.js'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const cartStore = useCartStore()
const draftStore = useConfigureBasketDraftStore()

const loading = ref(true)
const error = ref(null)
const foodProducts = ref([])
const accessoryProducts = ref([])

const allProducts = computed(() => [...foodProducts.value, ...accessoryProducts.value])

const selectedLines = computed(() =>
  allProducts.value.filter((product) => draftStore.quantityFor(product.id) > 0),
)

const subtotal = computed(() =>
  selectedLines.value.reduce(
    (sum, product) => sum + product.price * draftStore.quantityFor(product.id),
    0,
  ),
)

onMounted(() => {
  loadProducts()
})

function withDisplayImage(product) {
  const { imageUrl, imageAlt } = getCartItemImage(product.title)
  return { ...product, imageUrl, imageAlt }
}

async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    const [food, picknick] = await Promise.all([
      fetchProducts({ shopCategory: 'essen-getraenke' }),
      fetchProducts({ shopCategory: 'picknickkoerbe' }),
    ])
    foodProducts.value = food.map(withDisplayImage)
    accessoryProducts.value = picknick
      .filter((product) => PICKNICK_ACCESSORY_TITLES.includes(product.title))
      .sort(
        (a, b) =>
          PICKNICK_ACCESSORY_TITLES.indexOf(a.title) - PICKNICK_ACCESSORY_TITLES.indexOf(b.title),
      )
      .map(withDisplayImage)
    draftStore.ensureProducts(allProducts.value.map((product) => product.id))
  } catch (err) {
    console.error('Error loading configurator products:', err)
    error.value = 'Produkte konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function formatPrice(amount) {
  return `${Number(amount).toFixed(2).replace('.', ',')} €`
}

function addToCart() {
  if (!selectedLines.value.length) {
    return
  }
  for (const product of selectedLines.value) {
    cartStore.addToCartWithQuantity(product, draftStore.quantityFor(product.id))
  }
  draftStore.clear()
  router.push('/cart')
}
</script>

<template>
  <section class="checkout-flow configure-basket-page">
    <header class="checkout-flow-header">
      <NavButton :to="{ path: '/shop', query: { category: 'picknickkoerbe' } }" variant="secondary">
        ← Zurück zu Picknickkörben
      </NavButton>
      <h2>{{ CONFIGURABLE_BASKET_TITLE }}</h2>
      <p class="section-text">
        Wähle einzelne Produkte aus Essen & Getränke und Korb-Zubehör – ohne festes Paket, ganz nach deinem
        Geschmack.
      </p>
    </header>

    <p v-if="loading" class="section-text">Produkte werden geladen …</p>
    <p v-else-if="error" class="section-text">{{ error }}</p>

    <div v-else class="configure-basket-layout">
      <div class="configure-basket-sections">
        <section class="configure-basket-section card">
          <h3>Essen & Getränke</h3>
          <ul class="configure-basket-list">
            <li
              v-for="product in foodProducts"
              :key="product.id"
              class="configure-basket-item"
              :class="{ 'configure-basket-item--with-image': product.imageUrl }"
            >
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.imageAlt"
                class="configure-basket-item-image"
              />
              <div class="configure-basket-item-body">
                <h4>{{ product.title }}</h4>
                <p>{{ product.description }}</p>
                <span class="configure-basket-price">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="configure-basket-qty" :aria-label="`Menge für ${product.title}`">
                <button type="button" class="configure-qty-btn" @click="draftStore.changeQuantity(product.id, -1)">
                  −
                </button>
                <span class="configure-qty-value">{{ draftStore.quantityFor(product.id) }}</span>
                <button type="button" class="configure-qty-btn" @click="draftStore.changeQuantity(product.id, 1)">
                  +
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section class="configure-basket-section card">
          <h3>Korb-Zubehör</h3>
          <p class="configure-basket-hint">Servietten, Picknickdecke, Kerzen und Mehrwegbecher.</p>
          <ul class="configure-basket-list">
            <li
              v-for="product in accessoryProducts"
              :key="product.id"
              class="configure-basket-item"
              :class="{ 'configure-basket-item--with-image': product.imageUrl }"
            >
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.imageAlt"
                class="configure-basket-item-image"
              />
              <div class="configure-basket-item-body">
                <h4>{{ product.title }}</h4>
                <p>{{ product.description }}</p>
                <span class="configure-basket-price">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="configure-basket-qty" :aria-label="`Menge für ${product.title}`">
                <button type="button" class="configure-qty-btn" @click="draftStore.changeQuantity(product.id, -1)">
                  −
                </button>
                <span class="configure-qty-value">{{ draftStore.quantityFor(product.id) }}</span>
                <button type="button" class="configure-qty-btn" @click="draftStore.changeQuantity(product.id, 1)">
                  +
                </button>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <aside class="configure-basket-summary card">
        <h3>Dein Korb</h3>
        <p v-if="!selectedLines.length" class="section-text">Noch keine Produkte ausgewählt.</p>
        <ul v-else class="configure-basket-summary-list">
          <li v-for="product in selectedLines" :key="product.id" class="configure-basket-summary-line">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.imageAlt"
              class="configure-basket-summary-thumb"
            />
            <span class="configure-basket-summary-label">
              {{ draftStore.quantityFor(product.id) }}× {{ product.title }}
            </span>
            <span>{{ formatPrice(product.price * draftStore.quantityFor(product.id)) }}</span>
          </li>
        </ul>
        <div class="configure-basket-summary-total">
          <span>Zwischensumme</span>
          <strong>{{ formatPrice(subtotal) }}</strong>
        </div>
        <Button variant="primary" class="configure-basket-submit" :disabled="!selectedLines.length" @click="addToCart">
          In den Warenkorb
        </Button>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.configure-basket-layout {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 52rem) {
  .configure-basket-layout {
    grid-template-columns: minmax(0, 2fr) minmax(15rem, 0.72fr);
    align-items: start;
  }
}

.configure-basket-sections {
  display: grid;
  gap: 1.1rem;
}

.configure-basket-section {
  padding: 1.35rem 1.5rem;
}

.configure-basket-section h3 {
  margin: 0 0 0.35rem;
  font-family: "Fraunces", Georgia, serif;
}

.configure-basket-section h3 + .configure-basket-list {
  margin-top: 0.5rem;
}

.configure-basket-hint {
  margin: 0 0 1rem;
  color: var(--muted);
}

.configure-basket-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.configure-basket-item {
  display: grid;
  gap: 0.85rem 1.25rem;
  padding-top: 0.95rem;
  border-top: 1px solid rgba(61, 107, 79, 0.12);
}

.configure-basket-item:first-child {
  padding-top: 0;
  border-top: none;
}

.configure-basket-item-image {
  width: 4.5rem;
  height: 4.5rem;
  object-fit: cover;
  border-radius: 0.65rem;
}

@media (min-width: 40rem) {
  .configure-basket-item {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .configure-basket-item--with-image {
    grid-template-columns: 4.5rem minmax(0, 1fr) auto;
  }
}

.configure-basket-item-body h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.configure-basket-item-body p {
  margin: 0 0 0.35rem;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 36rem;
}

.configure-basket-price {
  color: var(--terracotta);
  font-weight: 700;
}

.configure-basket-qty {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.2rem 0.35rem;
  border: 1px solid rgba(31, 45, 36, 0.14);
  border-radius: 999px;
  background: #fff;
}

.configure-qty-btn {
  width: 1.8rem;
  height: 1.8rem;
  border: none;
  border-radius: 999px;
  background: rgba(61, 107, 79, 0.08);
  cursor: pointer;
  font: inherit;
  font-size: 1.05rem;
  line-height: 1;
}

.configure-qty-btn:hover {
  background: rgba(61, 107, 79, 0.16);
}

.configure-qty-value {
  min-width: 1.2rem;
  text-align: center;
  font-weight: 700;
}

.configure-basket-summary {
  padding: 1.15rem;
  display: grid;
  gap: 0.75rem;
}

.configure-basket-summary h3 {
  margin: 0;
}

.configure-basket-summary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.configure-basket-summary-line {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.5rem 0.75rem;
  align-items: center;
  color: var(--muted);
}

.configure-basket-summary-line:not(:has(.configure-basket-summary-thumb)) {
  grid-template-columns: minmax(0, 1fr) auto;
}

.configure-basket-summary-thumb {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 0.45rem;
}

.configure-basket-summary-label {
  min-width: 0;
}

.configure-basket-summary-total {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(61, 107, 79, 0.15);
  font-weight: 700;
}

.configure-basket-summary-total strong {
  color: var(--terracotta);
}

.configure-basket-submit {
  width: 100%;
}
</style>
