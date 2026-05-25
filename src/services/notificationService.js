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
  return data
}
