import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout }      from '@/shared/layouts/AuthLayout'
import { DashboardLayout } from '@/shared/layouts/DashboardLayout'
import { NotFoundPage }    from '@/shared/components/NotFoundPage'
import { RootErrorPage }   from '@/shared/components/RootErrorPage'
import { LoginPage }       from '@/features/auth'
import { DashboardPage }   from '@/features/dashboard'
import { CategoriesPage, CategoryFormPage } from '@/features/categories'
import { IngredientsPage } from '@/features/ingredients'
import { ProtectedRoute }  from './ProtectedRoute'

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
          { path: '/',                        element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard',               element: <DashboardPage /> },
          { path: '/categories',              element: <CategoriesPage /> },
          { path: '/categories/new',          element: <CategoryFormPage /> },
          { path: '/categories/:id/edit',     element: <CategoryFormPage /> },
          { path: '/ingredients',             element: <IngredientsPage /> },
          // Catch-all dentro del dashboard: muestra 404 CON sidebar
          { path: '*',                        element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
