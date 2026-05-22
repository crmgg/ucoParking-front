import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0, createAuthGuard } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

if (import.meta.env.DEV && (!domain || !clientId)) {
  console.warn(
    '[Auth0] Faltan VITE_AUTH0_DOMAIN o VITE_AUTH0_CLIENT_ID en .env — copia .env.example y completa los valores del dashboard de Auth0.'
  )
}

const app = createApp(App)

app.use(createPinia())

app.use(
  createAuth0({
    domain: domain || '',
    clientId: clientId || '',
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(audience ? { audience } : {})
    },
    cacheLocation: 'localstorage'
  })
)

app.use(router)

const authGuard = createAuthGuard(app)

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    try {
      if (localStorage.getItem('user')) return true
    } catch {
      /* ignore */
    }
    return authGuard(to)
  }
  return true
})

app.mount('#app')
