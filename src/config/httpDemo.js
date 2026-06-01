/** Auth0 SPA exige HTTPS; en http://IP la lib revienta al arrancar. */
export const httpDemoMode = !window.isSecureContext

export const HTTP_DEMO_KEY = Symbol('httpDemoMode')
