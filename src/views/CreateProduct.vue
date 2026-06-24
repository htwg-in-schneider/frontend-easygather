<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  buildProductPayload,
  createProduct,
  fetchCategories,
  fetchCategoryTranslations,
} from '@/api/backend.js'
import { getProductDisplayImage, isPlaceholderImageUrl } from '@/productImages.js'
import { notifyError, notifySuccess, notifyWarning } from '@/composables/useNotification.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { useProductImageUpload } from '@/composables/useProductImageUpload.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const form = ref({
  title: '',
  price: 0,
  imageUrl: '',
  description: '',
  categoryId: '',
})
const categories = ref([])
const translations = ref({})

const { onImageFileChange, clearCustomImage } = useProductImageUpload(form)

const previewImage = computed(() => {
  const category = categories.value.find((c) => c.id === form.value.categoryId)
  return getProductDisplayImage({
    title: form.value.title,
    category,
    imageUrl: form.value.imageUrl,
  })
})

const hasCustomImage = computed(
  () => form.value.imageUrl && !isPlaceholderImageUrl(form.value.imageUrl),
)

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
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

async function submitCreate() {
  if (!form.value.categoryId) {
    notifyWarning('Bitte eine Kategorie wählen.')
    return
  }
  try {
    const token = await getAccessTokenSilently()
    await createProduct(buildProductPayload(form.value), token)
    notifySuccess('Produkt erfolgreich erstellt.')
    setTimeout(() => router.push('/shop'), 1200)
  } catch (error) {
    console.error('Fehler beim Erstellen des Produkts:', error)
    notifyError('Produkt konnte nicht erstellt werden.')
  }
}
</script>

<template>
  <section class="product-form-page">
    <h2>Neues Produkt erstellen</h2>
    <div class="product-form-preview">
      <img :src="previewImage.imageUrl" :alt="previewImage.imageAlt" />
    </div>
    <form class="product-form" @submit.prevent="submitCreate">
      <div class="product-form-field">
        <label for="productName">Name</label>
        <input id="productName" v-model="form.title" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="productCategory">Kategorie</label>
        <select id="productCategory" v-model="form.categoryId" required>
          <option disabled value="">Bitte wählen</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ categoryLabel(category) }}
          </option>
        </select>
      </div>
      <div class="product-form-field">
        <label for="productPrice">Preis</label>
        <input id="productPrice" v-model.number="form.price" type="number" min="0" step="0.01" required />
      </div>
      <div class="product-form-field">
        <label for="productImage">Produktbild</label>
        <input id="productImage" type="file" accept="image/*" @change="onImageFileChange" />
        <p class="field-hint">
          Optional: eigenes Bild hochladen (max. 3 MB). Ohne Upload wird das Standardbild zur Kategorie
          verwendet.
        </p>
        <Button
          v-if="hasCustomImage"
          type="button"
          variant="secondary"
          class="clear-image-btn"
          @click="clearCustomImage"
        >
          Eigenes Bild entfernen
        </Button>
      </div>
      <div class="product-form-field">
        <label for="productDescription">Beschreibung</label>
        <textarea id="productDescription" v-model="form.description" rows="4" />
      </div>
      <div class="product-form-actions">
        <NavButton to="/shop" variant="secondary">Abbrechen</NavButton>
        <Button type="submit" variant="primary">Erstellen</Button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.field-hint {
  margin: 0.35rem 0 0;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.45;
}

.clear-image-btn {
  margin-top: 0.5rem;
}
</style>
