import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { getHomeRouteFor, type Permissions } from '@/shared/lib/permissions'
import { toast } from '@/shared/lib/toast'

interface Props {
  capability: keyof Permissions
}

/**
 * Guard de rol: si el usuario logueado no tiene `capability`,
 * lo redirige a su ruta home + muestra un toast de error.
 * Asume que ya está envuelto por <ProtectedRoute /> (auth check).
 */
export function RequirePermission({ capability }: Props) {
  const user  = useAuthStore((s) => s.user)
  const perms = usePermissions()
  const allowed = perms[capability]

  // Evita disparar el toast en cada re-render mientras navegamos
  const toastedRef = useRef(false)

  useEffect(() => {
    if (!allowed && !toastedRef.current) {
      toastedRef.current = true
      toast.error('No tenés permisos para acceder a esta sección')
    }
  }, [allowed])

  if (!allowed) return <Navigate to={getHomeRouteFor(user)} replace />

  return <Outlet />
}
