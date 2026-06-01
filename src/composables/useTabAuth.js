import { computed, inject, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { hasTabAuth } from '@/services/tabAuthSession'
import { HTTP_DEMO_KEY } from '@/config/httpDemo'

export function useTabAuth() {
  const httpDemo = inject(HTTP_DEMO_KEY, false)

  if (httpDemo) {
    return {
      isAuthenticated: computed(() => hasTabAuth()),
      isLoading: ref(false),
      isLoggedIn: computed(() => hasTabAuth()),
      user: ref({
        sub: 'demo-estudiante-uco',
        name: 'Estudiante demo',
        email: 'demo@uco.edu.co'
      }),
      loginWithRedirect: async () => {},
      logout: async () => {},
      getAccessTokenSilently: async () => '',
      getIdTokenClaims: async () => ({
        sub: 'demo-estudiante-uco',
        name: 'Estudiante demo',
        email: 'demo@uco.edu.co'
      })
    }
  }

  const auth0 = useAuth0()

  const isLoggedIn = computed(
    () => auth0.isAuthenticated.value && hasTabAuth()
  )

  return {
    ...auth0,
    isLoggedIn
  }
}
