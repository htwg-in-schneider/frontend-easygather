<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  buildCategoryPayload,
  fetchCategoryById,
  updateCategory,
} from '@/api/backend.js'
import { getCategoryDisplayImage } from '@/categoryImages.js'
import { isPlaceholderImageUrl } from '@/productImages.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { useProductImageUpload } from '@/composables/useProductImageUpload.js'
import { notifyError, notifySuccess, notifyWarning } from '@/composables/useNotification.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const form = ref({
  title: '',
  shopCategory: '',
  imageUrl: '',
})
const loading = ref(true)

const { onImageFileChange, clearCustomImage } = useProductImageUpload(form)

const previewImage = computed(() =>
  getCategoryDisplayImage({
    title: form.value.title,
    shopCategory: form.value.shopCategory,
    imageUrl: form.value.imageUrl,
  }),
)

const hasCustomImage = computed(
  () => form.value.imageUrl && !isPlaceholderImageUrl(form.value.imageUrl),
)

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  try {
    const data = await fetchCategoryById(route.params.id)
    const rawImageUrl = data.imageUrl ?? ''
    form.value = {
      title: data.title ?? '',
      shopCategory: data.shopCategory ?? '',
      imageUrl: isPlaceholderImageUrl(rawImageUrl) ? '' : rawImageUrl,
    }
  } catch (err) {
    console.error('Could not load category:', err)
    notifyError('Kategorie konnte nicht geladen werden.')
    router.replace('/admin/categories')
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  if (!form.value.title.trim() || !form.value.shopCategory.trim()) {
    notifyWarning('Bitte fülle alle Pflichtfelder aus.')
    return
  }
  try {
    const token = await getAccessTokenSilently()
    await updateCategory(route.params.id, buildCategoryPayload(form.value), token)
    notifySuccess('Kategorie wurde gespeichert.')
    router.push('/admin/categories')
  } catch (err) {
    console.error('Update category failed:', err)
    notifyError('Kategorie konnte nicht gespeichert werden.')
  }
}
</script>

<template>
  <section class="admin-page">
    <header class="admin-header">
      <NavButton to="/admin/categories" variant="secondary" class="admin-back">← Kategorien</NavButton>
      <h2>Kategorie bearbeiten</h2>
    </header>

    <p v-if="loading" class="section-text">Wird geladen …</p>

    <template v-else>
      <div class="product-form-preview">
        <img :src="previewImage.imageUrl" :alt="previewImage.imageAlt" />
      </div>

      <form class="admin-form card" @submit.prevent="onSubmit">
        <div class="product-form-field">
          <label for="categoryTitle">Titel <span class="field-required">*</span></label>
          <input id="categoryTitle" v-model="form.title" type="text" required />
        </div>
        <div class="product-form-field">
          <label for="shopCategory">Shop-Schlüssel <span class="field-required">*</span></label>
          <input id="shopCategory" v-model="form.shopCategory" type="text" required />
        </div>
        <div class="product-form-field">
          <label for="categoryImage">Kategoriebild</label>
          <input id="categoryImage" type="file" accept="image/*" @change="onImageFileChange" />
          <small class="field-hint">
            Optional: eigenes Bild hochladen (max. 3 MB). Ohne Upload wird das Standardbild zum Shop-Schlüssel
            verwendet.
          </small>
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
        <div class="checkout-form-actions">
          <Button type="submit" variant="primary">Speichern</Button>
          <NavButton to="/admin/categories" variant="secondary">Abbrechen</NavButton>
        </div>
      </form>
    </template>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.admin-header {
  margin-bottom: 1rem;
}

.admin-back {
  margin-bottom: 0.65rem;
}

.admin-form {
  padding: 1rem;
  display: grid;
  gap: 0.85rem;
}

.field-hint {
  color: var(--muted);
  font-size: 0.85rem;
}

.clear-image-btn {
  margin-top: 0.5rem;
}
</style>
