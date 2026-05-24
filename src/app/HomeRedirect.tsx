import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getHomeRouteFor } from '@/shared/lib/permissions'

/**
 * Redirige la ruta `/` a la home apropiada según el rol del usuario.
 * ADMIN → /dashboard, PEDIDOS → /orders, STOCK → /products, etc.
 */
export function HomeRedirect() {
  const user = useAuthStore((s) => s.user)
  return <Navigate to={getHomeRouteFor(user)} replace />
}
