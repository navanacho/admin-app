import type { User } from '@/features/auth/types'

export type RoleCode = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'COCINA'

export interface Permissions {
  canManageProducts:    boolean
  canManageIngredients: boolean
  canManageCategories:  boolean
  canManageUsers:       boolean
  canViewOrders:        boolean
  canChangeOrderState:  boolean
  canViewDashboard:     boolean
  canViewProfile:       boolean
  canViewCocina:        boolean
  canViewCajero:        boolean
}

export const NO_PERMISSIONS: Permissions = {
  canManageProducts:    false,
  canManageIngredients: false,
  canManageCategories:  false,
  canManageUsers:       false,
  canViewOrders:        false,
  canChangeOrderState:  false,
  canViewDashboard:     false,
  canViewProfile:       false,
  canViewCocina:        false,
  canViewCajero:        false,
}

/** Devuelve true si el usuario tiene el rol indicado (ignora expiración por ahora). */
export function hasRole(user: User | null, code: RoleCode): boolean {
  if (!user) return false
  return user.roles.some((r) => r.rol_code === code)
}

/**
 * Devuelve true si el usuario tiene al menos un rol que le da acceso al panel
 * de administración. Los usuarios CLIENT-only quedan fuera.
 */
export function hasAdminAccess(user: User | null): boolean {
  if (!user) return false
  return (
    hasRole(user, 'ADMIN') ||
    hasRole(user, 'STOCK') ||
    hasRole(user, 'PEDIDOS') ||
    hasRole(user, 'COCINA')
  )
}

/** Mapea la matriz de capabilities desde los roles del usuario. */
export function computePermissions(user: User | null): Permissions {
  if (!user) return NO_PERMISSIONS

  const isAdmin   = hasRole(user, 'ADMIN')
  const isStock   = hasRole(user, 'STOCK')
  const isPedidos = hasRole(user, 'PEDIDOS')
  const isCocina  = hasRole(user, 'COCINA')

  return {
    canManageProducts:    isAdmin || isStock,
    canManageIngredients: isAdmin || isStock,
    canManageCategories:  isAdmin,
    canManageUsers:       isAdmin,
    canViewOrders:        isAdmin || isPedidos,
    canChangeOrderState:  isAdmin || isPedidos,
    canViewDashboard:     isAdmin,
    canViewProfile:       Boolean(user),
    canViewCocina:        isAdmin || isCocina,
    canViewCajero:        isAdmin || isPedidos,
  }
}

/** Ruta a la que el usuario debe aterrizar al loguearse o al pisar `/`. */
export function getHomeRouteFor(user: User | null): string {
  if (!user) return '/login'
  const perms = computePermissions(user)
  if (perms.canViewDashboard) return '/dashboard'
  if (perms.canViewOrders)    return '/orders'
  if (perms.canViewCocina)    return '/cocina'
  if (perms.canManageProducts) return '/products'
  if (perms.canManageIngredients) return '/ingredients'
  // Cualquier usuario logueado puede ver perfil — fallback razonable
  return '/profile'
}
