import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchProfile } from '@/api/backend.js'

const profile = ref(null)
let initialized = false

export function useUserProfile() {
  const route = useRoute()
  const router = useRouter()
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0()

  const isFahrer = computed(() => profile.value?.role === 'FAHRER')
  const isAdmin = computed(() => profile.value?.role === 'ADMIN')
  const isKunde = computed(() => profile.value?.role === 'KUNDE')

  const displayName = computed(() => {
    if (!profile.value?.firstName) {
      return ''
    }
    return profile.value.firstName
  })

  async function refreshProfile() {
    if (!isAuthenticated.value) {
      profile.value = null
      return null
    }
    try {
      const token = await getAccessTokenSilently()
      profile.value = await fetchProfile(token)
      return profile.value
    } catch (error) {
      console.error('Error loading profile:', error)
      profile.value = null
      return null
    }
  }

  function redirectFahrerIfNeeded() {
    if (!isFahrer.value) {
      return
    }
    const publicLandingPaths = ['/', '/shop']
    if (publicLandingPaths.includes(route.path)) {
      router.replace('/lieferauftraege')
    }
  }

  if (!initialized) {
    initialized = true

    watch(
      [isAuthenticated, isLoading],
      async ([authed, loading]) => {
        if (loading) {
          return
        }
        if (authed) {
          await refreshProfile()
          redirectFahrerIfNeeded()
        } else {
          profile.value = null
        }
      },
      { immediate: true },
    )

    watch(
      () => route.path,
      () => {
        redirectFahrerIfNeeded()
      },
    )
  }

  return {
    profile,
    isFahrer,
    isAdmin,
    isKunde,
    displayName,
    refreshProfile,
  }
}
