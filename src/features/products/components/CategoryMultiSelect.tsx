import type { Category } from '@/features/categories/types'
import type { ProductCategoryInput } from '../types'

interface CategoryMultiSelectProps {
  label: string
  /** Categorías disponibles (típicamente, solo las activas) */
  available: Category[]
  value: ProductCategoryInput[]
  onChange: (value: ProductCategoryInput[]) => void
  /** Mensaje de error — si está definido, se muestra debajo */
  error?: string
  required?: boolean
}

/**
 * Selección múltiple de categorías con una marcada como "primaria".
 *
 * Reglas:
 * - Checkbox: incluir/excluir la categoría
 * - Radio: marcar como primaria (solo una entre las seleccionadas)
 * - Si seleccionás la primera, se marca como primaria automáticamente
 * - Si desmarcás la primaria y queda al menos una seleccionada, la primera pasa a ser primaria
 */
export function CategoryMultiSelect({
  label,
  available,
  value,
  onChange,
  error,
  required = false,
}: CategoryMultiSelectProps) {
  const selectedIds = new Set(value.map((v) => v.id))
  const primaryId   = value.find((v) => v.is_primary)?.id ?? null

  function toggleSelected(catId: number) {
    if (selectedIds.has(catId)) {
      // Quitar
      const next = value.filter((v) => v.id !== catId)
      // Si quitamos la primaria y queda al menos una, promovemos la primera
      if (primaryId === catId && next.length > 0) {
        next[0] = { ...next[0], is_primary: true }
      }
      onChange(next)
    } else {
      // Agregar — si era la única, queda primaria automáticamente
      const next = [...value, { id: catId, is_primary: value.length === 0 }]
      onChange(next)
    }
  }

  function setPrimary(catId: number) {
    onChange(value.map((v) => ({ ...v, is_primary: v.id === catId })))
  }

  const borderClass = error
    ? 'border-danger'
    : 'border-white/10'

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>

      <div className={`bg-rb-charcoal border ${borderClass} rounded-sm max-h-48 overflow-y-auto`}>
        {available.length === 0 ? (
          <p className="text-body-sm text-rb-bone/40 p-3">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {available.map((cat) => {
              const isSelected = selectedIds.has(cat.id)
              const isPrimary  = primaryId === cat.id

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-rb-bone/5 transition-colors"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelected(cat.id)}
                      className="accent-primary"
                    />
                    <span className="text-body-sm text-rb-bone">{cat.name}</span>
                  </label>

                  <label className={`flex items-center gap-1.5 ${
                    isSelected ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'
                  }`}>
                    <input
                      type="radio"
                      name="primary-category"
                      checked={isPrimary}
                      disabled={!isSelected}
                      onChange={() => setPrimary(cat.id)}
                      className="accent-primary"
                    />
                    <span className="text-data-mono text-[11px] text-rb-bone/70">Primaria</span>
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
