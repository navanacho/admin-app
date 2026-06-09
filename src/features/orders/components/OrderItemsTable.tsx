import type { DetallePedido } from '../types'

function formatPrice(value: string): string {
  const n = parseFloat(value)
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface OrderItemsTableProps {
  detalles: DetallePedido[]
  /**
   * Si es false, oculta las columnas de precio (P. unit. y Subtotal) y solo
   * muestra producto + cantidad. Útil para cocina, que solo necesita saber
   * qué preparar. Default: true.
   */
  showPrices?: boolean
}

/**
 * Tabla de productos de un pedido. Reutilizada por el detalle full-page
 * (OrderDetailPage) y por el detalle en modal de los tableros (OrderDetailModal).
 */
export function OrderItemsTable({ detalles, showPrices = true }: OrderItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-outline-variant">
          <tr>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
              PRODUCTO
            </th>
            {showPrices && (
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
                P. UNIT.
              </th>
            )}
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
              CANT.
            </th>
            {showPrices && (
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
                SUBTOTAL
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id} className="border-b border-outline-variant last:border-0">
              <td className="px-6 py-4">
                <span className="font-sans font-semibold text-body-sm text-on-surface">
                  {d.producto_nombre}
                </span>
              </td>
              {showPrices && (
                <td className="px-6 py-4 text-right">
                  <span className="text-data-mono text-on-surface-variant">
                    {formatPrice(d.producto_precio_unitario)}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 text-right">
                <span className="text-data-mono text-on-surface">{d.cantidad}</span>
              </td>
              {showPrices && (
                <td className="px-6 py-4 text-right">
                  <span className="text-data-mono text-on-surface font-semibold">
                    {formatPrice(d.subtotal)}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
