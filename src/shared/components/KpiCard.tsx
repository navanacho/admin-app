import type { ReactNode } from 'react'

type KpiVariant = 'default' | 'warning' | 'info'

interface KpiCardProps {
  label: string
  /** Número o string que se muestra como valor principal */
  value: string | number
  /** Contenido debajo del valor — acepte ReactNode para permitir color custom */
  subLabel?: ReactNode
  variant?: KpiVariant
  /** Ícono que aparece antes del label (útil en variant warning) */
  icon?: ReactNode
}

const variantStyles: Record<KpiVariant, { card: string; label: string }> = {
  default: {
    card:  'bg-surface-container border border-outline-variant',
    label: 'text-on-surface-variant',
  },
  warning: {
    card:  'bg-surface-container border border-warning/30',
    label: 'text-warning',
  },
  info: {
    card:  'bg-surface-container border border-tertiary/20',
    label: 'text-on-surface-variant',
  },
}

/**
 * Tarjeta KPI genérica.
 * Usada en dashboards y páginas de lista para mostrar métricas clave.
 */
export function KpiCard({
  label,
  value,
  subLabel,
  variant = 'default',
  icon,
}: KpiCardProps) {
  const { card, label: labelCls } = variantStyles[variant]

  const displayValue =
    typeof value === 'number'
      ? String(value).padStart(2, '0')
      : value

  return (
    <div className={`rounded-md p-6 flex flex-col gap-1 ${card}`}>
      <span className={`text-label-caps flex items-center gap-2 ${labelCls}`}>
        {icon}
        {label}
      </span>

      <span className="text-kpi-value text-on-surface">{displayValue}</span>

      {subLabel !== undefined && (
        <span className="text-label-caps text-on-surface-variant">{subLabel}</span>
      )}
    </div>
  )
}
