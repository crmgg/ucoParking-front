import api from './api'

const BASE = '/uco-parking/v1/notifications'

async function sendEmailNotification({ templateCode, recipient, variables }) {
  const { data } = await api.post(`${BASE}/send`, {
    templateCode,
    recipient,
    channel: 'EMAIL',
    variables
  })

  if (data?.status !== 'SENT') {
    throw new Error(data?.detail || `Correo no enviado (${data?.status || 'ERROR'})`)
  }

  return data
}

export async function sendWelcomeNotification({ recipient, studentName }) {
  return sendEmailNotification({
    templateCode: 'WELCOME_STUDENT',
    recipient,
    variables: {
      studentName: studentName || 'Estudiante'
    }
  })
}

export async function sendReservationNotification({ recipient, studentName, spaceNumber }) {
  return sendEmailNotification({
    templateCode: 'RESERVATION_CONFIRMED',
    recipient,
    variables: {
      studentName: studentName || 'Estudiante',
      spaceNumber: String(spaceNumber)
    }
  })
}
