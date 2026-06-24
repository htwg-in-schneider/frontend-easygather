<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { deleteCategory, fetchCategories } from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { notifyError, notifySuccess } from '@/composables/useNotification.js'
import ConfirmModal from '@/components/ConfirmModal.vue'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const confirmOpen = ref(false)
const categoryToDelete = ref(null)

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  await loadCategories()
})

async function loadCategories() {
  loading.value = true
  try {
    categories.value = await fetchCategories({ title: searchQuery.value })
  } catch (err) {
    console.error('Could not load categories:', err)
    notifyError('Kategorien konnten nicht geladen werden.')
  } finally {
    loading.value = false
  }
}

function onSearchSubmit() {
  loadCategories()
}

function openDeleteConfirm(category) {
  categoryToDelete.value = category
  confirmOpen.value = true
}

function closeDeleteConfirm() {
  confirmOpen.value = false
  categoryToDelete.value = null
}

const deleteMessage = () => {
  if (!categoryToDelete.value) {
    return ''
  }
  const count = categoryToDelete.value.productCount ?? 0
  if (count === 0) {
    return `Möchtest du die Kategorie „${categoryToDelete.value.title}“ wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
  }
  const productLabel = count === 1 ? '1 Produkt' : `${count} Produkte`
  return `Die Kategorie „${categoryToDelete.value.title}“ enthält noch ${productLabel}. Beim Löschen werden die Kategorie und alle zugehörigen Produkte dauerhaft entfernt. Möchtest du fortfahren?`
}

async function confirmDelete() {
  if (!categoryToDelete.value) {
    return
  }
  try {
    const token = await getAccessTokenSilently()
    await deleteCategory(categoryToDelete.value.id, token)
    notifySuccess('Kategorie wurde gelöscht.')
    closeDeleteConfirm()
    await loadCategories()
  } catch (err) {
    console.error('Delete category failed:', err)
    notifyError('Kategorie konnte nicht gelöscht werden.')
  }
}
</script>

<template>
  <section class="admin-page">
    <header class="admin-header">
      <NavButton to="/admin" variant="secondary" class="admin-back">← Administration</NavButton>
      <h2>Kategorien</h2>
      <p class="section-text">Kategorien anlegen, bearbeiten, suchen und löschen.</p>
    </header>

    <div class="admin-toolbar">
      <form class="admin-search" role="search" @submit.prevent="onSearchSubmit">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Nach Titel oder Shop-Schlüssel suchen …"
          aria-label="Kategorien suchen"
        />
        <Button type="submit" variant="secondary">Suchen</Button>
      </form>
      <NavButton to="/admin/categories/create" variant="primary">Neue Kategorie</NavButton>
    </div>

    <p v-if="loading" class="section-text">Kategorien werden geladen …</p>

    <div v-else-if="!categories.length" class="checkout-empty card">
      <p class="checkout-empty-title">Keine Kategorien gefunden</p>
      <p class="section-text">Passe die Suche an oder lege eine neue Kategorie an.</p>
    </div>

    <div v-else class="admin-table-wrap card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Shop-Schlüssel</th>
            <th>Produkte</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.title }}</td>
            <td><code>{{ category.shopCategory }}</code></td>
            <td>{{ category.productCount ?? 0 }}</td>
            <td class="admin-actions">
              <NavButton :to="`/admin/categories/edit/${category.id}`" variant="secondary">
                Bearbeiten
              </NavButton>
              <button type="button" class="btn btn-danger btn-sm" @click="openDeleteConfirm(category)">
                Löschen
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      :open="confirmOpen"
      title="Kategorie löschen"
      :message="deleteMessage()"
      confirm-label="Endgültig löschen"
      cancel-label="Abbrechen"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirm"
    />
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.admin-header {
  margin-bottom: 1rem;
}

.admin-back {
  margin-bottom: 0.65rem;
}

.admin-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.admin-search {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1 1 16rem;
}

.admin-search input {
  flex: 1 1 12rem;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(31, 45, 36, 0.18);
  border-radius: 0.5rem;
  font: inherit;
}

.admin-table-wrap {
  overflow-x: auto;
  padding: 0;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.admin-table th,
.admin-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(61, 107, 79, 0.12);
}

.admin-table th {
  font-weight: 700;
  color: var(--moss-dark);
  background: rgba(235, 228, 214, 0.35);
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.btn-sm {
  padding: 0.35rem 0.65rem;
  font-size: 0.85rem;
}
</style>
