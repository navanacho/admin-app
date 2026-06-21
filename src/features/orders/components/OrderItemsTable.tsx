import { AlertTriangle } from 'lucide-react'
import type { DetallePedido } from '../types'
import { useProducts } from '@/features/products/hooks/useProducts'

function formatPrice(value: string): string {
  const n = parseFloat(value)
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function IngredientList({ productId }: { productId: number }) {
  const { useProductById } = useProducts()
  const { data: product, isLoading } = useProductById(productId)

  if (isLoading) return (
    <span className="text-[10px] text-on-surface-variant mt-1 block">cargando...</span>
  )
  if (!product || product.ingredients.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-1 mt-1.5">
      {product.ingredients.map((ing) => (
        <li
          key={ing.id}
          className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-sm ${
            ing.is_allergen
              ? 'bg-warning/15 text-warning'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {ing.is_allergen && <AlertTriangle size={9} aria-hidden="true" />}
          {ing.name}
          <span className="opacity-60 ml-0.5">×{ing.quantity}</span>
        </li>
      ))}
    </ul>
  )
}

interface OrderItemsTableProps {
  detalles: DetallePedido[]
  /**
   * Si es false, oculta las columnas de precio (P. unit. y Subtotal) y solo
   * muestra producto + cantidad. Útil para cocina, que solo necesita saber
   * qué preparar. Default: true.
   */
  showPrices?: boolean
  /** Si es true, muestra los ingredientes de cada producto (fetch por producto). */
  showIngredients?: boolean
}

/**
 * Tabla de productos de un pedido. Reutilizada por el detalle full-page
 * (OrderDetailPage) y por el detalle en modal de los tableros (OrderDetailModal).
 */
export function OrderItemsTable({ detalles, showPrices = true, showIngredients = false }: OrderItemsTableProps) {
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
                {showIngredients && <IngredientList productId={d.producto_id} />}
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
