import { useEffect, useMemo, useState } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import type { ProductFilters as Filters } from '../services/productService'
import type { Category } from '@/features/categories/types'
import type { Ingredient } from '@/features/ingredients/types'

interface Props {
  categories: Category[]
  ingredients: Ingredient[]
  value: Filters
  onChange: (next: Filters) => void
  includeDeleted: boolean
  onIncludeDeletedChange: (v: boolean) => void
}

/**
 * Construye una lista plana de categorías indentadas según jerarquía,
 * para mostrarlas en el <select> respetando el árbol.
 */
function flattenCategoryTree(
  categories: Category[],
): Array<{ id: number; label: string }> {
  const childrenMap = new Map<number | null, Category[]>()
  for (const c of categories) {
    const key = c.parent_id ?? null
    if (!childrenMap.has(key)) childrenMap.set(key, [])
    childrenMap.get(key)!.push(c)
  }
  for (const list of childrenMap.values()) {
    list.sort((a, b) => a.order_display - b.order_display)
  }

  const result: Array<{ id: number; label: string }> = []
  const walk = (parentId: number | null, depth: number) => {
    const items = childrenMap.get(parentId) ?? []
    for (const cat of items) {
      result.push({ id: cat.id, label: `${'— '.repeat(depth)}${cat.name}` })
      walk(cat.id, depth + 1)
    }
  }
  walk(null, 0)
  return result
}

export function ProductFilters({
  categories,
  ingredients,
  value,
  onChange,
  includeDeleted,
  onIncludeDeletedChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  // Input local con debounce → propaga al padre
  const [nameInput, setNameInput] = useState(value.name ?? '')
  const debouncedName = useDebouncedValue(nameInput, 300)

  useEffect(() => {
    if ((value.name ?? '') !== debouncedName) {
      onChange({ ...value, name: debouncedName || undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  // Precios — también con debounce para no martillar
  const [priceMinInput, setPriceMinInput] = useState<string>(
    value.priceMin != null ? String(value.priceMin) : '',
  )
  const [priceMaxInput, setPriceMaxInput] = useState<string>(
    value.priceMax != null ? String(value.priceMax) : '',
  )
  const debouncedMin = useDebouncedValue(priceMinInput, 300)
  const debouncedMax = useDebouncedValue(priceMaxInput, 300)

  useEffect(() => {
    const parsed = debouncedMin === '' ? undefined : Number(debouncedMin)
    if (parsed !== value.priceMin) onChange({ ...value, priceMin: parsed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin])

  useEffect(() => {
    const parsed = debouncedMax === '' ? undefined : Number(debouncedMax)
    if (parsed !== value.priceMax) onChange({ ...value, priceMax: parsed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMax])

  const categoryOptions = useMemo(() => flattenCategoryTree(categories), [categories])

  const selectedIngredientIds = value.ingredientIds ?? []
  const selectedIngredients = useMemo(
    () => ingredients.filter((i) => selectedIngredientIds.includes(i.id)),
    [ingredients, selectedIngredientIds],
  )
  const availableIngredients = useMemo(
    () => ingredients.filter((i) => !selectedIngredientIds.includes(i.id)),
    [ingredients, selectedIngredientIds],
  )

  function handleAddIngredient(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = Number(e.target.value)
    if (!id) return
    onChange({ ...value, ingredientIds: [...selectedIngredientIds, id] })
    e.target.value = ''
  }

  function handleRemoveIngredient(id: number) {
    const next = selectedIngredientIds.filter((x) => x !== id)
    onChange({ ...value, ingredientIds: next.length > 0 ? next : undefined })
  }

  function handleClear() {
    setNameInput('')
    setPriceMinInput('')
    setPriceMaxInput('')
    onIncludeDeletedChange(false)
    onChange({})
  }

  const activeFilterCount =
    (value.name ? 1 : 0) +
    (value.categoryId != null ? 1 : 0) +
    (value.priceMin != null ? 1 : 0) +
    (value.priceMax != null ? 1 : 0) +
    (selectedIngredientIds.length > 0 ? 1 : 0) +
    (includeDeleted ? 1 : 0)
  const hasAnyFilter = activeFilterCount > 0

  const inputCls =
    'w-full bg-surface-container-low border border-outline-variant rounded-sm px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary'

  return (
    <div className="bg-surface-container rounded-md p-gutter flex flex-col gap-stack-md">
      <div className="flex items-center justify-between gap-stack-sm">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 text-label-caps text-on-surface hover:text-primary transition-colors"
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filtros
          {hasAnyFilter && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary text-on-primary text-[10px] font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
          {isOpen ? (
            <ChevronUp size={14} aria-hidden="true" />
          ) : (
            <ChevronDown size={14} aria-hidden="true" />
          )}
        </button>

        {hasAnyFilter && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-label-caps text-on-surface-variant hover:text-primary transition-colors"
          >
            <X size={12} aria-hidden="true" /> Limpiar
          </button>
        )}
      </div>

      {!isOpen ? null : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md">
        {/* Buscar por nombre */}
        <label className="flex flex-col gap-1">
          <span className="text-label-caps text-on-surface-variant">Buscar</span>
          <div className="relative">
            <Search
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nombre del producto…"
              className={`${inputCls} pl-9`}
            />
          </div>
        </label>

        {/* Categoría con cascada */}
        <label className="flex flex-col gap-1">
          <span className="text-label-caps text-on-surface-variant">
            Categoría (incluye subcategorías)
          </span>
          <select
            value={value.categoryId ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                categoryId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className={inputCls}
          >
            <option value="">Todas</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        {/* Rango de precio */}
        <label className="flex flex-col gap-1">
          <span className="text-label-caps text-on-surface-variant">Precio mín.</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={priceMinInput}
            onChange={(e) => setPriceMinInput(e.target.value)}
            placeholder="$0"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-label-caps text-on-surface-variant">Precio máx.</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={priceMaxInput}
            onChange={(e) => setPriceMaxInput(e.target.value)}
            placeholder="$∞"
            className={inputCls}
          />
        </label>
      </div>

      {/* Multi-select de ingredientes (AND) */}
      <div className="flex flex-col gap-1">
        <span className="text-label-caps text-on-surface-variant">
          Ingredientes (debe contener TODOS)
        </span>
        <select
          value=""
          onChange={handleAddIngredient}
          className={inputCls}
          disabled={availableIngredients.length === 0}
        >
          <option value="">+ Agregar ingrediente…</option>
          {availableIngredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name}
            </option>
          ))}
        </select>

        {selectedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedIngredients.map((ing) => (
              <span
                key={ing.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-label-caps px-2 py-1 rounded-sm"
              >
                {ing.name}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ing.id)}
                  aria-label={`Quitar ${ing.name}`}
                  className="hover:text-rb-red-hover"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toggle: incluir productos eliminados */}
      <label className="flex items-center gap-stack-sm text-label-caps text-on-surface-variant cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={includeDeleted}
          onChange={(e) => onIncludeDeletedChange(e.target.checked)}
          className="accent-primary"
        />
        Ver eliminados
      </label>
      </>
      )}
    </div>
  )
}
