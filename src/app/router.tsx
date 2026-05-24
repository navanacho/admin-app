import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout }      from '@/shared/layouts/AuthLayout'
import { DashboardLayout } from '@/shared/layouts/DashboardLayout'
import { NotFoundPage }    from '@/shared/components/NotFoundPage'
import { RootErrorPage }   from '@/shared/components/RootErrorPage'
import { LoginPage }       from '@/features/auth'
import { ProfilePage }     from '@/features/auth/pages/ProfilePage'
import { DashboardPage }   from '@/features/dashboard'
import { CategoriesPage } from '@/features/categories'
import { IngredientsPage } from '@/features/ingredients'
import { ProductsPage }    from '@/features/products'
import { OrdersPage, OrderDetailPage } from '@/features/orders'
import { UsersPage, UserDetailPage } from '@/features/users'
import { ProtectedRoute }  from './ProtectedRoute'
import { HomeRedirect }    from './HomeRedirect'
import { RequirePermission } from '@/features/auth/components/RequirePermission'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    // Error global: rutas fuera del dashboard o fallos del layout
    errorElement: <RootErrorPage />,
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Landing dinámico según rol
          { path: '/', element: <HomeRedirect /> },

          // Perfil — accesible para cualquier usuario autenticado
          {
            element: <RequirePermission capability="canViewProfile" />,
            children: [{ path: '/profile', element: <ProfilePage /> }],
          },

          // Dashboard — solo ADMIN
          {
            element: <RequirePermission capability="canViewDashboard" />,
            children: [{ path: '/dashboard', element: <DashboardPage /> }],
          },

          // Pedidos — ADMIN y PEDIDOS
          {
            element: <RequirePermission capability="canViewOrders" />,
            children: [
              { path: '/orders',     element: <OrdersPage /> },
              { path: '/orders/:id', element: <OrderDetailPage /> },
            ],
          },

          // Productos — ADMIN y STOCK
          {
            element: <RequirePermission capability="canManageProducts" />,
            children: [{ path: '/products', element: <ProductsPage /> }],
          },

          // Ingredientes — ADMIN y STOCK
          {
            element: <RequirePermission capability="canManageIngredients" />,
            children: [{ path: '/ingredients', element: <IngredientsPage /> }],
          },

          // Categorías — solo ADMIN
          {
            element: <RequirePermission capability="canManageCategories" />,
            children: [{ path: '/categories', element: <CategoriesPage /> }],
          },

          // Usuarios — solo ADMIN
          {
            element: <RequirePermission capability="canManageUsers" />,
            children: [
              { path: '/users',     element: <UsersPage /> },
              { path: '/users/:id', element: <UserDetailPage /> },
            ],
          },

          // Catch-all dentro del dashboard: muestra 404 CON sidebar
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
