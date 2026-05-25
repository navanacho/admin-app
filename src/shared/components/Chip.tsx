import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ChipVariant = 'primary' | 'selected' | 'available'

interface ChipProps {
  variant?: ChipVariant
  /** Slot izquierdo (icono, estrella, etc.) */
  leading?: ReactNode
  /** Texto principal */
  children: ReactNode
  /** Si está, se muestra una X clickeable a la derecha */
  onRemove?: () => void
  /** Click en el cuerpo del chip (no en el botón remove) */
  onClick?: () => void
  removeLabel?: string
}

const VARIANT_CLASSES: Record<ChipVariant, string> = {
  // Estado destacado (categoría primaria): fondo rojo translúcido + borde brand.
  primary:   'bg-primary/15 border-primary text-rb-bone',
  // Seleccionado pero no destacado: superficie cálida sobre fondo oscuro.
  selected:  'bg-rb-paper/30 border-white/15 text-rb-bone',
  // Disponible para sumar: superficie dark con hover sutil.
  available: 'bg-rb-charcoal border-white/10 text-rb-bone/80 hover:bg-rb-bone/5 hover:border-primary/40 hover:text-rb-bone cursor-pointer',
}

/**
 * Píldora con slot izquierdo + label + acción remove opcional.
 * Se usa en multiselects de categorías y en cualquier lugar que necesite
 * mostrar items seleccionables/seleccionados.
 */
export function Chip({
  variant = 'selected',
  leading,
  children,
  onRemove,
  onClick,
  removeLabel = 'Quitar',
}: ChipProps) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-body-sm transition-colors'

  const body = (
    <>
      {leading}
      <span className="font-semibold">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={removeLabel}
          className="p-0.5 ml-0.5 text-rb-bone/50 hover:text-danger rounded-sm transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </>
  )

  if (onClick && !onRemove) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${VARIANT_CLASSES[variant]}`}
      >
        {body}
      </button>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`${base} ${VARIANT_CLASSES[variant]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {body}
    </div>
  )
}
