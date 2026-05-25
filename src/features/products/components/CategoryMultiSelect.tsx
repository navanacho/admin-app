import { useMemo } from 'react'
import { ChevronRight, Star } from 'lucide-react'
import type { Category } from '@/features/categories/types'
import type { ProductCategoryInput } from '../types'
import { Chip } from '@/shared/components/Chip'
import { EmptyHint } from '@/shared/components/EmptyHint'
import {
  buildCategoryMap,
  getCategoryPath,
  groupByRoot,
} from '@/features/categories/lib/hierarchy'

interface CategoryMultiSelectProps {
  label: string
  /** Categorías disponibles (típicamente, solo las activas) */
  available: Category[]
  value: ProductCategoryInput[]
  onChange: (value: ProductCategoryInput[]) => void
  error?: string
  required?: boolean
}

/**
 * Selección de categorías con chips, agrupadas por jerarquía.
 *  - Arriba: chips de seleccionadas mostrando el path completo (`Padre › Hijo`).
 *  - Abajo: chips de disponibles agrupadas bajo la raíz a la que pertenecen.
 *    El usuario puede elegir una raíz, una subcategoría, o ambas.
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

  const byId = useMemo(() => buildCategoryMap(available), [available])

  const selectedList = value
    .map((v) => byId.get(v.id))
    .filter((c): c is Category => c != null)

  const availableGroups = useMemo(
    () =>
      groupByRoot(
        available.filter((c) => !selectedIds.has(c.id)),
        byId,
      ),
    // selectedIds es derivado de value: usar value como dep estable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [available, byId, value],
  )

  function addCategory(catId: number) {
    onChange([...value, { id: catId, is_primary: value.length === 0 }])
  }

  function removeCategory(catId: number) {
    const next = value.filter((v) => v.id !== catId)
    if (primaryId === catId && next.length > 0) {
      next[0] = { ...next[0], is_primary: true }
    }
    onChange(next)
  }

  function setPrimary(catId: number) {
    onChange(value.map((v) => ({ ...v, is_primary: v.id === catId })))
  }

  return (
    <div className="flex flex-col gap-stack-sm">
      <div className="flex items-baseline justify-between">
        <label className="text-label-caps text-rb-bone/60">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
        <span className="text-data-mono text-[11px] text-rb-bone/50">
          {value.length} seleccionada{value.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* ── Seleccionadas ────────────────────────────────────────────── */}
      {selectedList.length === 0 ? (
        <EmptyHint size="sm">
          Elegí al menos una categoría. La primera será la primaria.
        </EmptyHint>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedList.map((cat) => {
            const isPrimary = primaryId === cat.id
            const path = getCategoryPath(cat.id, byId)
            return (
              <Chip
                key={cat.id}
                variant={isPrimary ? 'primary' : 'selected'}
                leading={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPrimary(cat.id)
                    }}
                    aria-label={
                      isPrimary
                        ? 'Categoría primaria'
                        : `Marcar ${cat.name} como primaria`
                    }
                    className={`p-0.5 rounded-sm transition-colors ${
                      isPrimary ? 'text-primary' : 'text-rb-bone/40 hover:text-primary'
                    }`}
                  >
                    <Star size={14} fill={isPrimary ? 'currentColor' : 'none'} />
                  </button>
                }
                onRemove={() => removeCategory(cat.id)}
                removeLabel={`Quitar ${cat.name}`}
              >
                <span className="inline-flex items-center gap-1">
                  {path.length > 1 && (
                    <>
                      <span className="text-rb-bone/50 font-normal">
                        {path
                          .slice(0, -1)
                          .map((p) => p.name)
                          .join(' › ')}
                      </span>
                      <ChevronRight
                        size={11}
                        className="text-rb-bone/40 shrink-0"
                        aria-hidden="true"
                      />
                    </>
                  )}
                  {cat.name}
                </span>
              </Chip>
            )
          })}
        </div>
      )}

      {/* ── Disponibles, agrupadas por raíz ───────────────────────────── */}
      {availableGroups.length > 0 && (
        <div className="flex flex-col gap-stack-sm mt-stack-sm">
          <span className="text-data-mono text-[11px] text-rb-bone/40">
            Disponibles
          </span>
          {availableGroups.map((group) => (
            <div
              key={group.root.id}
              className="flex flex-col gap-1.5 pl-3 border-l border-white/10"
            >
              <span className="text-label-caps text-rb-bone/50">
                {group.root.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((cat) => {
                  const isRoot = cat.id === group.root.id
                  return (
                    <Chip
                      key={cat.id}
                      variant="available"
                      onClick={() => addCategory(cat.id)}
                    >
                      + {isRoot ? cat.name : cat.name}
                      {!isRoot && (
                        <span className="text-rb-bone/40 font-normal ml-1">
                          (sub)
                        </span>
                      )}
                    </Chip>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {available.length === 0 && (
        <p className="text-body-sm text-rb-bone/40">
          No hay categorías disponibles.
        </p>
      )}

      {error && (
        <p className="text-data-mono text-danger text-[11px]">{error}</p>
      )}
    </div>
  )
}
