const RESTORE_KEY = 'uco-tab-auth-restore'
const LOGIN_PENDING_KEY = 'uco-tab-login-pending'

let tabAuthActive = false

function navigationType() {
  return performance.getEntriesByType('navigation')[0]?.type || 'navigate'
}

export function isOAuthCallback() {
  const search = window.location.search
  return search.includes('code=') && search.includes('state=')
}

export function initTabAuthSession() {
  if (isOAuthCallback()) {
    activateTabAuth()
    return
  }

  if (consumeLoginPending()) {
    activateTabAuth()
    return
  }

  const nav = navigationType()
  if (nav === 'reload' && sessionStorage.getItem(RESTORE_KEY) === '1') {
    tabAuthActive = true
    return
  }

  tabAuthActive = false
  sessionStorage.removeItem(RESTORE_KEY)
  sessionStorage.removeItem(LOGIN_PENDING_KEY)
}

export function markLoginPending() {
  sessionStorage.setItem(LOGIN_PENDING_KEY, '1')
}

function consumeLoginPending() {
  const pending = sessionStorage.getItem(LOGIN_PENDING_KEY) === '1'
  sessionStorage.removeItem(LOGIN_PENDING_KEY)
  return pending
}

export function activateTabAuth() {
  tabAuthActive = true
  sessionStorage.setItem(RESTORE_KEY, '1')
  sessionStorage.removeItem(LOGIN_PENDING_KEY)
}

export function hasTabAuth() {
  return tabAuthActive
}

export function clearTabAuth() {
  tabAuthActive = false
  sessionStorage.removeItem(RESTORE_KEY)
  sessionStorage.removeItem(LOGIN_PENDING_KEY)
}
