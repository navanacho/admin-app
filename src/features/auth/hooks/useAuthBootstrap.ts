import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { getMeService } from '../services/authService'
import { hasAdminAccess } from '@/shared/lib/permissions'

export function useAuthBootstrap() {
  const login = useAuthStore((s) => s.login)
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated)

  useEffect(() => {
    let active = true
    localStorage.removeItem('auth-storage')

    getMeService()
      .then((user) => {
        if (!active) return
        if (hasAdminAccess(user)) login(user)
        else setUnauthenticated()
      })
      .catch(() => {
        if (active) setUnauthenticated()
      })

    return () => {
      active = false
    }
  }, [login, setUnauthenticated])
}
