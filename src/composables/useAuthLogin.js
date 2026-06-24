import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { notifyError } from '@/composables/useNotification.js'

export function useAuthLogin() {
  const router = useRouter()
  const auth0 = useAuth0()

  function getAuth0Client() {
    const fromGlobals = getCurrentInstance()?.appContext.config.globalProperties.$auth0
    return fromGlobals ?? auth0
  }

  async function login(returnTo = '/cart') {
    const client = getAuth0Client()
    if (!client?.loginWithRedirect) {
      notifyError('Auth0 ist nicht initialisiert. Bitte npm run dev neu starten.')
      return
    }

    if (client.isLoading?.value) {
      return
    }

    sessionStorage.setItem('auth0_return_to', returnTo)

    if (window.location.search.includes('error=')) {
      window.history.replaceState({}, '', window.location.pathname || '/')
    }

    try {
      await client.loginWithRedirect()
    } catch (error) {
      console.error('Auth0 login failed:', error)
      notifyError(`Anmeldung fehlgeschlagen: ${error?.message ?? error}`)
    }
  }

  function completeReturnAfterLogin(isAuthenticated) {
    if (!isAuthenticated) {
      return
    }
    const returnTo = sessionStorage.getItem('auth0_return_to')
    if (returnTo) {
      sessionStorage.removeItem('auth0_return_to')
      router.push(returnTo)
    }
  }

  return {
    login,
    completeReturnAfterLogin,
  }
}
