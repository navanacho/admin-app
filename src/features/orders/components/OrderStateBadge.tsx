import type { EstadoPedidoCodigo } from '../types'

const STATE_STYLES: Record<EstadoPedidoCodigo, string> = {
  PENDIENTE:  'bg-warning/15 text-warning',
  CONFIRMADO: 'bg-primary-container/20 text-primary',
  EN_PREP:    'bg-primary-container/20 text-primary',
  LISTO:      'bg-success/15 text-success',
  ENTREGADO:  'bg-success text-on-primary',
  CANCELADO:  'bg-danger/15 text-danger',
}

const STATE_LABELS: Record<EstadoPedidoCodigo, string> = {
  PENDIENTE:  'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP:    'En preparación',
  LISTO:      'Listo',
  ENTREGADO:  'Entregado',
  CANCELADO:  'Cancelado',
}

interface OrderStateBadgeProps {
  codigo: EstadoPedidoCodigo
}

export function OrderStateBadge({ codigo }: OrderStateBadgeProps) {
  return (
    <span className={`text-label-caps px-2 py-1 rounded-sm ${STATE_STYLES[codigo]}`}>
      {STATE_LABELS[codigo]}
    </span>
  )
}

export function getStateLabel(codigo: EstadoPedidoCodigo): string {
  return STATE_LABELS[codigo]
}
