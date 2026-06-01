const PLATE_PATTERN = /^[A-Z]{3}([0-9]{3}|[0-9]{2}[A-Z])$/

export const PLATE_FORMAT_HINT =
  'Carro: ABC123 (3 letras + 3 numeros). Moto: ABC12D (3 letras + 2 numeros + 1 letra).'

export function normalizePlate(plate) {
  return plate?.trim().toUpperCase() || ''
}

export function isValidPlateFormat(plate) {
  return PLATE_PATTERN.test(normalizePlate(plate))
}

export function validatePlateInput(plate) {
  const normalized = normalizePlate(plate)
  if (!normalized) {
    return 'Por favor ingresa la placa del vehiculo'
  }
  if (!isValidPlateFormat(normalized)) {
    return `Placa invalida. ${PLATE_FORMAT_HINT}`
  }
  return ''
}
