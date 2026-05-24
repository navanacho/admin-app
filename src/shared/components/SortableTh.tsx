import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import type { SortDirection } from '@/shared/hooks/useSortable'

interface SortableThProps {
  label: string
  active: boolean
  direction: SortDirection
  onClick: () => void
  align?: 'left' | 'right'
  className?: string
}

export function SortableTh({
  label,
  active,
  direction,
  onClick,
  align = 'left',
  className = '',
}: SortableThProps) {
  const Icon = !active || !direction
    ? ChevronsUpDown
    : direction === 'asc'
      ? ChevronUp
      : ChevronDown

  return (
    <th className={`px-6 py-3 text-${align} text-label-caps text-on-surface-variant ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-label-caps hover:text-on-surface transition-colors ${
          active && direction ? 'text-primary' : ''
        }`}
        aria-label={`Ordenar por ${label}`}
      >
        {label}
        <Icon size={12} aria-hidden="true" />
      </button>
    </th>
  )
}
