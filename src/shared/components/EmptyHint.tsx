import type { ReactNode } from 'react'

interface EmptyHintProps {
  children: ReactNode
  /** Tamaño vertical del padding. `md` por defecto. */
  size?: 'sm' | 'md'
}

/**
 * Caja con borde dashed y texto centrado, pensada para estados vacíos
 * dentro de formularios (ej: "no hay ingredientes en la receta").
 */
export function EmptyHint({ children, size = 'md' }: EmptyHintProps) {
  const padding = size === 'sm' ? 'px-4 py-3' : 'px-4 py-6'

  return (
    <div
      className={`bg-rb-charcoal border border-dashed border-white/10 rounded-md ${padding} text-center`}
    >
      <p className="text-body-sm text-rb-bone/40">{children}</p>
    </div>
  )
}
