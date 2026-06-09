import type { ReactNode } from 'react'
import { EmptyHint } from '@/shared/components/EmptyHint'

interface KanbanColumnProps {
  /** Título de la columna, ej: "Confirmado" */
  title: string
  /** Cantidad de cards (se muestra como badge junto al título) */
  count: number
  /** Cards de la columna — pasá tus <OrderCard /> */
  children: ReactNode
  /** Mensaje cuando la columna no tiene cards */
  emptyHint?: string
  /** Acento de color del título/badge (clase Tailwind de texto). Default: on-surface */
  accentClass?: string
}

/**
 * Columna genérica para tableros tipo Trello: header con título + contador,
 * y una lista vertical scrollable de cards. Si no hay cards muestra un EmptyHint.
 * Es agnóstica del dominio — recibe las cards como children.
 */
export function KanbanColumn({
  title,
  count,
  children,
  emptyHint = 'Sin pedidos',
  accentClass = 'text-on-surface',
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden min-h-0">
      <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <h3 className={`text-label-caps tracking-wide ${accentClass}`}>{title}</h3>
        <span className="text-data-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full text-[11px]">
          {count}
        </span>
      </header>

      <div className="flex flex-col gap-stack-sm p-3 overflow-y-auto flex-1">
        {count === 0 ? <EmptyHint size="sm">{emptyHint}</EmptyHint> : children}
      </div>
    </div>
  )
}
