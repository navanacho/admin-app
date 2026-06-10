import { useState } from 'react'
import { InputField } from '@/shared/components/InputField'
import { SelectField, type SelectOption } from '@/shared/components/SelectField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { ImagePicker } from '@/shared/components/ImagePicker'
import type { Category, CreateCategoryDto } from '../types'

interface CategoryFormProps {
  /** Valores iniciales — si se pasan, el form actúa como "editar" */
  initialValues?: Partial<CreateCategoryDto>
  /** Lista de categorías disponibles para elegir como parent */
  availableParents: Category[]
  onSubmit: (dto: CreateCategoryDto) => void
  onCancel: () => void
  isPending?: boolean
}

// ── Validaciones puras ────────────────────────────────────────────────────────

function validateName(value: string): string | undefined {
  if (value.trim().length === 0) return 'El nombre es requerido'
  if (value.trim().length < 2)   return 'Mínimo 2 caracteres'
  if (value.trim().length > 100) return 'Máximo 100 caracteres'
}

function validateOrderDisplay(value: number): string | undefined {
  if (!Number.isInteger(value)) return 'Debe ser un número entero'
  if (value < 1)                return 'Debe ser mayor o igual a 1'
}

// ── Componente ────────────────────────────────────────────────────────────────

export function CategoryForm({
  initialValues,
  availableParents,
  onSubmit,
  onCancel,
  isPending = false,
}: CategoryFormProps) {
  const [parentId,     setParentId]     = useState<number | null>(initialValues?.parent_id ?? null)
  const [name,         setName]         = useState(initialValues?.name ?? '')
  const [description,  setDescription]  = useState(initialValues?.description ?? '')
  const [orderDisplay, setOrderDisplay] = useState<number>(initialValues?.order_display ?? 1)
  const [imageUrl,     setImageUrl]     = useState(initialValues?.image_url ?? '')

  const [touched, setTouched] = useState({ name: false, orderDisplay: false })

  const errors = {
    name:         touched.name         ? validateName(name)                  : undefined,
    orderDisplay: touched.orderDisplay ? validateOrderDisplay(orderDisplay)  : undefined,
  }
  const isValid = !validateName(name) && !validateOrderDisplay(orderDisplay)

  const parentOptions: SelectOption[] = [
    { value: '', label: '— Sin parent (raíz) —' },
    ...availableParents.map((c) => ({ value: c.id, label: c.name })),
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ name: true, orderDisplay: true })
    if (!isValid) return

    onSubmit({
      parent_id:     parentId,
      name:          name.trim(),
      description:   description.trim() === '' ? null : description.trim(),
      order_display: orderDisplay,
      image_url:     imageUrl.trim() === '' ? null : imageUrl.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
      <SelectField
        label="Categoría padre"
        value={parentId?.toString() ?? ''}
        onChange={(v) => setParentId(v === '' ? null : Number(v))}
        options={parentOptions}
      />

      <InputField
        label="Nombre"
        value={name}
        onChange={setName}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        placeholder="Ej: Hamburguesas"
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

      <InputField
        label="Orden de visualización"
        value={orderDisplay.toString()}
        onChange={(v) => setOrderDisplay(Number(v) || 0)}
        onBlur={() => setTouched((t) => ({ ...t, orderDisplay: true }))}
        placeholder="1"
        type="number"
        error={errors.orderDisplay}
        required
      />

      <ImagePicker
        label="Imagen"
        value={imageUrl || null}
        onChange={(url) => setImageUrl(url ?? '')}
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
