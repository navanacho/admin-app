import { useMemo } from 'react'
import { EntityTable } from '@/shared/components/EntityTable'
import { usePagination } from '@/shared/hooks/usePagination'
import { OrderStateBadge } from './OrderStateBadge'
import type { Pedido } from '../types'

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

function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

interface DeliveredOrdersTableProps {
  pedidos: Pedido[]
  onOpenDetail: (id: number) => void
  isLoading?: boolean
  /** Título del bloque. Default: "Entregados". */
  title?: string
}

/**
 * Tabla read-only de pedidos en estado terminal (ENTREGADO y, en el cajero,
 * también CANCELADO), en la parte inferior de los tableros. Muestra el estado
 * con un badge, ordena por updated_at desc y pagina client-side.
 */
export function DeliveredOrdersTable({
  pedidos,
  onOpenDetail,
  isLoading,
  title = 'Entregados',
}: DeliveredOrdersTableProps) {
  const ordered = useMemo(
    () =>
      [...pedidos].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      ),
    [pedidos],
  )
  const { paginatedData, pagination } = usePagination(ordered, 5)

  return (
    <EntityTable
      title={title}
      entityLabel="pedidos"
      isLoading={isLoading}
      isEmpty={pedidos.length === 0}
      pagination={pagination}
      thead={
        <tr>
          <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">PEDIDO</th>
          <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ESTADO</th>
          <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ÍTEMS</th>
          <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">TOTAL</th>
          <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ACTUALIZADO</th>
        </tr>
      }
    >
      {paginatedData.map((p) => {
        const itemsCount = p.detalles.reduce((acc, d) => acc + d.cantidad, 0)
        return (
          <tr
            key={p.id}
            onClick={() => onOpenDetail(p.id)}
            className="border-b border-outline-variant last:border-0 cursor-pointer hover:bg-surface-container transition-colors"
          >
            <td className="px-6 py-4">
              <span className="text-data-mono text-primary font-semibold">{formatId(p.id)}</span>
            </td>
            <td className="px-6 py-4">
              <OrderStateBadge codigo={p.estado_codigo} />
            </td>
            <td className="px-6 py-4 text-right">
              <span className="text-data-mono text-on-surface">{itemsCount}</span>
            </td>
            <td className="px-6 py-4 text-right">
              <span className="text-data-mono text-on-surface">{formatPrice(p.total)}</span>
            </td>
            <td className="px-6 py-4 text-right">
              <span className="text-data-mono text-on-surface-variant text-[11px]">
                {formatDate(p.updated_at)}
              </span>
            </td>
          </tr>
        )
      })}
    </EntityTable>
  )
}
