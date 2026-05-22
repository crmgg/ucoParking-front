import axios from 'axios'

let getAccessTokenSilently = null

/** Registra getAccessTokenSilently de Auth0 (desde App.vue, antes de las vistas). */
export function setAccessTokenGetter(getter) {
  getAccessTokenSilently = getter
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
})

api.interceptors.request.use(async (config) => {
  if (!getAccessTokenSilently) return config
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE
  try {
    const token = await getAccessTokenSilently({
      ...(audience
        ? { authorizationParams: { audience } }
        : {})
    })
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    /* sesión Auth0 no disponible o sin consentimiento para el API */
  }
  return config
})

export default api
