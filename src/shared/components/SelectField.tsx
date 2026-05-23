export interface SelectOption {
  value: string | number
  label: string
}

interface SelectFieldProps {
  label: string
  /** Siempre string a nivel DOM — el padre convierte según necesite */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  /** Mensaje de error — si está definido, el campo se pinta en rojo */
  error?: string
  required?: boolean
}

/**
 * Select genérico con el mismo estilo dark que InputField.
 *
 * Uso:
 *   <SelectField
 *     label="Categoría padre"
 *     value={parentId?.toString() ?? ''}
 *     onChange={(v) => setParentId(v === '' ? null : Number(v))}
 *     options={[
 *       { value: '', label: '— Sin parent (raíz) —' },
 *       ...categories.map(c => ({ value: c.id, label: c.name })),
 *     ]}
 *   />
 */
export function SelectField({
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false,
}: SelectFieldProps) {
  const borderClass = error
    ? 'border-danger focus:border-danger'
    : 'border-white/10 focus:border-primary'

  const sharedClass = `w-full bg-rb-charcoal border rounded-sm px-3 py-2 text-body-sm text-rb-bone
    focus:outline-none transition-colors ${borderClass}`

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={sharedClass}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-rb-charcoal text-rb-bone">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-data-mono text-danger text-[11px]">{error}</p>
      )}
    </div>
  )
}
