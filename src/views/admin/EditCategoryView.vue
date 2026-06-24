<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  buildCategoryPayload,
  fetchCategoryById,
  updateCategory,
} from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
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
})
const loading = ref(true)

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  try {
    const data = await fetchCategoryById(route.params.id)
    form.value.title = data.title ?? ''
    form.value.shopCategory = data.shopCategory ?? ''
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

    <form v-else class="admin-form card" @submit.prevent="onSubmit">
      <div class="product-form-field">
        <label for="categoryTitle">Titel <span class="field-required">*</span></label>
        <input id="categoryTitle" v-model="form.title" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="shopCategory">Shop-Schlüssel <span class="field-required">*</span></label>
        <input id="shopCategory" v-model="form.shopCategory" type="text" required />
      </div>
      <div class="checkout-form-actions">
        <Button type="submit" variant="primary">Speichern</Button>
        <NavButton to="/admin/categories" variant="secondary">Abbrechen</NavButton>
      </div>
    </form>
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
</style>
