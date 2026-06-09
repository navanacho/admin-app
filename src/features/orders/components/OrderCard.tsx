import { ArrowRight, Eye, X } from 'lucide-react'

import type { Pedido } from '../types'
import { nextState } from '../lib/transitions'
import { getStateLabel, OrderStateBadge } from './OrderStateBadge'

function formatId(id: number): string {
  return `#PED-${String(id).padStart(4, '0')}`
}

function formatPrice(value: string): string {
  const n = parseFloat(value)
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface OrderCardProps {
  pedido: Pedido
  /** Abre el detalle del pedido. */
  onOpenDetail: (id: number) => void
  /**
   * Avanza el pedido a su siguiente estado. Si se omite, la card es read-only
   * (no muestra botón de avance) — usado por columnas no modificables.
   */
  onAdvance?: (pedido: Pedido) => void
  /**
   * Cancela el pedido. Si se omite, no muestra botón de cancelar. Solo se pasa
   * en estados donde la cancelación es válida (ej: PENDIENTE en el cajero).
   */
  onCancel?: (pedido: Pedido) => void
  /** Muestra el total del pedido en la card. Default: false. */
  showTotal?: boolean
  /** Muestra el badge del estado del pedido en el header (panel read-only). */
  showState?: boolean
  /** Deshabilita los botones de acción mientras hay una mutación en curso. */
  isAdvancing?: boolean
}

/**
 * Card de un pedido para los tableros tipo Trello (cocina / cajero).
 * Muestra el ID, cantidad de ítems y, opcionalmente, total. El botón de avance
 * usa la máquina de transiciones compartida para etiquetar el siguiente estado.
 */
export function OrderCard({
  pedido,
  onOpenDetail,
  onAdvance,
  onCancel,
  showTotal = false,
  showState = false,
  isAdvancing = false,
}: OrderCardProps) {
  const itemsCount = pedido.detalles.reduce((acc, d) => acc + d.cantidad, 0)
  const next = nextState(pedido.estado_codigo)

  return (
    <article className="bg-surface-container border border-outline-variant rounded-md p-3 flex flex-col gap-stack-sm">
      <header className="flex items-center justify-between gap-2">
        <span className="text-data-mono text-primary font-semibold">
          {formatId(pedido.id)}
        </span>
        {showState ? (
          <OrderStateBadge codigo={pedido.estado_codigo} />
        ) : (
          showTotal && (
            <span className="text-data-mono text-on-surface">{formatPrice(pedido.total)}</span>
          )
        )}
      </header>

      <p className="text-body-sm text-on-surface-variant">
        {itemsCount} ítem{itemsCount === 1 ? '' : 's'} · {pedido.detalles.length} producto
        {pedido.detalles.length === 1 ? '' : 's'}
      </p>

      <footer className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onOpenDetail(pedido.id)}
          className="flex items-center gap-1.5 px-3 py-2 text-label-caps text-on-surface border border-outline-variant rounded-sm hover:bg-surface-container-high transition-colors"
        >
          <Eye size={14} aria-hidden="true" /> Detalle
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={() => onCancel(pedido)}
            disabled={isAdvancing}
            className="flex items-center gap-1.5 px-3 py-2 text-label-caps text-danger border border-danger/40 rounded-sm hover:bg-danger/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <X size={14} aria-hidden="true" /> Cancelar
          </button>
        )}

        {onAdvance && next && (
          <button
            type="button"
            onClick={() => onAdvance(pedido)}
            disabled={isAdvancing}
            className="flex items-center gap-1.5 px-3 py-2 text-label-caps bg-primary text-on-primary rounded-sm shadow-red enabled:hover:bg-rb-red-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-auto"
          >
            {getStateLabel(next)} <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </footer>
    </article>
  )
}
