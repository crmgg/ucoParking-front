<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <div class="header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
        <div>
          <h1 class="header-title">Parqueadero UCO</h1>
          <p class="header-subtitle">Sistema de gestión de espacios</p>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">{{ userInitials }}</div>
          <span class="user-name">{{ userName }}</span>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 6px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </div>
    </header>

    <main class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="stat-value">{{ availableSpots }}</div>
          <div class="stat-label">Espacios Disponibles</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="stat-value">{{ occupiedSpots }}</div>
          <div class="stat-label">Espacios Ocupados</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-value">{{ reservedSpots }}</div>
          <div class="stat-label">Mis Reservaciones</div>
        </div>
      </div>

      <section class="parking-section">
        <div class="section-header">
          <h2 class="section-title">Mapa del Parqueadero</h2>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              Disponible
            </div>
            <div class="legend-item">
              <span class="legend-dot occupied"></span>
              Ocupado
            </div>
            <div class="legend-item">
              <span class="legend-dot reserved"></span>
              Reservado
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="plate-error" style="margin-bottom: 1rem;">{{ errorMessage }}</p>
        <p v-if="loading && !parkingSpots.length" class="header-subtitle">Cargando parqueaderos...</p>

        <div class="parking-grid">
          <div 
            v-for="spot in parkingSpots" 
            :key="spot.id"
            class="parking-spot"
            :class="spot.status"
            @click="handleSpotClick(spot)"
          >
            <svg class="spot-icon" :class="spot.status" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path v-if="spot.status === 'available'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              <path v-else-if="spot.status === 'occupied'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="spot-number">{{ spot.id }}</span>
            <span class="spot-status" :class="spot.status">
              {{ getStatusText(spot.status) }}
            </span>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Reserva -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon" :class="selectedSpot?.status === 'available' ? 'success' : 'warning'">
            <svg v-if="selectedSpot?.status === 'available'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="modal-title">
            {{ selectedSpot?.status === 'available' ? 'Reservar Espacio' : 'Cancelar Reserva' }}
          </h3>
          <p class="modal-message">
            {{ selectedSpot?.status === 'available' 
              ? `¿Deseas reservar el espacio ${selectedSpot?.id}? Una vez reservado, tendrás 30 minutos para ocuparlo.`
              : `¿Deseas cancelar tu reserva en el espacio ${selectedSpot?.id}?`
            }}
          </p>
          <div v-if="selectedSpot?.status === 'available'" class="plate-input-container">
            <label for="plate" class="plate-label">Placa del vehículo</label>
            <input 
              id="plate"
              v-model="plateNumber"
              type="text"
              class="plate-input"
              placeholder="Ej: ABC123"
              maxlength="7"
              @input="plateError = ''"
            />
            <span v-if="plateError" class="plate-error">{{ plateError }}</span>
          </div>
          <div v-if="selectedSpot?.status === 'available'" class="time-selection">
            <div class="time-field">
              <label for="startTime" class="plate-label">Hora de entrada</label>
              <select 
                id="startTime" 
                v-model="startTime" 
                class="time-select"
                @change="timeError = ''"
              >
                <option value="" disabled>Seleccionar</option>
                <option v-for="time in timeOptions" :key="'start-'+time" :value="time">{{ time }}</option>
              </select>
            </div>
            <div class="time-field">
              <label for="endTime" class="plate-label">Hora de salida</label>
              <select 
                id="endTime" 
                v-model="endTime" 
                class="time-select"
                @change="timeError = ''"
              >
                <option value="" disabled>Seleccionar</option>
                <option v-for="time in timeOptions" :key="'end-'+time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>
          <span v-if="timeError" class="plate-error time-error">{{ timeError }}</span>
          <p class="parking-hours">Horario del parqueadero: 7:00 AM - 9:40 PM</p>
          <div v-if="selectedSpot?.status === 'reserved' && selectedSpot?.plate" class="plate-display">
            <span class="plate-display-label">Placa registrada:</span>
            <span class="plate-display-value">{{ selectedSpot.plate }}</span>
            <div v-if="selectedSpot?.startTime && selectedSpot?.endTime" class="reservation-time-display">
              <span class="time-display-label">Horario reservado:</span>
              <span class="time-display-value">{{ selectedSpot.startTime }} - {{ selectedSpot.endTime }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary" :disabled="loading">Cancelar</button>
          <button @click="confirmAction" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Procesando...' : (selectedSpot?.status === 'available' ? 'Reservar' : 'Confirmar') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  fetchParkingSpaces,
  reserveParkingSpace,
  cancelParkingSpace,
  subscribeParkingSpaceStream,
  mergeSpotUpdate,
  mapSpot
} from '@/services/parkingService'
import { sendWelcomeNotification } from '@/services/notificationService'
import { resolveStudentEmail } from '@/services/studentEmail'

const { user, isAuthenticated, isLoading, logout, getIdTokenClaims } = useAuth0()

const showModal = ref(false)
const selectedSpot = ref(null)
const plateNumber = ref('')
const plateError = ref('')
const startTime = ref('')
const endTime = ref('')
const timeError = ref('')
const loading = ref(false)
const errorMessage = ref('')
const parkingSpots = ref([])
let unsubscribeStream = null

const studentProfile = computed(() => {
  if (!isAuthenticated.value || !user.value) return null
  return {
    id: user.value.sub,
    name: user.value.name || user.value.email || 'Estudiante',
    email: user.value.email
  }
})

const timeOptions = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:40'
]

const userName = computed(() => {
  if (isAuthenticated.value && user.value) {
    return user.value.name || user.value.email
  }
  return 'Estudiante'
})

const userInitials = computed(() => {
  const name = userName.value
  if (!name) return 'E'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const availableSpots = computed(() =>
  parkingSpots.value.filter(s => s.status === 'available').length
)

const occupiedSpots = computed(() =>
  parkingSpots.value.filter(s => s.status === 'occupied').length
)

const reservedSpots = computed(() =>
  parkingSpots.value.filter(s => s.status === 'reserved').length
)

const applySpotUpdate = (updatedSpot) => {
  parkingSpots.value = mergeSpotUpdate(parkingSpots.value, updatedSpot)

  if (
    showModal.value &&
    selectedSpot.value &&
    selectedSpot.value.spaceNumber === updatedSpot.spaceNumber &&
    updatedSpot.status === 'occupied'
  ) {
    errorMessage.value = `El parqueadero ${updatedSpot.spaceNumber} acaba de ser reservado por otro estudiante.`
    closeModal()
    return
  }

  if (
    selectedSpot.value &&
    selectedSpot.value.spaceNumber === updatedSpot.spaceNumber
  ) {
    selectedSpot.value = updatedSpot
  }
}

const startParkingSpaceStream = () => {
  if (!studentProfile.value) return

  unsubscribeStream?.()
  unsubscribeStream = subscribeParkingSpaceStream(
    studentProfile.value.id,
    applySpotUpdate,
    () => {
      /* reconexión silenciosa: el usuario puede refrescar manualmente si falla */
    }
  )
}

const getStatusText = (status) => {
  const texts = {
    available: 'Libre',
    occupied: 'Ocupado',
    reserved: 'Reservado'
  }
  return texts[status]
}

const loadParkingSpaces = async () => {
  if (!studentProfile.value) return

  loading.value = true
  errorMessage.value = ''
  try {
    parkingSpots.value = await fetchParkingSpaces(studentProfile.value.id)
  } catch (error) {
    errorMessage.value = error.response?.data?.messages?.[0]
      || error.message
      || 'No se pudieron cargar los parqueaderos'
  } finally {
    loading.value = false
  }
}

const handleSpotClick = (spot) => {
  if (spot.status === 'occupied') return
  selectedSpot.value = spot
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSpot.value = null
  plateNumber.value = ''
  plateError.value = ''
  startTime.value = ''
  endTime.value = ''
  timeError.value = ''
}

const confirmAction = async () => {
  if (!selectedSpot.value || !studentProfile.value) return

  if (selectedSpot.value.status === 'available') {
    if (!plateNumber.value.trim()) {
      plateError.value = 'Por favor ingresa la placa del vehículo'
      return
    }
    if (plateNumber.value.trim().length < 4) {
      plateError.value = 'La placa debe tener al menos 4 caracteres'
      return
    }
    if (!startTime.value || !endTime.value) {
      timeError.value = 'Por favor selecciona la hora de inicio y fin'
      return
    }
    if (startTime.value >= endTime.value) {
      timeError.value = 'La hora de fin debe ser mayor a la hora de inicio'
      return
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const studentEmail = await resolveStudentEmail(user.value, getIdTokenClaims)
      if (!studentEmail) {
        errorMessage.value = 'No tenemos tu correo. Cierra sesion y vuelve a entrar con Auth0 (permiso email).'
        loading.value = false
        return
      }

      const updatedSpot = await reserveParkingSpace({
        spaceNumber: selectedSpot.value.spaceNumber,
        studentId: studentProfile.value.id,
        studentName: studentProfile.value.name,
        studentEmail
      })
      parkingSpots.value = mergeSpotUpdate(
        parkingSpots.value,
        mapSpot(updatedSpot, studentProfile.value.id)
      )
      closeModal()
    } catch (error) {
    errorMessage.value = error.response?.data?.messages?.[0]
      || error.response?.data?.message
      || error.message
      || 'No se pudo reservar el parqueadero'
    } finally {
      loading.value = false
    }
    return
  }

  if (selectedSpot.value.status === 'reserved') {
    loading.value = true
    errorMessage.value = ''
    try {
      const updatedSpot = await cancelParkingSpace({
        spaceNumber: selectedSpot.value.spaceNumber,
        studentId: studentProfile.value.id
      })
      parkingSpots.value = mergeSpotUpdate(
        parkingSpots.value,
        mapSpot(updatedSpot, studentProfile.value.id)
      )
      closeModal()
    } catch (error) {
      errorMessage.value = error.response?.data?.messages?.[0]
        || error.response?.data?.message
        || error.message
        || 'No se pudo cancelar la reserva'
    } finally {
      loading.value = false
    }
    return
  }

  closeModal()
}

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}

const sendWelcomeEmailOnce = async (profile) => {
  const email = await resolveStudentEmail(user.value, getIdTokenClaims)
  if (!email) {
    console.warn('[UCO Parking] Auth0 no devolvio email; no se envia bienvenida')
    return
  }

  const storageKey = `uco-welcome-sent:${profile.id}`
  if (sessionStorage.getItem(storageKey)) return

  try {
    await sendWelcomeNotification({
      recipient: email,
      studentName: profile.name
    })
    sessionStorage.setItem(storageKey, '1')
  } catch (error) {
    console.warn('[UCO Parking] No se pudo enviar correo de bienvenida:', error?.message || error)
  }
}

watch(
  [isLoading, isAuthenticated, user],
  ([loading, authenticated, authUser]) => {
    if (!loading && authenticated && authUser) {
      const profile = {
        id: authUser.sub,
        name: authUser.name || authUser.email || 'Estudiante',
        email: authUser.email
      }
      loadParkingSpaces()
      startParkingSpaceStream()
      sendWelcomeEmailOnce(profile)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  unsubscribeStream?.()
})
</script>
