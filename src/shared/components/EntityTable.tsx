import type { ReactNode } from 'react'
import type { PaginationState } from '@/shared/hooks/usePagination'

interface EntityTableProps {
  /** Título del bloque, ej: "Inventario de Cocina" */
  title: string
  /** Fila de encabezados — pasá un <tr> con tus <th> */
  thead: ReactNode
  /** Filas de datos — pasá tus <tr><td>...</td></tr> */
  children: ReactNode
  isLoading?: boolean
  /** true cuando no hay filas para mostrar el mensaje vacío */
  isEmpty?: boolean
  pagination?: PaginationState
  /** Nombre en plural de la entidad, ej: "ingredientes" */
  entityLabel?: string
  /** Íconos o botones del toolbar. Por defecto muestra filtro y descarga. */
  toolbarActions?: ReactNode
}

export function EntityTable({
  title,
  thead,
  children,
  isLoading,
  isEmpty,
  pagination,
  entityLabel = 'registros',
  toolbarActions,
}: EntityTableProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">

      {/* Barra superior: título + acciones */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <h2 className="text-headline-md text-on-surface">{title}</h2>

        {toolbarActions && (
          <div className="flex items-center gap-1">
            {toolbarActions}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">

          {/* Encabezados — vienen de afuera como JSX */}
          <thead className="border-b border-outline-variant">
            {thead}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={99} className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
                  Cargando...
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={99} className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
                  No hay registros.
                </td>
              </tr>
            ) : (
              // Filas de datos — vienen de afuera como JSX
              children
            )}
          </tbody>

        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant">
          <span className="text-body-sm text-on-surface-variant">
            Mostrando {pagination.startIndex}–{pagination.endIndex} de {pagination.total} {entityLabel}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={pagination.goPrev}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 text-body-sm text-on-surface border border-outline-variant rounded-sm hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={pagination.goNext}
              disabled={!pagination.hasNext}
              className="px-4 py-2 text-body-sm bg-rb-ink text-rb-bone rounded-sm hover:bg-rb-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
