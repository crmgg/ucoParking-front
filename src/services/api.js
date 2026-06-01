import axios from 'axios'
import { getAccessToken } from './auth0Token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
})

/** false en Render demo: backend con AUTH0_SECURITY_ENABLED=false */
const attachAuthToken = import.meta.env.VITE_ATTACH_AUTH_TOKEN === 'true'

api.interceptors.request.use(async (config) => {
  if (!attachAuthToken) {
    return config
  }
  try {
    const token = await getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Auth0] Sin token API:', error?.message || error)
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      error.message = 'Sesión inválida o sin permisos para el API. Vuelve a iniciar sesión con Auth0.'
    }
    return Promise.reject(error)
  }
)

export async function buildAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders }
  if (!attachAuthToken) {
    return headers
  }
  try {
    const token = await getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Auth0] Sin token API:', error?.message || error)
    }
  }
  return headers
}

export default api
