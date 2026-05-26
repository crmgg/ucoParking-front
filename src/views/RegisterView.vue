<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
        <h1 class="auth-title">Crear Cuenta</h1>
        <p class="auth-subtitle">Regístrate para acceder al parqueadero</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="Juan Pérez"
            v-model="name"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Documento de identidad</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="2024001234"
            v-model="studentId"
            required
          />
        </div>

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
            :class="{ 'input-error': passwordError }"
            placeholder="••••••••"
            v-model="password"
            @input="passwordError = ''"
            required
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          <ul class="password-requirements">
            <li :class="{ valid: password.length >= 8 }">Mínimo 8 caracteres</li>
            <li :class="{ valid: hasLetter  }">Al menos una letra</li>
            <li :class="{ valid: hasNumberOrSpecial }">Al menos un número o carácter especial</li>
          </ul>
        </div>

        <div class="form-group">
          <label class="form-label">Placa del Vehículo</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="ABC-123"
            v-model="licensePlate"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Crear Cuenta
        </button>
      </form>

      <div class="auth-divider">
        <span>o regístrate con</span>
      </div>

      <button @click="registerWithAuth0" class="btn btn-auth0">
        <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M55.97 45.2L45.2 8.03c-.55-1.9-2.59-3.03-4.49-2.48L8.03 16.3c-1.9.55-3.03 2.59-2.48 4.49l10.77 37.17c.55 1.9 2.59 3.03 4.49 2.48l32.68-10.75c1.9-.55 3.03-2.59 2.48-4.49z" fill="#EB5424"/>
        </svg>
        Registrarse con Auth0
      </button>

      <p class="auth-footer">
        ¿Ya tienes una cuenta? 
        <router-link to="/">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth0Audience } from '@/services/auth0Token'
import { useTabAuth } from '@/composables/useTabAuth'
import { markLoginPending } from '@/services/tabAuthSession'
import api from '@/services/api'

const router = useRouter()
const { loginWithRedirect, isLoggedIn, isLoading } = useTabAuth()
const audience = getAuth0Audience()

watch(
  [isLoading, isLoggedIn],
  ([loading, loggedIn]) => {
    if (!loading && loggedIn) {
      router.replace({ name: 'dashboard' })
    }
  },
  { immediate: true }
)

const name = ref('')
const studentId = ref('')
const email = ref('')
const password = ref('')
const licensePlate = ref('')
const passwordError = ref('')

const hasLetter = computed(() => /[a-zA-Z]/.test(password.value))

const hasNumberOrSpecial = computed(() =>
  /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)
)

const validatePassword = (pwd) => {
  if (pwd.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres'
  }

  if (!/[a-zA-Z]/.test(pwd)) {
    return 'La contraseña debe tener al menos una letra'
  }

  if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
    return 'La contraseña debe tener al menos un número o carácter especial'
  }

  return ''
}

const handleRegister = async () => {

  passwordError.value = validatePassword(password.value)

  if (passwordError.value) {
    return
  }

  try {

    const response = await api.post('/uco-parking/v1/students', {
      email: email.value,
      idNumber: studentId.value,
      mobileNumber: '3000000000',
      academicProgram: '11111111-1111-1111-1111-111111111111',
      idType: '22222222-2222-2222-2222-222222222222'
    })

    console.log(response.data)

    router.push('/dashboard')

  } catch (error) {
    console.error(error)
  }
}

const registerWithAuth0 = () => {
  markLoginPending()
  loginWithRedirect({
    authorizationParams: {
      scope: 'openid profile email',
      prompt: 'login',
      ...(audience ? { audience } : {}),
      screen_hint: 'signup'
    },
    appState: { target: '/dashboard' }
  })
}
</script>
