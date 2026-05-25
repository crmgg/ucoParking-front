const STORAGE_KEY = 'uco-student-email'

export function rememberStudentEmail(email) {
  if (email?.trim()) {
    sessionStorage.setItem(STORAGE_KEY, email.trim())
  }
}

export async function resolveStudentEmail(user, getIdTokenClaims) {
  if (user?.email?.trim()) {
    rememberStudentEmail(user.email)
    return user.email.trim()
  }

  const claims = user ? await getIdTokenClaims() : null
  if (claims?.email?.trim()) {
    rememberStudentEmail(claims.email)
    return claims.email.trim()
  }

  if (claims) {
    for (const value of Object.values(claims)) {
      if (typeof value === 'string' && value.includes('@')) {
        rememberStudentEmail(value)
        return value.trim()
      }
    }
  }

  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored?.trim() || null
}
