<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchUsers } from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { notifyError } from '@/composables/useNotification.js'
import NavButton from '@/components/NavButton.vue'
import Button from '@/components/Button.vue'

const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()

const users = ref([])
const loading = ref(true)
const searchQuery = ref('')

function roleLabel(role) {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'
    case 'FAHRER':
      return 'Fahrer'
    case 'KUNDE':
      return 'Kunde'
    default:
      return role
  }
}

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  await loadUsers()
})

async function loadUsers() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    users.value = await fetchUsers(token, searchQuery.value)
  } catch (err) {
    console.error('Could not load users:', err)
    notifyError('Nutzer konnten nicht geladen werden.')
  } finally {
    loading.value = false
  }
}

function onSearchSubmit() {
  loadUsers()
}
</script>

<template>
  <section class="admin-page">
    <header class="admin-header">
      <NavButton to="/admin" variant="secondary" class="admin-back">← Administration</NavButton>
      <h2>Nutzer</h2>
      <p class="section-text">Benutzerkonten anzeigen, suchen und bearbeiten.</p>
    </header>

    <form class="admin-toolbar admin-search" role="search" @submit.prevent="onSearchSubmit">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Nach Name oder E-Mail suchen …"
        aria-label="Nutzer suchen"
      />
      <Button type="submit" variant="secondary">Suchen</Button>
    </form>

    <p v-if="loading" class="section-text">Nutzer werden geladen …</p>

    <div v-else-if="!users.length" class="checkout-empty card">
      <p class="checkout-empty-title">Keine Nutzer gefunden</p>
    </div>

    <div v-else class="admin-table-wrap card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Rolle</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ roleLabel(user.role) }}</td>
            <td>
              <NavButton :to="`/admin/users/edit/${user.id}`" variant="secondary">Bearbeiten</NavButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.admin-search input {
  flex: 1 1 14rem;
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
</style>
