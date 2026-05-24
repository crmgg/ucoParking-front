/**
 * Cache Auth0 por pestaña: sessionStorage sobrevive al F5 en la misma ventana
 * pero no se comparte entre pestañas (a diferencia de localStorage).
 */
export const auth0SessionCache = {
  set(key, entry) {
    sessionStorage.setItem(key, JSON.stringify(entry))
  },
  get(key) {
    const raw = sessionStorage.getItem(key)
    if (!raw) return undefined
    try {
      return JSON.parse(raw)
    } catch {
      sessionStorage.removeItem(key)
      return undefined
    }
  },
  remove(key) {
    sessionStorage.removeItem(key)
  },
  allKeys() {
    return Object.keys(sessionStorage)
  }
}
