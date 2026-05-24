import axios from 'axios'
import { getAccessToken } from './auth0Token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
})

api.interceptors.request.use(async (config) => {
  try {
    const token = await getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Auth0] No se pudo obtener el token:', error?.message || error)
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
  try {
    const token = await getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Auth0] No se pudo obtener el token para stream:', error?.message || error)
    }
  }
  return headers
}

export default api
