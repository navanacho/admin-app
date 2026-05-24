import { Outlet, useLocation } from 'react-router-dom'
import { useUIStore } from '@/shared/store/uiStore'
import Sidebar from '@/shared/components/Sidebar'
import { Toaster } from '@/shared/components/Toaster'

function activeItemFromPath(pathname: string): string {
  if (pathname.startsWith('/dashboard'))   return 'Dashboard'
  if (pathname.startsWith('/orders'))      return 'Pedidos'
  if (pathname.startsWith('/products'))    return 'Productos'
  if (pathname.startsWith('/ingredients')) return 'Ingredientes'
  if (pathname.startsWith('/categories'))  return 'Categorías'
  if (pathname.startsWith('/users'))       return 'Usuarios'
  return ''
}

export function DashboardLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && <Sidebar activeItem={activeItemFromPath(pathname)} />}

      <div className={`flex flex-col flex-1 ${sidebarOpen ? 'ml-sidebar' : ''}`}>
        <header className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface">
          <span className="text-label-caps text-on-surface-variant">
            Rock 'N Burger Admin
          </span>
        </header>

        <main className="flex-1 p-gutter">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  )
}
