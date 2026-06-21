import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { OrderStateBadge } from './OrderStateBadge'

const LIMIT = 5

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

interface UserOrdersSectionProps {
  usuarioId: number
}

/**
 * Sección que lista los pedidos de un usuario específico.
 * Pensado para embeber en la página de detalle de usuario.
 * Filas clickeables que llevan al detalle del pedido.
 */
export function UserOrdersSection({ usuarioId }: UserOrdersSectionProps) {
  const { useOrdersQuery } = useOrders()
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  const { data, isLoading } = useOrdersQuery(offset, LIMIT, undefined, usuarioId)

  const orders = data?.data ?? []
  const total = data?.total ?? 0

  const hasPrev = offset > 0
  const hasNext = offset + LIMIT < total

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <h2 className="text-headline-md text-on-surface">
          Pedidos del cliente
          {total > 0 && (
            <span className="ml-2 text-label-caps text-on-surface-variant">
              ({total})
            </span>
          )}
        </h2>
      </header>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
            Cargando...
          </p>
        ) : orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
            Este cliente no tiene pedidos registrados.
          </p>
        ) : (
          <table className="w-full">
            <thead className="border-b border-outline-variant">
              <tr>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant w-32">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
                  FECHA
                </th>
                <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
                  ÍTEMS
                </th>
                <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
                  TOTAL
                </th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
                  ESTADO
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemsCount = order.detalles.reduce(
                  (acc, d) => acc + d.cantidad,
                  0,
                )
                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="border-b border-outline-variant last:border-0 transition-colors hover:bg-surface-container cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-data-mono text-primary">
                        {formatId(order.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm text-on-surface-variant">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-data-mono text-on-surface">
                        {itemsCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-data-mono text-rb-bone font-semibold">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStateBadge codigo={order.estado_codigo} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación compacta */}
      {total > LIMIT && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant">
          <span className="text-body-sm text-on-surface-variant">
            Mostrando {offset + 1}–{Math.min(offset + LIMIT, total)} de {total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={!hasPrev}
              className="px-3 py-1.5 text-body-sm text-on-surface border border-outline-variant rounded-sm hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={!hasNext}
              className="px-3 py-1.5 text-body-sm bg-rb-ink text-rb-bone rounded-sm hover:bg-rb-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
