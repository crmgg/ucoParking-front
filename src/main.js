import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

app.use(router)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
    authorizationParams: {
      redirect_uri: window.location.origin + '/dashboard'
    }
  })
)

app.mount('#app')
