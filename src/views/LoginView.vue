<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
        <h1 class="auth-title">Bienvenido</h1>
        <p class="auth-subtitle">Inicia sesión en tu cuenta de parqueadero</p>
      </div>

      <p v-if="authError" class="plate-error" style="margin-bottom: 1rem;">{{ authError }}</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            class="form-input" 
            placeholder="estudiante@universidad.edu"
            v-model="email"
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Iniciar sesión con Auth0
        </button>
      </form>

      <div class="auth-divider">
        <span>o continúa con</span>
      </div>

      <button @click="loginWithAuth0()" class="btn btn-auth0">
        <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M55.97 45.2L45.2 8.03c-.55-1.9-2.59-3.03-4.49-2.48L8.03 16.3c-1.9.55-3.03 2.59-2.48 4.49l10.77 37.17c.55 1.9 2.59 3.03 4.49 2.48l32.68-10.75c1.9-.55 3.03-2.59 2.48-4.49z" fill="#EB5424"/>
        </svg>
        Continuar con Auth0
      </button>

      <p class="auth-footer">
        ¿No tienes una cuenta? 
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { getAuth0Audience } from '@/services/auth0Token'

const route = useRoute()
const router = useRouter()
const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0()

const audience = getAuth0Audience()
const authError = ref('')
const email = ref('')

const authorizationParams = {
  scope: 'openid profile email',
  ...(audience ? { audience } : {})
}

onMounted(() => {
  const error = route.query.error_description || route.query.error
  if (error) {
    const message = decodeURIComponent(String(error))
    if (message.includes('Service not found')) {
      authError.value = 'Auth0: el API no existe todavía. Quita VITE_AUTH0_AUDIENCE del .env o créalo en Auth0 Dashboard.'
    } else {
      authError.value = message
    }
    router.replace({ path: route.path, query: {} })
  }
})

watch(
  [isLoading, isAuthenticated],
  () => {
    if (!isLoading.value && isAuthenticated.value) {
      router.replace({ name: 'dashboard' })
    }
  },
  { immediate: true }
)

const loginWithAuth0 = (extraParams = {}) => {
  loginWithRedirect({
    authorizationParams: {
      ...authorizationParams,
      ...extraParams
    },
    appState: { target: '/dashboard' }
  })
}

const handleLogin = () => {
  loginWithAuth0(email.value ? { login_hint: email.value } : {})
}
</script>
