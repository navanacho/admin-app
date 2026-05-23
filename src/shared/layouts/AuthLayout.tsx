import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-rb-ink flex flex-col items-center justify-center p-gutter">
      {/* Brand header */}
      <div className="mb-8 text-center">
        <p className="text-display-lg text-rb-red leading-none">ROCK</p>
        <p className="text-display-lg text-rb-bone leading-none">'N BURGER</p>
        <p className="text-label-caps text-rb-bone/60 mt-2">Panel de Administración</p>
      </div>

      {/* Slot del router */}
      <Outlet />
    </div>
  )
}
