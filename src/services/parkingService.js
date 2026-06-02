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
    occupiedByStudentName: dto.occupiedByStudentName,
    plate: dto.vehiclePlate,
    startTime: dto.reservationStartTime,
    endTime: dto.reservationEndTime,
    reservationDate: dto.reservationDate
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
  const { data } = await api.get(BASE, {
    params: { _: Date.now() }
  })
  return data.map((dto) => mapSpot(dto, currentStudentId))
}

export async function cancelParkingSpace({ spaceNumber, studentId }) {
  const { data } = await api.post(`${BASE}/release`, {
    spaceNumber,
    studentId
  })
  return data
}

export async function reserveParkingSpace({
  spaceNumber,
  studentId,
  studentName,
  studentEmail,
  vehiclePlate,
  reservationStartTime,
  reservationEndTime
}) {
  const { data } = await api.post(`${BASE}/reserve`, {
    spaceNumber,
    studentId,
    studentName,
    studentEmail,
    vehiclePlate,
    reservationStartTime,
    reservationEndTime
  })
  return data
}

const STREAM_RECONNECT_MS = 3000

export function subscribeParkingSpaceStream(currentStudentId, onUpdate, options = {}) {
  const { onError, onReconnect } = typeof options === 'function' ? { onError: options } : options
  let aborted = false
  let reconnectTimer = null
  let hadConnected = false
  let controller = null
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''

  const scheduleReconnect = () => {
    if (aborted) return
    reconnectTimer = setTimeout(connect, STREAM_RECONNECT_MS)
  }

  const connect = async () => {
    if (aborted) return

    controller?.abort()
    controller = new AbortController()

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

      if (hadConnected) {
        onReconnect?.()
      }
      hadConnected = true

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (!aborted) {
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

      if (!aborted) {
        scheduleReconnect()
      }
    } catch (error) {
      if (error.name === 'AbortError' || aborted) return
      onError?.(error)
      scheduleReconnect()
    }
  }

  connect()

  return () => {
    aborted = true
    clearTimeout(reconnectTimer)
    controller?.abort()
  }
}
