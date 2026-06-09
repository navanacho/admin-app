import type { EstadoPedidoCodigo } from '../types'

// Máquina de estados — espejo del backend (service.py TRANSICIONES_VALIDAS).
// Si el backend cambia, hay que actualizar esto.
// Flujo lineal: PENDIENTE → CONFIRMADO → EN_PREP → LISTO → ENTREGADO (+ CANCELADO).
export const TRANSITIONS: Record<EstadoPedidoCodigo, EstadoPedidoCodigo[]> = {
  PENDIENTE:  ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['EN_PREP', 'CANCELADO'],
  EN_PREP:    ['LISTO'],
  LISTO:      ['ENTREGADO'],
  ENTREGADO:  [],
  CANCELADO:  [],
}

/**
 * Devuelve el estado de "avance" natural desde `codigo` (el siguiente en el flujo
 * lineal), ignorando CANCELADO. Útil para los botones de avance de los tableros.
 * Si no hay transición de avance (estado final), devuelve null.
 */
export function nextState(codigo: EstadoPedidoCodigo): EstadoPedidoCodigo | null {
  const forward = TRANSITIONS[codigo].filter((s) => s !== 'CANCELADO')
  return forward[0] ?? null
}
