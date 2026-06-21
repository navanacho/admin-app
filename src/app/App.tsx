import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap'

export function App() {
  useAuthBootstrap()

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
