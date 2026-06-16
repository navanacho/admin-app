import { AlertTriangle } from 'lucide-react'
import { useLowStockProducts } from '../hooks/useProducts'

const LOW_STOCK_THRESHOLD = 10

/**
 * Sección que muestra los productos con stock bajo (debajo del threshold).
 * Se oculta si no hay ninguno.
 *
 * ⚠ Fuente de datos: cliente — filtra la primera página de products (limit=100).
 *    Cuando exista `/products/low-stock?threshold=N` en el backend, modificar
 *    `useLowStockProducts` para llamarlo en lugar de filtrar.
 */
export function LowStockSection() {
  const { data, isLoading } = useLowStockProducts(LOW_STOCK_THRESHOLD)

  if (isLoading)              return null
  if (!data || data.items.length === 0) return null

  return (
    <div className="bg-warning/5 border border-warning/30 rounded-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-warning" />
        <h3 className="text-label-caps text-warning">
          Productos con Stock Bajo — menos de {data.threshold} unidades
        </h3>
        <span className="text-data-mono text-warning ml-auto">
          {data.items.length} producto{data.items.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {data.items.map((p) => {
          const hasRecipe = p.ingredients.length > 0
          const stock = hasRecipe ? p.available_stock : p.stock_quantity
          return (
            <li
              key={p.id}
              className="flex items-center justify-between px-3 py-2 bg-rb-paper/40 rounded-sm"
            >
              <span className="font-sans font-semibold text-body-sm text-on-surface">
                {p.name}
                {hasRecipe && (
                  <span className="text-data-mono text-on-surface-variant ml-2 text-[11px]">
                    (receta)
                  </span>
                )}
              </span>
              <span className="text-data-mono text-warning">
                {stock} unid.
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
