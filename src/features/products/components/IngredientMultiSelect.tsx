import { useMemo, useRef, useState } from 'react'
import { AlertTriangle, Plus, Search, X } from 'lucide-react'
import type { Ingredient } from '@/features/ingredients/types'
import type { ProductIngredientInput } from '../types'
import { Stepper } from '@/shared/components/Stepper'
import { EmptyHint } from '@/shared/components/EmptyHint'

interface IngredientMultiSelectProps {
  label: string
  /** Ingredientes disponibles (típicamente, solo los activos) */
  available: Ingredient[]
  value: ProductIngredientInput[]
  onChange: (value: ProductIngredientInput[]) => void
  error?: string
}

/**
 * Selección de ingredientes con cantidad y flag "removible".
 *  - Arriba: cards de los ingredientes ya en la receta (stepper + removible + X).
 *  - Abajo: buscador con dropdown para sumar ingredientes nuevos.
 */
export function IngredientMultiSelect({
  label,
  available,
  value,
  onChange,
  error,
}: IngredientMultiSelectProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedMap = useMemo(
    () => new Map(value.map((v) => [v.id, v])),
    [value],
  )
  const availableById = useMemo(
    () => new Map(available.map((i) => [i.id, i])),
    [available],
  )
  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase()
    return available
      .filter((i) => !selectedMap.has(i.id))
      .filter((i) => q === '' || i.name.toLowerCase().includes(q))
  }, [available, selectedMap, query])

  const showDropdown = focused || query.length > 0

  function addIngredient(id: number) {
    onChange([...value, { id, is_removable: false, quantity: 1 }])
    setQuery('')
    inputRef.current?.focus()
  }

  function removeIngredient(id: number) {
    onChange(value.filter((v) => v.id !== id))
  }

  function toggleRemovable(id: number) {
    onChange(
      value.map((v) =>
        v.id === id ? { ...v, is_removable: !v.is_removable } : v,
      ),
    )
  }

  function setQuantity(id: number, next: number) {
    onChange(value.map((v) => (v.id === id ? { ...v, quantity: next } : v)))
  }

  return (
    <div className="flex flex-col gap-stack-sm">
      <div className="flex items-baseline justify-between">
        <label className="text-label-caps text-rb-bone/60">{label}</label>
        <span className="text-data-mono text-[11px] text-rb-bone/50">
          {value.length} en la receta
        </span>
      </div>

      {/* ── Buscador + dropdown ──────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={14}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-rb-bone/40 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          // Delay para que el onMouseDown del dropdown gane la carrera.
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder="Buscar ingrediente para sumar a la receta…"
          className={`w-full bg-rb-charcoal border rounded-sm pl-9 pr-3 py-2 text-body-sm text-rb-bone placeholder:text-rb-bone/30 focus:outline-none transition-colors ${
            error ? 'border-danger focus:border-danger' : 'border-white/10 focus:border-primary'
          }`}
        />

        {showDropdown && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-rb-charcoal border border-white/10 rounded-sm max-h-48 overflow-y-auto shadow-ink">
            {candidates.length === 0 ? (
              <p className="text-body-sm text-rb-bone/40 px-3 py-3">
                {query.trim() === ''
                  ? 'Ya sumaste todos los ingredientes disponibles.'
                  : 'Sin coincidencias.'}
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {candidates.map((ing) => (
                  <li key={ing.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        addIngredient(ing.id)
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-rb-bone/5 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 text-body-sm text-rb-bone">
                        {ing.name}
                        {ing.is_allergen && (
                          <AlertTriangle
                            size={12}
                            className="text-warning"
                            aria-label="Alérgeno"
                          />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-data-mono text-[11px] text-primary">
                        <Plus size={12} /> agregar
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ── Seleccionados ────────────────────────────────────────────── */}
      {value.length === 0 ? (
        <EmptyHint>
          No hay ingredientes en la receta — buscá abajo para sumar.
        </EmptyHint>
      ) : (
        <div className="flex flex-col gap-stack-sm">
          {value.map((v) => {
            const ing = availableById.get(v.id)
            if (!ing) return null
            const qty = v.quantity ?? 1
            return (
              <div
                key={v.id}
                className="bg-rb-paper/30 border border-white/15 rounded-md p-3 flex flex-col gap-stack-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-sans font-semibold text-body-sm text-rb-bone truncate">
                      {ing.name}
                    </span>
                    {ing.is_allergen && (
                      <AlertTriangle
                        size={13}
                        className="text-warning shrink-0"
                        aria-label="Alérgeno"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(v.id)}
                    aria-label={`Quitar ${ing.name}`}
                    className="p-1 text-rb-bone/50 hover:text-danger rounded-sm hover:bg-danger/10 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-stack-md">
                  <div className="flex items-center gap-2">
                    <span className="text-data-mono text-[11px] text-rb-bone/60">
                      Cantidad
                    </span>
                    <Stepper
                      value={qty}
                      onChange={(n) => setQuantity(v.id, n)}
                      ariaLabel={`Cantidad de ${ing.name}`}
                    />
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={v.is_removable}
                      onChange={() => toggleRemovable(v.id)}
                      className="accent-primary"
                    />
                    <span className="text-data-mono text-[11px] text-rb-bone/70">
                      El cliente puede quitarlo
                    </span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      )}

      

      {error && (
        <p className="text-data-mono text-danger text-[11px]">{error}</p>
      )}
    </div>
  )
}
