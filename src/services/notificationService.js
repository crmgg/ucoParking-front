import api from './api'

const BASE = '/uco-parking/v1/notifications'

export async function sendWelcomeNotification({ recipient, studentName }) {
  const { data } = await api.post(`${BASE}/send`, {
    templateCode: 'WELCOME_STUDENT',
    recipient,
    channel: 'EMAIL',
    variables: {
      studentName: studentName || 'Estudiante'
    }
  })

  if (data?.status !== 'SENT') {
    throw new Error(data?.detail || `Correo no enviado (${data?.status || 'ERROR'})`)
  }

  return data
}
