import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut, ShieldCheck, Mail, IdCard, AtSign } from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import { logoutService } from '../services/authService'

import { PageHeader }    from '@/shared/components/PageHeader'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { toast, extractErrorMessage } from '@/shared/lib/toast'

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ProfilePage() {
  const user        = useAuthStore((s) => s.user)
  const logoutStore = useAuthStore((s) => s.logout)
  const navigate    = useNavigate()
  const qc          = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutService()
    } catch (err) {
      // Si el backend falla, igual limpiamos el estado local
      toast.error('Falló el logout del servidor', extractErrorMessage(err))
    } finally {
      logoutStore()
      qc.clear()
      toast.success('Sesión cerrada')
      navigate('/login', { replace: true })
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Perfil" subtitle="No hay usuario autenticado." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Perfil"
        subtitle="Información de tu cuenta y sesión."
      />

      {/* Datos del usuario */}
      <div className="bg-surface-container rounded-md p-gutter flex flex-col gap-stack-md">
        <div className="flex items-center gap-stack-md">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-headline-md font-bold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h2 className="text-headline-md text-on-surface">{user.full_name}</h2>
            <span className="text-data-mono text-on-surface-variant">@{user.username}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          <InfoCell icon={IdCard}  label="ID"       value={String(user.id)} />
          <InfoCell icon={AtSign}  label="Usuario"  value={user.username} />
          <InfoCell icon={Mail}    label="Email"    value={user.email} />
        </div>
      </div>

      {/* Roles */}
      <div className="bg-surface-container rounded-md p-gutter flex flex-col gap-stack-md">
        <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
          <ShieldCheck size={14} aria-hidden="true" />
          Roles asignados
        </div>

        {user.roles.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant">Sin roles asignados.</p>
        ) : (
          <div className="flex flex-wrap gap-stack-sm">
            {user.roles.map((r) => (
              <div
                key={r.rol_code}
                className="bg-rb-ink text-rb-bone rounded-sm px-3 py-2 flex flex-col gap-1"
              >
                <span className="text-label-caps text-primary">{r.rol_code}</span>
                <span className="text-data-mono text-rb-bone/60">
                  Desde: {formatDateTime(r.created_at)}
                  {r.expires_at && ` · Vence: ${formatDateTime(r.expires_at)}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div>
        <ButtonGeneric
          info={
            <>
              <LogOut size={16} aria-hidden="true" />
              {isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </>
          }
          type="Primary"
          onClick={handleLogout}
          disabled={isLoggingOut}
        />
      </div>
    </div>
  )
}

// ── Auxiliar ─────────────────────────────────────────────────────────────────

interface InfoCellProps {
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  label: string
  value: string
}

function InfoCell({ icon: Icon, label, value }: InfoCellProps) {
  return (
    <div className="flex flex-col gap-1 bg-surface-container-low rounded-sm p-3">
      <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
        <Icon size={12} aria-hidden />
        {label}
      </div>
      <span className="text-body-sm text-on-surface break-all">{value}</span>
    </div>
  )
}
