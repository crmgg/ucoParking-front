import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { hasTabAuth } from '@/services/tabAuthSession'

export function useTabAuth() {
  const auth0 = useAuth0()

  const isLoggedIn = computed(
    () => auth0.isAuthenticated.value && hasTabAuth()
  )

  return {
    ...auth0,
    isLoggedIn
  }
}
