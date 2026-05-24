import api, { buildAuthHeaders } from './api'

const BASE = '/uco-parking/v1/students'

function normalizeId(id) {
  return id ? String(id).toLowerCase() : null
}

function mapStatus(backendStatus, occupiedByStudentId, currentStudentId) {
  if (backendStatus === 'AVAILABLE') return 'available'
  if (
    occupiedByStudentId &&
    currentStudentId &&
    normalizeId(occupiedByStudentId) === normalizeId(currentStudentId)
  ) {
    return 'reserved'
  }
  return 'occupied'
}

export function mapSpot(dto, currentStudentId) {
  return {
    id: String(dto.spaceNumber),
    spaceNumber: dto.spaceNumber,
    status: mapStatus(dto.status, dto.occupiedByStudentId, currentStudentId),
    occupiedByStudentId: dto.occupiedByStudentId,
    occupiedByStudentName: dto.occupiedByStudentName
  }
}

export function mergeSpotUpdate(spots, updatedSpot) {
  const index = spots.findIndex((s) => s.spaceNumber === updatedSpot.spaceNumber)
  if (index >= 0) {
    const next = [...spots]
    next[index] = updatedSpot
    return next
  }
  return [...spots, updatedSpot].sort((a, b) => a.spaceNumber - b.spaceNumber)
}

export async function fetchParkingSpaces(currentStudentId) {
  const { data } = await api.get(BASE)
  return data.map((dto) => mapSpot(dto, currentStudentId))
}

export async function cancelParkingSpace({ spaceNumber, studentId }) {
  const { data } = await api.post(`${BASE}/release`, {
    spaceNumber,
    studentId
  })
  return data
}

export async function reserveParkingSpace({ spaceNumber, studentId, studentName }) {
  const { data } = await api.post(`${BASE}/reserve`, {
    spaceNumber,
    studentId,
    studentName
  })
  return data
}

export function subscribeParkingSpaceStream(currentStudentId, onUpdate, onError) {
  const controller = new AbortController()
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''

  ;(async () => {
    try {
      const headers = await buildAuthHeaders({
        Accept: 'application/x-ndjson'
      })

      const response = await fetch(`${baseURL}${BASE}/stream`, {
        headers,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error('No se pudo conectar al stream de parqueaderos')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          const dto = JSON.parse(trimmed)
          onUpdate(mapSpot(dto, currentStudentId))
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') return
      onError?.(error)
    }
  })()

  return () => controller.abort()
}
