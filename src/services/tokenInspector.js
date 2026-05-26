function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return JSON.parse(atob(padded))
}

export function inspectAccessToken(token) {
  if (!token || typeof token !== 'string') {
    return { kind: 'missing', parts: 0 }
  }

  const parts = token.split('.')

  if (parts.length === 5) {
    return {
      kind: 'JWE',
      parts: 5,
      message: 'Token encriptado (JWE). Spring espera JWT firmado (JWS). Desactiva Access Token Encryption en Auth0 API.'
    }
  }

  if (parts.length !== 3) {
    return {
      kind: 'opaque',
      parts: parts.length,
      message: 'No es JWT. Falta audience al pedir el token; Auth0 devolvió un access token opaco.'
    }
  }

  try {
    const header = decodeBase64Url(parts[0])
    const payload = decodeBase64Url(parts[1])
    return { kind: 'JWS', parts: 3, header, payload }
  } catch {
    return { kind: 'invalid-jws', parts: 3, message: 'JWT malformado' }
  }
}

export function validateApiAccessToken(token, expectedAudience, clientId) {
  const info = inspectAccessToken(token)

  if (info.kind !== 'JWS') {
    throw new Error(info.message || 'Access token inválido para el API')
  }

  const aud = info.payload?.aud
  const audiences = Array.isArray(aud) ? aud : aud ? [aud] : []

  if (expectedAudience && !audiences.includes(expectedAudience)) {
    if (clientId && audiences.includes(clientId)) {
      throw new Error(
        'Estás enviando el id_token (aud=clientId). Usa getAccessTokenSilently con audience del API.'
      )
    }
    throw new Error(
      `JWT aud=${JSON.stringify(aud)} no coincide con ${expectedAudience}`
    )
  }

  return info
}

/**
 * Logs temporales de diagnóstico Auth0 → API.
 * Quitar o dejar solo en DEV cuando el flujo esté estable.
 */
export function logTokenValidation(token, expectedAudience) {
  const parts = token?.split('.') ?? []
  const info = inspectAccessToken(token)

  console.group('[Auth0] Validación de access token')
  console.log('partes (split "."):', parts.length, parts.length === 3 ? '→ JWS ✅' : parts.length === 5 ? '→ JWE ❌' : '→ NO JWT ❌')

  if (info.kind === 'JWS') {
    console.log('header decodificado:', info.header)
    console.log('payload decodificado:', info.payload)
    console.log('alg:', info.header?.alg)
    console.log('iss:', info.payload?.iss)
    console.log('aud:', info.payload?.aud)
    console.log('aud esperado:', expectedAudience)
    console.log('sub:', info.payload?.sub)

    const aud = info.payload?.aud
    const audiences = Array.isArray(aud) ? aud : aud ? [aud] : []
    const audienceOk = expectedAudience ? audiences.includes(expectedAudience) : true
    console.log('audience OK:', audienceOk ? '✅' : '❌')
  } else {
    console.error('token inválido:', info)
  }

  console.groupEnd()
  return info
}

export function logAccessTokenDebug(token, expectedAudience) {
  return logTokenValidation(token, expectedAudience)
}
