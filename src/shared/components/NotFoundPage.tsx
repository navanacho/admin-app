import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * Página 404 para rutas desconocidas dentro del dashboard.
 * Se renderiza dentro de DashboardLayout, por lo que el sidebar ya está presente.
 */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-md text-center">

      {/* Código de error */}
      <span className="text-display-lg text-primary leading-none">404</span>

      {/* Título */}
      <div className="flex flex-col gap-2">
        <h1 className="text-headline-md text-on-surface">Ruta no encontrada</h1>
        <p className="text-body-sm text-on-surface-variant max-w-sm">
          La página que buscás no existe o fue movida.
          Usá el menú lateral para navegar.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary text-label-caps rounded-md shadow-red hover:bg-rb-red-hover transition-colors mt-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver al inicio
      </button>

    </div>
  )
}
