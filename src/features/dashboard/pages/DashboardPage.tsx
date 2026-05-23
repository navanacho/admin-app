import { useAuthStore } from '@/features/auth/store/authStore'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.name}</p>}
    </div>
  )
}
