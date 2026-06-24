<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  buildProductPayload,
  deleteProduct,
  fetchCategories,
  fetchCategoryTranslations,
  fetchRawProductById,
  updateProduct,
} from '@/api/backend.js'
import { getProductDisplayImage, isPlaceholderImageUrl } from '@/productImages.js'
import { notifyError, notifySuccess, notifyWarning } from '@/composables/useNotification.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { useProductImageUpload } from '@/composables/useProductImageUpload.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const form = ref({
  id: null,
  title: '',
  price: 0,
  imageUrl: '',
  description: '',
  categoryId: '',
})
const categories = ref([])
const translations = ref({})
const loading = ref(true)

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
  await Promise.all([loadCategories(), loadTranslations(), loadProduct()])
  loading.value = false
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

async function loadProduct() {
  try {
    const data = await fetchRawProductById(route.params.id)
    const rawImageUrl = data.imageUrl ?? ''
    form.value = {
      id: data.id,
      title: data.title ?? '',
      price: data.price ?? 0,
      imageUrl: isPlaceholderImageUrl(rawImageUrl) ? '' : rawImageUrl,
      description: data.description ?? '',
      categoryId: data.category?.id ?? '',
    }
  } catch (error) {
    console.error('Fehler beim Laden des Produkts:', error)
    notifyError('Produkt konnte nicht geladen werden.')
    router.push('/shop')
  }
}

function categoryLabel(category) {
  return translations.value[category.shopCategory] || category.title
}

async function submitUpdate() {
  if (!form.value.categoryId) {
    notifyWarning('Bitte eine Kategorie wählen.')
    return
  }
  try {
    const token = await getAccessTokenSilently()
    await updateProduct(form.value.id, buildProductPayload(form.value), token)
    notifySuccess('Produkt erfolgreich aktualisiert.')
    setTimeout(() => router.push('/shop'), 1200)
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error)
    notifyError('Produkt konnte nicht aktualisiert werden.')
  }
}

async function submitDelete() {
  if (!confirm('Möchten Sie dieses Produkt wirklich löschen?')) return
  try {
    const token = await getAccessTokenSilently()
    await deleteProduct(form.value.id, token)
    notifySuccess('Produkt erfolgreich gelöscht.')
    setTimeout(() => router.push('/shop'), 1200)
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error)
    notifyError('Produkt konnte nicht gelöscht werden.')
  }
}
</script>

<template>
  <section class="product-form-page">
    <p v-if="loading" class="section-text">Produkt wird geladen …</p>
    <template v-else>
      <h2>Produkt bearbeiten</h2>
      <div class="product-form-preview">
        <img :src="previewImage.imageUrl" :alt="previewImage.imageAlt" />
      </div>
      <form class="product-form" @submit.prevent="submitUpdate">
        <div class="product-form-field">
          <label for="productId">Produkt-ID</label>
          <input id="productId" :value="form.id" type="text" readonly />
        </div>
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
            Optional: eigenes Bild hochladen (max. 3 MB). Ohne Upload wird das Standardbild zum
            Produktnamen verwendet.
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
          <Button type="submit" variant="primary">Aktualisieren</Button>
          <Button type="button" variant="danger" @click="submitDelete">Löschen</Button>
        </div>
      </form>
    </template>
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
