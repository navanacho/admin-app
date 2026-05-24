import type { EstadoPedido, EstadoPedidoCodigo } from '../types'
import { getStateLabel } from './OrderStateBadge'

interface OrderStatusFilterProps {
  estados: EstadoPedido[]
  /** null = "Todos" */
  selectedEstadoId: number | null
  onSelect: (estadoId: number | null) => void
  /** Conteos por estado_id (opcionales). El "Todos" usa total. */
  counts?: Record<number, number>
  total?: number
}

export function OrderStatusFilter({
  estados,
  selectedEstadoId,
  onSelect,
  counts,
  total,
}: OrderStatusFilterProps) {
  const baseChip =
    'px-4 py-2 rounded-full text-label-caps border transition-colors whitespace-nowrap'
  const active =
    'bg-primary text-on-primary border-primary shadow-red'
  const inactive =
    'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface hover:bg-surface-container-high'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${baseChip} ${selectedEstadoId === null ? active : inactive}`}
      >
        Todos {total != null && <span className="opacity-70 ml-1">({total})</span>}
      </button>

      {estados.map((estado) => {
        const isSelected = selectedEstadoId === estado.id
        const count = counts?.[estado.id]
        return (
          <button
            key={estado.id}
            type="button"
            onClick={() => onSelect(estado.id)}
            className={`${baseChip} ${isSelected ? active : inactive}`}
          >
            {getStateLabel(estado.codigo as EstadoPedidoCodigo)}
            {count != null && <span className="opacity-70 ml-1">({count})</span>}
          </button>
        )
      })}
    </div>
  )
}
