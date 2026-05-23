import { AlertTriangle } from 'lucide-react'
import type { Ingredient } from '@/features/ingredients/types'
import type { ProductIngredientInput } from '../types'

interface IngredientMultiSelectProps {
  label: string
  /** Ingredientes disponibles (típicamente, solo los activos) */
  available: Ingredient[]
  value: ProductIngredientInput[]
  onChange: (value: ProductIngredientInput[]) => void
  error?: string
}

/**
 * Selección múltiple de ingredientes con flag "removible" por cada uno.
 *
 * Reglas:
 * - Checkbox principal: incluir/excluir el ingrediente en el producto
 * - Checkbox "Removible": indica si el cliente puede pedir que se quite al hacer un pedido
 *   (solo habilitado si el ingrediente está incluido)
 */
export function IngredientMultiSelect({
  label,
  available,
  value,
  onChange,
  error,
}: IngredientMultiSelectProps) {
  const selectedMap = new Map(value.map((v) => [v.id, v]))

  function toggleSelected(id: number) {
    if (selectedMap.has(id)) {
      onChange(value.filter((v) => v.id !== id))
    } else {
      onChange([...value, { id, is_removable: false }])
    }
  }

  function toggleRemovable(id: number) {
    onChange(
      value.map((v) =>
        v.id === id ? { ...v, is_removable: !v.is_removable } : v,
      ),
    )
  }

  const borderClass = error ? 'border-danger' : 'border-white/10'

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">{label}</label>

      <div className={`bg-rb-charcoal border ${borderClass} rounded-sm max-h-48 overflow-y-auto`}>
        {available.length === 0 ? (
          <p className="text-body-sm text-rb-bone/40 p-3">
            No hay ingredientes disponibles.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {available.map((ing) => {
              const selected  = selectedMap.get(ing.id)
              const isChecked = !!selected

              return (
                <div
                  key={ing.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-rb-bone/5 transition-colors"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelected(ing.id)}
                      className="accent-primary"
                    />
                    <span className="text-body-sm text-rb-bone flex items-center gap-1.5">
                      {ing.name}
                      {ing.is_allergen && (
                        <AlertTriangle size={12} className="text-warning" aria-label="Alérgeno" />
                      )}
                    </span>
                  </label>

                  <label className={`flex items-center gap-1.5 ${
                    isChecked ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selected?.is_removable ?? false}
                      disabled={!isChecked}
                      onChange={() => toggleRemovable(ing.id)}
                      className="accent-primary"
                    />
                    <span className="text-data-mono text-[11px] text-rb-bone/70">Removible</span>
                  </label>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-data-mono text-danger text-[11px]">{error}</p>
      )}
    </div>
  )
}
