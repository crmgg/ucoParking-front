import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router, { requireTabAuth } from './router'
import './styles/main.css'
import './services/auth0PluginPatch.js'
import { auth0TabCache } from './services/auth0TabCache'
import { installAuth0StorageGuard } from './services/auth0StorageGuard'
import { initTabAuthSession } from './services/tabAuthSession'

const domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim()
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim()
const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim()

installAuth0StorageGuard()
initTabAuthSession()

const authorizationParams = {
  redirect_uri: window.location.origin,
  scope: 'openid profile email',
  prompt: 'login'
}

if (audience) {
  authorizationParams.audience = audience
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createAuth0(
    {
      domain: domain || '',
      clientId: clientId || '',
      authorizationParams,
      cache: auth0TabCache,
      useRefreshTokens: false
    },
    { errorPath: '/' }
  )
)

router.beforeEach(requireTabAuth)

app.mount('#app')
