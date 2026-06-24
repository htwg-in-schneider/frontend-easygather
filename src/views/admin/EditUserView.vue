<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  buildAdminUserPayload,
  fetchUserById,
  updateUserByAdmin,
} from '@/api/backend.js'
import { useAdminAccess } from '@/composables/useAdminAccess.js'
import { useUserProfile } from '@/composables/useUserProfile.js'
import { notifyError, notifySuccess, notifyWarning } from '@/composables/useNotification.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const { ensureAdmin } = useAdminAccess()
const { profile } = useUserProfile()

const loading = ref(true)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  postalCode: '',
  city: '',
  role: 'KUNDE',
})

const roleOptions = [
  { value: 'KUNDE', label: 'Kunde' },
  { value: 'FAHRER', label: 'Fahrer' },
  { value: 'ADMIN', label: 'Administrator' },
]

const isOwnAccount = computed(
  () => profile.value?.id != null && String(profile.value.id) === String(route.params.id),
)

onMounted(async () => {
  if (!(await ensureAdmin())) {
    return
  }
  try {
    const token = await getAccessTokenSilently()
    const user = await fetchUserById(route.params.id, token)
    form.value = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      street: user.street ?? '',
      postalCode: user.postalCode ?? '',
      city: user.city ?? '',
      role: user.role ?? 'KUNDE',
    }
  } catch (err) {
    console.error('Could not load user:', err)
    notifyError('Nutzer konnte nicht geladen werden.')
    router.replace('/admin/users')
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  if (!form.value.firstName.trim() || !form.value.lastName.trim()) {
    notifyWarning('Vor- und Nachname sind Pflichtfelder.')
    return
  }
  try {
    const token = await getAccessTokenSilently()
    await updateUserByAdmin(route.params.id, buildAdminUserPayload(form.value), token)
    notifySuccess('Nutzer wurde gespeichert.')
    router.push('/admin/users')
  } catch (err) {
    console.error('Update user failed:', err)
    notifyError(err.message || 'Nutzer konnte nicht gespeichert werden.')
  }
}
</script>

<template>
  <section class="admin-page">
    <header class="admin-header">
      <NavButton to="/admin/users" variant="secondary" class="admin-back">← Nutzer</NavButton>
      <h2>Nutzer bearbeiten</h2>
    </header>

    <p v-if="loading" class="section-text">Wird geladen …</p>

    <form v-else class="admin-form card" @submit.prevent="onSubmit">
      <div class="checkout-form-grid">
        <div class="product-form-field">
          <label for="firstName">Vorname <span class="field-required">*</span></label>
          <input id="firstName" v-model="form.firstName" type="text" required />
        </div>
        <div class="product-form-field">
          <label for="lastName">Nachname <span class="field-required">*</span></label>
          <input id="lastName" v-model="form.lastName" type="text" required />
        </div>
      </div>
      <div class="product-form-field">
        <label for="email">E-Mail</label>
        <input id="email" v-model="form.email" type="email" readonly class="input-readonly" />
      </div>
      <div class="product-form-field">
        <label for="role">Rolle <span class="field-required">*</span></label>
        <select
          id="role"
          v-model="form.role"
          required
          :disabled="isOwnAccount"
          :class="{ 'input-readonly': isOwnAccount }"
        >
          <option v-for="option in roleOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p v-if="isOwnAccount" class="role-hint">
          Deine eigene Administrator-Rolle kannst du hier nicht entfernen. Bitte einen anderen
          Administrator bitten, deine Rolle zu ändern.
        </p>
      </div>
      <div class="product-form-field">
        <label for="street">Straße</label>
        <input id="street" v-model="form.street" type="text" />
      </div>
      <div class="checkout-form-grid">
        <div class="product-form-field">
          <label for="postalCode">PLZ</label>
          <input id="postalCode" v-model="form.postalCode" type="text" />
        </div>
        <div class="product-form-field">
          <label for="city">Ort</label>
          <input id="city" v-model="form.city" type="text" />
        </div>
      </div>
      <div class="checkout-form-actions">
        <Button type="submit" variant="primary">Speichern</Button>
        <NavButton to="/admin/users" variant="secondary">Abbrechen</NavButton>
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

.input-readonly {
  background: rgba(235, 228, 214, 0.45);
  color: var(--muted);
}

.role-hint {
  margin: 0.35rem 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.45;
}
</style>
