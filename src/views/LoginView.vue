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

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            class="form-input" 
            placeholder="estudiante@universidad.edu"
            v-model="email"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input 
            type="password" 
            class="form-input" 
            placeholder="••••••••"
            v-model="password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Iniciar Sesión
        </button>
      </form>

      <div class="auth-divider">
        <span>o continúa con</span>
      </div>

      <button @click="loginWithAuth0" class="btn btn-auth0">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const { loginWithRedirect } = useAuth0()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Simulación de login local
  if (email.value && password.value) {
    localStorage.setItem('user', JSON.stringify({ 
      email: email.value,
      name: email.value.split('@')[0]
    }))
    router.push('/dashboard')
  }
}

const loginWithAuth0 = () => {
  loginWithRedirect()
}
</script>
