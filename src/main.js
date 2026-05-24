import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0, createAuthGuard } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { auth0SessionCache } from './services/auth0SessionCache'

const domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim()
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim()
const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim()

if (import.meta.env.DEV && (!domain || !clientId)) {
  console.warn(
    '[Auth0] Faltan VITE_AUTH0_DOMAIN o VITE_AUTH0_CLIENT_ID en .env'
  )
}

const authorizationParams = {
  redirect_uri: window.location.origin,
  scope: 'openid profile email'
}

if (audience) {
  authorizationParams.audience = audience
}

// Sesiones antiguas en localStorage mezclaban todas las pestañas
Object.keys(localStorage)
  .filter((key) => key.startsWith('@@auth0spajs@@'))
  .forEach((key) => localStorage.removeItem(key))

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(
  createAuth0({
    domain: domain || '',
    clientId: clientId || '',
    authorizationParams,
    cache: auth0SessionCache,
    useRefreshTokens: false,
    onRedirectCallback(appState) {
      router.push(appState?.target ?? '/dashboard')
    }
  })
)

const authGuard = createAuthGuard(app, {
  redirectLoginOptions: {
    authorizationParams
  }
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    return authGuard(to)
  }
  return true
})

app.mount('#app')
