import { useState } from 'react'
import type { CreateIngredientDto } from '../types'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { InputField } from '@/shared/components/InputField'

interface IngredientFormProps {
  /** Si se pasa, el form arranca pre-llenado (modo edición) */
  initialValues?: {
    name:           string
    description:    string
    stock_quantity: number
    is_allergen:    boolean
  }
  onSubmit:  (dto: CreateIngredientDto) => void
  onCancel:  () => void
  isPending?: boolean
}

// ── Reglas de validación ──────────────────────────────────────────────────────
function validateName(value: string): string | undefined {
  if (value.trim().length === 0) return 'El nombre es requerido'
  if (value.trim().length < 2)   return 'Mínimo 2 caracteres'
  if (value.trim().length > 100) return 'Máximo 100 caracteres'
}

function validateStock(value: string): string | undefined {
  if (value.trim() === '') return 'El stock es requerido'
  const n = Number(value)
  if (!Number.isInteger(n)) return 'Debe ser un entero'
  if (n < 0) return 'No puede ser negativo'
}

/**
 * Form reutilizable para crear o editar un ingrediente.
 * No sabe si está dentro de un modal o una página — eso lo decide el padre.
 */
export function IngredientForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending = false,
}: IngredientFormProps) {
  const [name,        setName]        = useState(initialValues?.name        ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [stockQty,    setStockQty]    = useState(String(initialValues?.stock_quantity ?? 0))
  const [isAllergen,  setIsAllergen]  = useState(initialValues?.is_allergen ?? false)

  // Touched: solo mostramos error después de que el usuario tocó el campo
  const [touched, setTouched] = useState({ name: false, stock: false })

  function touch(field: keyof typeof touched) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  // ── Errores computados ────────────────────────────────────────────────────
  const errors = {
    name:  touched.name  ? validateName(name)     : undefined,
    stock: touched.stock ? validateStock(stockQty) : undefined,
  }

  const isValid = !validateName(name) && !validateStock(stockQty)

  // ── Submit ────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onSubmit({
      name: name.trim(),
      description: description.trim() === '' ? null : description.trim(),
      stock_quantity: Number(stockQty),
      is_allergen: isAllergen,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">

      <InputField
        label="Nombre"
        required
        value={name}
        onChange={setName}
        onBlur={() => touch('name')}
        placeholder="Ej: Carne Angus 200g"
        minLength={2}
        maxLength={100}
        error={errors.name}
      />

      <InputField
        label="Descripción"
        multiline
        rows={3}
        value={description}
        onChange={setDescription}
        placeholder="Descripción del ingrediente..."
      />

      <InputField
        label="Stock"
        required
        type="number"
        value={stockQty}
        onChange={setStockQty}
        onBlur={() => touch('stock')}
        placeholder="0"
        error={errors.stock}
      />

      {/* Alérgeno */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isAllergen}
          onChange={e => setIsAllergen(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <span className="text-body-sm text-rb-bone/80">Contiene alérgenos</span>
      </label>

      {/* Acciones */}
      <div className="flex justify-end gap-stack-sm pt-2 border-t border-white/10">
        <ButtonGeneric
          type="Secondary"
          info="Cancelar"
          onClick={onCancel}
        />
        <ButtonGeneric
          submit
          disabled={!isValid || isPending}
          info={isPending ? 'Guardando...' : 'Confirmar'}
        />
      </div>

    </form>
  )
}
