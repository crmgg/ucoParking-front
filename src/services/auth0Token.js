const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim()

let getAccessTokenSilently = null

export function setAuth0TokenGetter(getter) {
  getAccessTokenSilently = getter
}

export async function getAccessToken() {
  if (!getAccessTokenSilently) {
    throw new Error('Auth0 aún no está listo')
  }

  const params = {
    authorizationParams: {
      scope: 'openid profile email'
    }
  }

  if (audience) {
    params.authorizationParams.audience = audience
  }

  return getAccessTokenSilently(params)
}

export function getAuth0Audience() {
  return audience
}

export function isApiAudienceConfigured() {
  return Boolean(audience)
}
