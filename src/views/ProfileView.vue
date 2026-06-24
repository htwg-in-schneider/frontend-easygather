<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchProfile, updateProfile } from '@/api/backend.js'
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
    alert('Passwort-Reset ist derzeit nicht verfügbar.')
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
      alert(`Auth0 hat eine E-Mail an ${email.value} geschickt. Dort kannst du dein Passwort ändern.`)
    } else {
      alert('Passwort-Reset-E-Mail konnte nicht angefordert werden.')
    }
  } catch (err) {
    console.error('Auth0 password reset failed:', err)
    alert('Passwort-Reset-E-Mail konnte nicht angefordert werden.')
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

async function submitProfile() {
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
    alert('Profil erfolgreich gespeichert!')
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = 'Profil konnte nicht gespeichert werden. Bitte alle Felder ausfüllen.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="product-form-page profile-page">
    <h2>Mein Profil</h2>

    <p v-if="loading" class="section-text">Profil wird geladen …</p>
    <p v-else-if="error" class="profile-error">{{ error }}</p>

    <form v-else class="product-form" @submit.prevent="submitProfile">
      <div class="product-form-field">
        <label for="profileFirstName">Vorname</label>
        <input id="profileFirstName" v-model="form.firstName" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="profileLastName">Nachname</label>
        <input id="profileLastName" v-model="form.lastName" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="profileEmail">E-Mail</label>
        <input id="profileEmail" :value="email" type="email" readonly />
      </div>
      <div class="product-form-field">
        <label for="profileRole">Rolle</label>
        <input id="profileRole" :value="roleLabel(role)" type="text" readonly />
      </div>
      <div class="product-form-field">
        <label for="profileStreet">Straße und Hausnummer</label>
        <input id="profileStreet" v-model="form.street" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="profilePostalCode">PLZ</label>
        <input id="profilePostalCode" v-model="form.postalCode" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="profileCity">Ort</label>
        <input id="profileCity" v-model="form.city" type="text" required />
      </div>

      <div class="profile-password-section">
        <h3>Passwort</h3>
        <p class="section-text">
          Dein Passwort wird über Auth0 verwaltet und kann hier nicht direkt geändert werden.
          Wenn du es ändern möchtest, fordere eine
          <button
            type="button"
            class="profile-auth0-link"
            :disabled="passwordResetSending"
            @click="requestPasswordResetEmail"
          >
            Passwort-Reset-E-Mail bei Auth0
          </button>
          an. In der E-Mail findest du den Link zum Setzen eines neuen Passworts.
        </p>
      </div>

      <div class="product-form-actions">
        <NavButton to="/" variant="secondary">Zur Startseite</NavButton>
        <Button type="submit" variant="primary" :disabled="saving">
          {{ saving ? 'Speichern …' : 'Speichern' }}
        </Button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.profile-page h3 {
  margin: 1.25rem 0 0.35rem;
  font-size: 1.05rem;
}

.profile-password-section {
  display: grid;
  gap: 0.5rem;
}

.profile-password-section .section-text {
  margin: 0;
  line-height: 1.6;
}

.profile-auth0-link {
  display: inline;
  padding: 0;
  border: none;
  background: none;
  color: var(--moss);
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.profile-auth0-link:hover:not(:disabled) {
  color: var(--terracotta);
}

.profile-auth0-link:disabled {
  opacity: 0.6;
  cursor: wait;
}

.profile-error {
  color: #a33d2d;
  margin: 0 0 1rem;
}
</style>
