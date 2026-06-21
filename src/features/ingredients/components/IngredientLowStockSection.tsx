import { AlertTriangle, Pencil } from 'lucide-react'
import { useIngredients } from '../hooks/useIngredients'
import type { Ingredient } from '../types'

interface Props {
  onEdit?: (ingredient: Ingredient) => void
}

export function IngredientLowStockSection({ onEdit }: Props) {
  const { useLowStockIngredients } = useIngredients()
  const { data, isLoading } = useLowStockIngredients()

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
          <li key={i.id}>
            <button
              type="button"
              onClick={() => onEdit?.(i)}
              className="group w-full flex items-center justify-between px-3 py-2 bg-rb-paper/40 rounded-sm text-left transition-colors hover:bg-rb-paper/70 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="font-sans font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors">
                  {i.name}
                </span>
                <Pencil
                  size={11}
                  className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
              </span>
              <span className="text-data-mono text-warning">
                {i.stock_quantity} unid.
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
