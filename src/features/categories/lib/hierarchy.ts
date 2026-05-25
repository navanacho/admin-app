import type { Category } from '../types'

/**
 * Helpers para trabajar con la jerarquía de categorías (parent_id recursivo).
 * El back permite cualquier profundidad; estos helpers caminan la cadena en O(n)
 * usando un map por id.
 */

export function buildCategoryMap(categories: Category[]): Map<number, Category> {
  return new Map(categories.map((c) => [c.id, c]))
}

/**
 * Devuelve la cadena de categorías desde la raíz hasta `catId`, en orden.
 * Si una categoría intermedia no está en el map (ej. fue eliminada o no
 * pertenece al set activo), corta la cadena en el último nodo conocido.
 */
export function getCategoryPath(
  catId: number,
  byId: Map<number, Category>,
): Category[] {
  const path: Category[] = []
  const seen = new Set<number>()
  let cur = byId.get(catId)
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id)
    path.unshift(cur)
    if (cur.parent_id == null) break
    cur = byId.get(cur.parent_id)
  }
  return path
}

/** Une los nombres del path con `›` para mostrar en UI. */
export function formatCategoryPath(path: Category[]): string {
  return path.map((c) => c.name).join(' › ')
}

/**
 * Devuelve la categoría raíz a la que pertenece `catId` (su antecesor sin parent).
 * Si la categoría no existe en el map, retorna null.
 */
export function getRootCategory(
  catId: number,
  byId: Map<number, Category>,
): Category | null {
  const path = getCategoryPath(catId, byId)
  return path[0] ?? null
}

/**
 * Agrupa una lista plana por su raíz. Cada grupo trae la categoría raíz y
 * todos sus descendientes presentes en el input (incluyendo la propia raíz si
 * está). Categorías cuya raíz no está en el input se agrupan bajo sí mismas.
 *
 * Los grupos respetan `order_display` de la raíz; dentro de cada grupo se
 * preserva el orden de aparición original.
 */
export interface CategoryGroup {
  root: Category
  items: Category[]
}

export function groupByRoot(
  categories: Category[],
  byId: Map<number, Category>,
): CategoryGroup[] {
  const groupsMap = new Map<number, CategoryGroup>()
  for (const c of categories) {
    const root = getRootCategory(c.id, byId) ?? c
    let group = groupsMap.get(root.id)
    if (!group) {
      group = { root, items: [] }
      groupsMap.set(root.id, group)
    }
    group.items.push(c)
  }
  return [...groupsMap.values()].sort(
    (a, b) => a.root.order_display - b.root.order_display,
  )
}
