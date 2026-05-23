import { useState } from 'react'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
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

  const [touched, setTouched] = useState({
    name: false, basePrice: false, stockQuantity: false, prepTime: false, categories: false,
  })

  const errors = {
    name:          touched.name          ? validateName(name)                  : undefined,
    basePrice:     touched.basePrice     ? validatePrice(basePrice)            : undefined,
    stockQuantity: touched.stockQuantity ? validateStock(stockQuantity)        : undefined,
    prepTime:      touched.prepTime      ? validatePrepTime(prepTime)          : undefined,
    categories:    touched.categories    ? validateCategories(categories)      : undefined,
  }

  const isValid =
    !validateName(name) &&
    !validatePrice(basePrice) &&
    !validateStock(stockQuantity) &&
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
      stock_quantity: stockQuantity,
      prep_time_min:  prepTime,
      available,
      // Filtramos URLs vacías
      image_urls:     imageUrls.map((u) => u.trim()).filter((u) => u.length > 0),
      categories,
      ingredients,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
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

      <div className="grid grid-cols-3 gap-stack-md">
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

      <IngredientMultiSelect
        label="Ingredientes"
        available={availableIngredients}
        value={ingredients}
        onChange={setIngredients}
      />

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
  )
}
