import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0, createAuthGuard } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

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

const app = createApp(App)

app.use(createPinia())

app.use(
  createAuth0({
    domain: domain || '',
    clientId: clientId || '',
    authorizationParams,
    cacheLocation: 'localstorage'
  })
)

app.use(router)

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
