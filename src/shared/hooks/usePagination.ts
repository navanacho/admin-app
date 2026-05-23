import { useState } from 'react'

export interface PaginationState {
  startIndex: number
  endIndex: number
  total: number
  hasNext: boolean
  hasPrev: boolean
  goNext: () => void
  goPrev: () => void
}

/**
 * Hook de paginación client-side genérico.
 * Recibe un array de datos y un tamaño de página, devuelve
 * la porción visible y el estado de paginación listo para
 * pasarlo a EntityTable.
 */
export function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1)

  const total      = data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIdx   = (page - 1) * pageSize

  const paginatedData: T[] = data.slice(startIdx, startIdx + pageSize)

  const pagination: PaginationState = {
    startIndex: total === 0 ? 0 : startIdx + 1,
    endIndex:   Math.min(startIdx + pageSize, total),
    total,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    goNext:  () => setPage(p => Math.min(p + 1, totalPages)),
    goPrev:  () => setPage(p => Math.max(p - 1, 1)),
  }

  return { page, paginatedData, pagination }
}
