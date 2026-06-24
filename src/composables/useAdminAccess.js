import { useRouter } from 'vue-router'
import { useUserProfile } from '@/composables/useUserProfile.js'

export function useAdminAccess() {
  const router = useRouter()
  const { isAdmin, refreshProfile } = useUserProfile()

  async function ensureAdmin() {
    await refreshProfile()
    if (!isAdmin.value) {
      router.replace('/')
      return false
    }
    return true
  }

  return {
    isAdmin,
    refreshProfile,
    ensureAdmin,
  }
}
