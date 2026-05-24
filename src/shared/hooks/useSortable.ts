import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc' | null

/**
 * Sort client-side genérico para tablas. Cicla: null → asc → desc → null.
 * Funciona sobre la página actual (no toca paginación server-side).
 */
export function useSortable<T>(items: T[], defaultKey?: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey ?? null)
  const [direction, setDirection] = useState<SortDirection>(null)

  function toggle(key: keyof T) {
    if (sortKey !== key) {
      setSortKey(key)
      setDirection('asc')
      return
    }
    // misma columna: avanza el ciclo
    if (direction === 'asc') setDirection('desc')
    else if (direction === 'desc') {
      setSortKey(null)
      setDirection(null)
    } else setDirection('asc')
  }

  const sorted = useMemo(() => {
    if (!sortKey || !direction) return items
    const copy = [...items]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      let cmp: number
      if (typeof av === 'string' && typeof bv === 'string') {
        cmp = av.localeCompare(bv, 'es', { sensitivity: 'base' })
      } else if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv
      } else {
        cmp = String(av).localeCompare(String(bv), 'es', { sensitivity: 'base' })
      }
      return direction === 'asc' ? cmp : -cmp
    })
    return copy
  }, [items, sortKey, direction])

  return { sorted, sortKey, direction, toggle }
}
