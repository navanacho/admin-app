import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rb-ink">
        <Loader2 size={32} className="animate-spin text-rb-bone" />
      </div>
    )
  }

  if (status === 'unauthenticated') return <Navigate to="/login" replace />

  return <Outlet />
}
