import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Slot para CTA u otras acciones — aparece a la derecha del título */
  action?: ReactNode
}

/**
 * Encabezado genérico de página.
 * Título en display-lg, subtítulo en body-sm, acción a la derecha.
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-display-lg text-on-surface leading-none">{title}</h1>
        {subtitle && (
          <p className="text-body-sm text-on-surface-variant mt-2">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 ml-stack-lg">{action}</div>}
    </div>
  )
}
