<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  buildProductPayload,
  createProduct,
  fetchCategories,
  fetchCategoryTranslations,
} from '@/api/backend.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const router = useRouter()

const form = ref({
  title: '',
  price: 0,
  imageUrl: '',
  description: '',
  categoryId: '',
})
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

async function submitCreate() {
  if (!form.value.categoryId) {
    alert('Bitte eine Kategorie wählen.')
    return
  }
  try {
    await createProduct(buildProductPayload(form.value))
    alert('Produkt erfolgreich erstellt!')
    router.push('/shop')
  } catch (error) {
    console.error('Fehler beim Erstellen des Produkts:', error)
    alert('Produkt konnte nicht erstellt werden.')
  }
}
</script>

<template>
  <section class="product-form-page">
    <h2>Neues Produkt erstellen</h2>
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
        <label for="productImageUrl">Bild-URL</label>
        <input id="productImageUrl" v-model="form.imageUrl" type="text" />
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
