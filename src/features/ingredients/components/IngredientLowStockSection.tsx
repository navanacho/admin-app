import { AlertTriangle } from 'lucide-react'
import { useLowStockIngredients } from '../hooks/useIngredients'

const LOW_STOCK_THRESHOLD = 10

/**
 * Sección que muestra los ingredientes con stock bajo (debajo del threshold).
 * Se oculta si no hay ninguno. Espejada de products/LowStockSection.
 *
 * ⚠ Fuente de datos: cliente — filtra la primera página de ingredientes (limit=100).
 *    Cuando exista `/ingredientes/low-stock?threshold=N` en el backend, modificar
 *    `useLowStockIngredients` para llamarlo en lugar de filtrar.
 */
export function IngredientLowStockSection() {
  const { data, isLoading } = useLowStockIngredients(LOW_STOCK_THRESHOLD)

  if (isLoading)              return null
  if (!data || data.items.length === 0) return null

  return (
    <div className="bg-warning/5 border border-warning/30 rounded-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-warning" />
        <h3 className="text-label-caps text-warning">
          Ingredientes Bajo Stock — menos de {data.threshold} unidades
        </h3>
        <span className="text-data-mono text-warning ml-auto">
          {data.items.length} ingrediente{data.items.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {data.items.map((i) => (
          <li
            key={i.id}
            className="flex items-center justify-between px-3 py-2 bg-rb-paper/40 rounded-sm"
          >
            <span className="font-sans font-semibold text-body-sm text-on-surface">
              {i.name}
            </span>
            <span className="text-data-mono text-warning">
              {i.stock_quantity} unid.
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
