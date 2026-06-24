<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchProfile, updateProfile } from '@/api/backend.js'
import { notifyError, notifySuccess, notifyWarning } from '@/composables/useNotification.js'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const { getAccessTokenSilently } = useAuth0()

const form = ref({
  firstName: '',
  lastName: '',
  street: '',
  postalCode: '',
  city: '',
})
const email = ref('')
const role = ref('')
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') ?? ''
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim() ?? ''
const auth0Connection = import.meta.env.VITE_AUTH0_CONNECTION?.trim() || 'Username-Password-Authentication'
const passwordResetSending = ref(false)

function roleLabel(value) {
  switch (value) {
    case 'ADMIN':
      return 'Administrator'
    case 'FAHRER':
      return 'Fahrer'
    case 'KUNDE':
      return 'Kunde'
    default:
      return value
  }
}

async function requestPasswordResetEmail(event) {
  event?.preventDefault()

  if (!email.value || !auth0ClientId || !auth0Domain) {
    notifyWarning('Passwort-Reset ist derzeit nicht verfügbar.')
    return
  }

  passwordResetSending.value = true
  try {
    const response = await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: auth0ClientId,
        email: email.value,
        connection: auth0Connection,
      }),
    })
    if (response.ok) {
      notifySuccess(`Eine E-Mail zum Zurücksetzen des Passworts wurde an ${email.value} gesendet.`)
    } else {
      notifyError('Passwort-Reset-E-Mail konnte nicht angefordert werden.')
    }
  } catch (err) {
    console.error('Auth0 password reset failed:', err)
    notifyError('Passwort-Reset-E-Mail konnte nicht angefordert werden.')
  } finally {
    passwordResetSending.value = false
  }
}

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    const token = await getAccessTokenSilently()
    const profile = await fetchProfile(token)
    form.value = {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      street: profile.street ?? '',
      postalCode: profile.postalCode ?? '',
      city: profile.city ?? '',
    }
    email.value = profile.email ?? ''
    role.value = profile.role ?? ''
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = 'Profil konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function validateProfileForm() {
  if (!form.value.firstName.trim() || !form.value.lastName.trim()) {
    notifyWarning('Bitte gib Vor- und Nachname an.')
    return false
  }
  const plz = form.value.postalCode.trim()
  if (plz && !/^\d{5}$/.test(plz)) {
    notifyWarning('Die PLZ muss aus 5 Ziffern bestehen.')
    return false
  }
  return true
}

async function submitProfile() {
  if (!validateProfileForm()) {
    return
  }

  saving.value = true
  error.value = ''
  try {
    const token = await getAccessTokenSilently()
    const updated = await updateProfile(form.value, token)
    form.value = {
      firstName: updated.firstName ?? '',
      lastName: updated.lastName ?? '',
      street: updated.street ?? '',
      postalCode: updated.postalCode ?? '',
      city: updated.city ?? '',
    }
    notifySuccess('Profil erfolgreich gespeichert.')
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = 'Profil konnte nicht gespeichert werden.'
    notifyError('Profil konnte nicht gespeichert werden.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="profile-page">
    <h2>Mein Profil</h2>

    <p v-if="loading" class="section-text">Profil wird geladen …</p>
    <p v-else-if="error" class="profile-error">{{ error }}</p>

    <form v-else class="profile-form" @submit.prevent="submitProfile">
      <div class="profile-card card">
        <h3 class="profile-section-title">Persönliche Daten</h3>
        <div class="profile-form-grid">
          <div class="product-form-field">
            <label for="profileFirstName">Vorname</label>
            <input id="profileFirstName" v-model="form.firstName" type="text" autocomplete="given-name" />
          </div>
          <div class="product-form-field">
            <label for="profileLastName">Nachname</label>
            <input id="profileLastName" v-model="form.lastName" type="text" autocomplete="family-name" />
          </div>
        </div>
      </div>

      <div class="profile-card card">
        <h3 class="profile-section-title">Konto</h3>
        <div class="profile-account-grid">
          <div class="product-form-field">
            <label for="profileEmail">E-Mail</label>
            <input id="profileEmail" :value="email" type="email" readonly />
          </div>
          <div class="product-form-field">
            <label for="profileRole">Rolle</label>
            <input id="profileRole" :value="roleLabel(role)" type="text" readonly />
          </div>
        </div>
      </div>

      <div class="profile-card card">
        <h3 class="profile-section-title">Lieferadresse</h3>
        <p class="profile-section-note">
          Hinterlege deine Standard-Lieferadresse für schnellere Bestellungen.
        </p>
        <div class="product-form-field">
          <label for="profileStreet">Straße und Hausnummer</label>
          <input
            id="profileStreet"
            v-model="form.street"
            type="text"
            autocomplete="street-address"
          />
        </div>
        <div class="profile-form-grid">
          <div class="product-form-field">
            <label for="profilePostalCode">PLZ</label>
            <input
              id="profilePostalCode"
              v-model="form.postalCode"
              type="text"
              inputmode="numeric"
              maxlength="5"
            />
          </div>
          <div class="product-form-field">
            <label for="profileCity">Ort</label>
            <input id="profileCity" v-model="form.city" type="text" autocomplete="address-level2" />
          </div>
        </div>
      </div>

      <div class="profile-card card">
        <h3 class="profile-section-title">Anmeldedaten</h3>
        <button
          type="button"
          class="profile-link-action"
          :disabled="passwordResetSending"
          @click="requestPasswordResetEmail"
        >
          {{ passwordResetSending ? 'Wird gesendet …' : 'Passwort zurücksetzen' }}
        </button>
      </div>

      <div class="profile-form-actions">
        <NavButton to="/" variant="secondary">Zur Startseite</NavButton>
        <Button type="submit" variant="primary" :disabled="saving">
          {{ saving ? 'Speichern …' : 'Speichern' }}
        </Button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.profile-page {
  max-width: 40rem;
  margin: 0 auto;
}

.profile-page h2 {
  margin: 0 0 1.25rem;
  font-size: 1.6rem;
}

.profile-form {
  display: grid;
  gap: 1rem;
}

.profile-card {
  padding: 1.15rem 1.2rem;
  display: grid;
  gap: 0.85rem;
}

.profile-section-title {
  margin: 0;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(61, 107, 79, 0.14);
  font-size: 1.05rem;
}

.profile-section-note {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.profile-form-grid,
.profile-account-grid {
  display: grid;
  gap: 0.85rem;
}

@media (min-width: 36rem) {
  .profile-form-grid,
  .profile-account-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.profile-link-action {
  justify-self: start;
  padding: 0;
  border: none;
  background: none;
  color: var(--moss);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.profile-link-action:hover:not(:disabled) {
  color: var(--terracotta);
  text-decoration: underline;
}

.profile-link-action:disabled {
  opacity: 0.6;
  cursor: wait;
}

.profile-form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
  padding-top: 0.25rem;
}

.profile-error {
  color: #a33d2d;
  margin: 0 0 1rem;
}
</style>
