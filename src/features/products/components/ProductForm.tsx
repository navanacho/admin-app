import { useRef, useState } from 'react'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { ImageUrlsField } from './ImageUrlsField'
import { CategoryMultiSelect } from './CategoryMultiSelect'
import { IngredientMultiSelect } from './IngredientMultiSelect'

import type { Category } from '@/features/categories/types'
import type { Ingredient } from '@/features/ingredients/types'
import type {
  CreateProductDto,
  ProductCategoryInput,
  ProductIngredientInput,
} from '../types'

interface ProductFormProps {
  initialValues?: Partial<CreateProductDto>
  availableCategories: Category[]
  availableIngredients: Ingredient[]
  onSubmit: (dto: CreateProductDto) => void
  onCancel: () => void
  isPending?: boolean
}

type ProductType = 'recipe' | 'standalone'

// ── Validaciones puras ────────────────────────────────────────────────────────

function validateName(value: string): string | undefined {
  if (value.trim().length === 0) return 'El nombre es requerido'
  if (value.trim().length < 2)   return 'Mínimo 2 caracteres'
  if (value.trim().length > 150) return 'Máximo 150 caracteres'
}

function validatePrice(value: number): string | undefined {
  if (Number.isNaN(value))  return 'Debe ser un número'
  if (value < 0)            return 'No puede ser negativo'
}

function validateStock(value: number): string | undefined {
  if (!Number.isInteger(value)) return 'Debe ser un número entero'
  if (value < 0)                return 'No puede ser negativo'
}

function validatePrepTime(value: number | null): string | undefined {
  if (value == null) return
  if (!Number.isInteger(value)) return 'Debe ser un número entero'
  if (value < 0)                return 'No puede ser negativo'
}

function validateCategories(value: ProductCategoryInput[]): string | undefined {
  if (value.length === 0) return 'Seleccioná al menos una categoría'
  if (!value.some((c) => c.is_primary)) return 'Marcá una como primaria'
}

// ── Componente ────────────────────────────────────────────────────────────────

export function ProductForm({
  initialValues,
  availableCategories,
  availableIngredients,
  onSubmit,
  onCancel,
  isPending = false,
}: ProductFormProps) {
  const [name,          setName]          = useState(initialValues?.name ?? '')
  const [description,   setDescription]   = useState(initialValues?.description ?? '')
  const [basePrice,     setBasePrice]     = useState<number>(initialValues?.base_price ?? 0)
  const [stockQuantity, setStockQuantity] = useState<number>(initialValues?.stock_quantity ?? 0)
  const [prepTime,      setPrepTime]      = useState<number | null>(initialValues?.prep_time_min ?? null)
  const [available,     setAvailable]     = useState<boolean>(initialValues?.available ?? true)
  const [imageUrls,     setImageUrls]     = useState<string[]>(initialValues?.image_urls ?? [])
  const [categories,    setCategories]    = useState<ProductCategoryInput[]>(initialValues?.categories ?? [])
  const [ingredients,   setIngredients]   = useState<ProductIngredientInput[]>(initialValues?.ingredients ?? [])

  // Tipo de stock: con receta (descuenta de ingredientes) o stock propio (standalone).
  // Inicial: si vino con ingredientes preexistentes, asumimos receta; sino standalone.
  const [productType, setProductType] = useState<ProductType>(
    (initialValues?.ingredients?.length ?? 0) > 0 ? 'recipe' : 'standalone',
  )

  // Modal de confirmación al cambiar de tipo si hay datos del otro lado.
  const [pendingTypeChange, setPendingTypeChange] = useState<ProductType | null>(null)
  const confirmTypeChangeRef = useRef<HTMLDialogElement>(null)

  function changeProductType(next: ProductType) {
    if (next === productType) return

    const losesIngredients = next === 'standalone' && ingredients.length > 0
    const losesStock       = next === 'recipe'     && stockQuantity > 0

    if (losesIngredients || losesStock) {
      setPendingTypeChange(next)
      confirmTypeChangeRef.current?.showModal()
      return
    }

    setProductType(next)
  }

  function handleConfirmTypeChange() {
    if (!pendingTypeChange) return
    if (pendingTypeChange === 'standalone') {
      setIngredients([])
    } else {
      setStockQuantity(0)
    }
    setProductType(pendingTypeChange)
    confirmTypeChangeRef.current?.close()
    setPendingTypeChange(null)
  }

  function handleCancelTypeChange() {
    confirmTypeChangeRef.current?.close()
    setPendingTypeChange(null)
  }

  const [touched, setTouched] = useState({
    name: false, basePrice: false, stockQuantity: false, prepTime: false, categories: false,
  })

  const isStandalone = productType === 'standalone'

  const errors = {
    name:          touched.name          ? validateName(name)                  : undefined,
    basePrice:     touched.basePrice     ? validatePrice(basePrice)            : undefined,
    // Stock solo aplica si es standalone — para recipe el campo no se muestra.
    stockQuantity: isStandalone && touched.stockQuantity ? validateStock(stockQuantity) : undefined,
    prepTime:      touched.prepTime      ? validatePrepTime(prepTime)          : undefined,
    categories:    touched.categories    ? validateCategories(categories)      : undefined,
  }

  const isValid =
    !validateName(name) &&
    !validatePrice(basePrice) &&
    (!isStandalone || !validateStock(stockQuantity)) &&
    !validatePrepTime(prepTime) &&
    !validateCategories(categories)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ name: true, basePrice: true, stockQuantity: true, prepTime: true, categories: true })
    if (!isValid) return

    onSubmit({
      name:           name.trim(),
      description:    description.trim() === '' ? null : description.trim(),
      base_price:     basePrice,
      // Solo se envía stock_quantity para standalone.
      // Para productos con receta NO se envía, así el backend (con exclude_unset=True)
      // no sobrescribe el stock_quantity almacenado y en su lugar se usa available_stock
      // que se calcula en vivo desde los ingredientes.
      ...(isStandalone ? { stock_quantity: stockQuantity } : {}),
      prep_time_min:  prepTime,
      available,
      // Filtramos URLs vacías
      image_urls:     imageUrls.map((u) => u.trim()).filter((u) => u.length > 0),
      categories,
      ingredients:    isStandalone ? [] : ingredients,
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
      {/* Selector de tipo de stock */}
      <div className="flex flex-col gap-1.5">
        <label className="text-label-caps text-rb-bone/60">Tipo de stock</label>
        <div className="grid grid-cols-2 gap-1 bg-rb-charcoal border border-white/10 rounded-sm p-1">
          <button
            type="button"
            onClick={() => changeProductType('standalone')}
            className={`px-3 py-2 rounded-sm text-body-sm transition-colors ${
              isStandalone
                ? 'bg-primary text-on-primary font-semibold'
                : 'text-rb-bone/70 hover:bg-rb-bone/5'
            }`}
          >
            Stock propio
          </button>
          <button
            type="button"
            onClick={() => changeProductType('recipe')}
            className={`px-3 py-2 rounded-sm text-body-sm transition-colors ${
              !isStandalone
                ? 'bg-primary text-on-primary font-semibold'
                : 'text-rb-bone/70 hover:bg-rb-bone/5'
            }`}
          >
            Con receta
          </button>
        </div>
        <p className="text-data-mono text-[11px] text-rb-bone/50">
          {isStandalone
            ? 'El stock se descuenta del propio producto (ej: bebidas, postres empacados).'
            : 'El stock se calcula a partir de los ingredientes (ej: hamburguesas).'}
        </p>
      </div>

      <InputField
        label="Nombre"
        value={name}
        onChange={setName}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        placeholder="Ej: Hamburguesa Clásica"
        error={errors.name}
        required
      />

      <InputField
        label="Descripción"
        value={description}
        onChange={setDescription}
        placeholder="Descripción breve (opcional)"
        multiline
        rows={2}
      />

      <div className={`grid gap-stack-md ${isStandalone ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <InputField
          label="Precio base"
          value={basePrice.toString()}
          onChange={(v) => setBasePrice(Number(v) || 0)}
          onBlur={() => setTouched((t) => ({ ...t, basePrice: true }))}
          placeholder="0.00"
          type="number"
          error={errors.basePrice}
          required
        />
        {isStandalone && (
          <InputField
            label="Stock"
            value={stockQuantity.toString()}
            onChange={(v) => setStockQuantity(Number(v) || 0)}
            onBlur={() => setTouched((t) => ({ ...t, stockQuantity: true }))}
            placeholder="0"
            type="number"
            error={errors.stockQuantity}
            required
          />
        )}
        <InputField
          label="Tiempo prep. (min)"
          value={prepTime?.toString() ?? ''}
          onChange={(v) => setPrepTime(v === '' ? null : Number(v) || 0)}
          onBlur={() => setTouched((t) => ({ ...t, prepTime: true }))}
          placeholder="opcional"
          type="number"
          error={errors.prepTime}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="accent-primary"
        />
        <span className="text-body-sm text-rb-bone">Disponible para venta</span>
      </label>

      <ImageUrlsField
        label="Imágenes"
        values={imageUrls}
        onChange={setImageUrls}
      />

      <CategoryMultiSelect
        label="Categorías"
        available={availableCategories}
        value={categories}
        onChange={(v) => {
          setCategories(v)
          setTouched((t) => ({ ...t, categories: true }))
        }}
        error={errors.categories}
        required
      />

      {!isStandalone && (
        <IngredientMultiSelect
          label="Ingredientes"
          available={availableIngredients}
          value={ingredients}
          onChange={setIngredients}
        />
      )}

      <div className="flex justify-end gap-stack-md mt-stack-sm">
        <ButtonGeneric
          info="Cancelar"
          type="Secondary"
          onClick={onCancel}
          disabled={isPending}
        />
        <ButtonGeneric
          info={isPending ? 'Guardando…' : 'Guardar'}
          type="Primary"
          submit
          disabled={!isValid || isPending}
        />
      </div>
    </form>

    <ConfirmModal
      dialogRef={confirmTypeChangeRef}
      title={
        pendingTypeChange === 'standalone'
          ? 'Cambiar a "Stock propio"'
          : 'Cambiar a "Con receta"'
      }
      message={
        pendingTypeChange === 'standalone' ? (
          <>
            Vas a quitar los <strong className="text-rb-bone">{ingredients.length}</strong>{' '}
            ingrediente{ingredients.length === 1 ? '' : 's'} cargado
            {ingredients.length === 1 ? '' : 's'} en la receta. ¿Continuar?
          </>
        ) : (
          <>
            El stock propio (<strong className="text-rb-bone">{stockQuantity}</strong> unidad
            {stockQuantity === 1 ? '' : 'es'}) se descarta y el stock pasa a
            calcularse desde los ingredientes. ¿Continuar?
          </>
        )
      }
      confirmLabel="Continuar"
      onConfirm={handleConfirmTypeChange}
      onCancel={handleCancelTypeChange}
    />
    </>
  )
}
