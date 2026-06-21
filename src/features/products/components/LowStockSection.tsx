import { AlertTriangle, PackageX, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types'
const { useLowStockProducts} = useProducts();
interface Props {
  onEdit?: (product: Product) => void
}

export function LowStockSection({ onEdit }: Props) {
  const { data, isLoading } = useLowStockProducts()

  if (isLoading)              return null
  if (!data || data.items.length === 0) return null

  return (
    <div className="bg-warning/5 border border-warning/30 rounded-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-warning" />
        <h3 className="text-label-caps text-warning">
          Productos Sin Stock
        </h3>
        <span className="text-data-mono text-warning ml-auto">
          {data.items.length} producto{data.items.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {data.items.map((p) => {
          const hasRecipe = p.ingredients.length > 0
          const stock = hasRecipe ? p.available_stock : p.stock_quantity
          const isOutOfStock = stock <= 0
          const missingIngredients = hasRecipe
            ? p.ingredients.filter((i) => !i.has_stock)
            : []
          return (
            <li
              key={p.id}
              className="flex flex-col gap-1 px-3 py-2 bg-rb-paper/40 rounded-sm"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onEdit?.(p)}
                  className="group flex items-center gap-2 text-left cursor-pointer"
                >
                  <span className="font-sans font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    {p.name}
                    {hasRecipe && (
                      <span className="text-data-mono text-on-surface-variant ml-2">
                        (receta)
                      </span>
                    )}
                  </span>
                  <Pencil
                    size={11}
                    className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    aria-hidden="true"
                  />
                </button>
                <span className={`text-data-mono ${isOutOfStock ? 'text-danger font-bold' : 'text-warning'}`}>
                  {stock} unid.
                </span>
              </div>
              {isOutOfStock && missingIngredients.length > 0 && (
                <ul className="flex flex-col gap-0.5 pl-2 border-l-2 border-danger/30">
                  {missingIngredients.map((ing) => (
                    <li key={ing.id} className="flex items-center gap-1.5 text-[11px]">
                      <PackageX size={11} className="text-danger shrink-0" aria-hidden="true" />
                      <Link
                        to="/ingredients"
                        className="text-danger hover:text-danger/70 transition-colors"
                      >
                        {ing.name}
                      </Link>
                      <span className="text-danger/60">— sin stock</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
