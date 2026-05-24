import { useMemo } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { computePermissions, type Permissions } from '@/shared/lib/permissions'

/**
 * Devuelve el objeto de capabilities del usuario logueado.
 * Si no hay usuario, devuelve todo en false.
 */
export function usePermissions(): Permissions {
  const user = useAuthStore((s) => s.user)
  return useMemo(() => computePermissions(user), [user])
}
