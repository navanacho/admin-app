interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  /** Mensaje de error — si está definido, el campo se pinta en rojo */
  error?: string
  required?: boolean
  /** Tipo del <input> — 'text' | 'password' | 'email' | 'number' | etc. */
  type?: string
  multiline?: boolean
  rows?: number
  minLength?: number
  maxLength?: number
}

/**
 * Campo de formulario genérico: label + input (o textarea) + mensaje de error.
 * El padre es responsable de la validación y de cuándo mostrar el error.
 *
 * Uso básico:
 *   <InputField label="Nombre" value={name} onChange={setName} required />
 *
 * Con validación:
 *   <InputField
 *     label="Nombre"
 *     value={name}
 *     onChange={setName}
 *     onBlur={() => setTouched(t => ({ ...t, name: true }))}
 *     error={touched.name && !name.trim() ? 'Campo requerido' : undefined}
 *   />
 */
export function InputField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  type = 'text',
  multiline = false,
  rows = 3,
  minLength,
  maxLength,
}: InputFieldProps) {
  const borderClass = error
    ? 'border-danger focus:border-danger'
    : 'border-white/10 focus:border-primary'

  const sharedClass = `w-full bg-rb-charcoal border rounded-sm px-3 py-2 text-body-sm text-rb-bone
    placeholder:text-rb-bone/30 focus:outline-none transition-colors ${borderClass}`

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          className={sharedClass}
        />
      )}

      {error && (
        <p className="text-data-mono text-danger text-[11px]">{error}</p>
      )}
    </div>
  )
}
