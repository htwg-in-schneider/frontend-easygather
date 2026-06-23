import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'

function getAuthRedirectUri() {
  const base = import.meta.env.BASE_URL
  if (base === '/') {
    return window.location.origin
  }
  const path = base.endsWith('/') ? base.slice(0, -1) : base
  return `${window.location.origin}${path}`
}

function normalizeAuth0Domain(domain) {
  return domain?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') ?? ''
}

function trimEnv(value) {
  return typeof value === 'string' ? value.trim() : value
}

function clearAuth0ErrorFromUrl() {
  const params = new URLSearchParams(window.location.search)
  if (!params.has('error')) {
    return
  }
  const description = params.get('error_description') || params.get('error') || 'Unbekannter Auth0-Fehler'
  console.error('Auth0 callback error:', description)
  sessionStorage.setItem('auth0_last_error', description)
  window.history.replaceState({}, '', window.location.pathname || '/')
}

clearAuth0ErrorFromUrl()

const auth0Domain = normalizeAuth0Domain(trimEnv(import.meta.env.VITE_AUTH0_DOMAIN))
const auth0ClientId = trimEnv(import.meta.env.VITE_AUTH0_CLIENT_ID)
const auth0Audience = trimEnv(import.meta.env.VITE_AUTH0_AUDIENCE)

if (!auth0Domain || !auth0ClientId) {
  throw new Error(
    'Auth0-Konfiguration fehlt. Prüfe .env.development und starte npm run dev neu.',
  )
}

const auth0 = createAuth0({
  domain: auth0Domain,
  clientId: auth0ClientId,
  authorizationParams: {
    audience: auth0Audience,
    redirect_uri: getAuthRedirectUri(),
  },
  cacheLocation: 'localstorage',
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(auth0)

router.isReady().then(() => {
  app.mount('#app')

  // auth0 __checkSession catch block does not reset isLoading on failure
  window.setTimeout(() => {
    if (auth0.isLoading?.value) {
      auth0.isLoading.value = false
    }
  }, 2500)
})
