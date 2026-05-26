const AUTH0_LS_PREFIX = '@@auth0spajs@@'

export function purgeSharedAuth0LocalStorage() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(AUTH0_LS_PREFIX))
    .forEach((key) => localStorage.removeItem(key))
}

export function installAuth0StorageGuard() {
  purgeSharedAuth0LocalStorage()

  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith(AUTH0_LS_PREFIX)) {
      localStorage.removeItem(event.key)
    }
  })
}
