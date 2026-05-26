const TAB_ID_KEY = 'uco-tab-cache-id'

function getTabCachePrefix() {
  let tabId = sessionStorage.getItem(TAB_ID_KEY)
  if (!tabId) {
    tabId = crypto.randomUUID()
    sessionStorage.setItem(TAB_ID_KEY, tabId)
  }
  return `@@auth0-tab@@${tabId}::`
}

function scopedKey(key) {
  return getTabCachePrefix() + key
}

/** Cache Auth0 en sessionStorage, aislado por pestaña. */
export const auth0TabCache = {
  set(key, entry) {
    sessionStorage.setItem(scopedKey(key), JSON.stringify(entry))
  },
  get(key) {
    const raw = sessionStorage.getItem(scopedKey(key))
    if (!raw) return undefined
    try {
      return JSON.parse(raw)
    } catch {
      sessionStorage.removeItem(scopedKey(key))
      return undefined
    }
  },
  remove(key) {
    sessionStorage.removeItem(scopedKey(key))
  },
  allKeys() {
    const prefix = getTabCachePrefix()
    return Object.keys(sessionStorage)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length))
  }
}
