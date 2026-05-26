import { Auth0Plugin } from '@auth0/auth0-vue'
import { hasTabAuth, isOAuthCallback } from './tabAuthSession'

function allowAuth0Session() {
  return isOAuthCallback() || hasTabAuth()
}

function resetAuthState(plugin) {
  plugin.isLoading.value = false
  plugin.isAuthenticated.value = false
  plugin.user.value = {}
  plugin.idTokenClaims.value = undefined
}

const originalCheckSession = Auth0Plugin.prototype.__checkSession
const originalPublicCheckSession = Auth0Plugin.prototype.checkSession
const originalGetAccessTokenSilently = Auth0Plugin.prototype.getAccessTokenSilently
const originalProxy = Auth0Plugin.prototype.__proxy

Auth0Plugin.prototype.__checkSession = async function patchedCheckSession(router) {
  if (!allowAuth0Session()) {
    resetAuthState(this)
    return
  }
  return originalCheckSession.call(this, router)
}

Auth0Plugin.prototype.checkSession = async function patchedPublicCheckSession(options) {
  if (!allowAuth0Session()) {
    resetAuthState(this)
    return
  }
  return originalPublicCheckSession.call(this, options)
}

Auth0Plugin.prototype.getAccessTokenSilently = async function patchedGetAccessTokenSilently(options) {
  if (!allowAuth0Session()) {
    resetAuthState(this)
    throw new Error('Sin sesión en esta pestaña')
  }
  return originalGetAccessTokenSilently.call(this, options)
}

Auth0Plugin.prototype.__proxy = async function patchedProxy(cb, refreshState = true) {
  if (!allowAuth0Session()) {
    resetAuthState(this)
    return undefined
  }
  return originalProxy.call(this, cb, refreshState)
}
