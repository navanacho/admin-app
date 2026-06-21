import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { loginService, logoutService, getMeService } from '../services/authService'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { getHomeRouteFor, hasAdminAccess } from '@/shared/lib/permissions'

// ── Validaciones puras ────────────────────────────────────────────────────────

function validateUsername(value: string): string | undefined {
  if (value.trim().length === 0) return 'El usuario es requerido'
  if (value.trim().length < 3)   return 'Mínimo 3 caracteres'
}

function validatePassword(value: string): string | undefined {
  if (value.length === 0) return 'La contraseña es requerida'
  if (value.length < 8)   return 'Mínimo 8 caracteres'
}

// ── Componente ────────────────────────────────────────────────────────────────

export function LoginPage() {
  // Todos los hooks antes de cualquier return condicional
  const status          = useAuthStore((s) => s.status)
  const loginStore      = useAuthStore((s) => s.login)
  const logoutStore     = useAuthStore((s) => s.logout)
  const currentUser     = useAuthStore((s) => s.user)
  const navigate        = useNavigate()

  const [username,     setUsername]     = useState('')
  const [password,     setPassword]     = useState('')
  const [touched,      setTouched]      = useState({ username: false, password: false })
  const [serverError,  setServerError]  = useState<string | null>(null)
  const [isPending,    setIsPending]    = useState(false)

  // Limpieza de sesión persistida sin acceso (ej. CLIENT que loggeó antes
  // de este gate y quedó en localStorage). Cae al render normal del login.
  useEffect(() => {
    if (status === 'authenticated' && !hasAdminAccess(currentUser)) {
      logoutStore()
    }
  }, [status, currentUser, logoutStore])

  // Si ya hay sesión activa Y con acceso, redirigir a la home según rol.
  if (status === 'authenticated' && hasAdminAccess(currentUser)) {
    return <Navigate to={getHomeRouteFor(currentUser)} replace />
  }

  const errors = {
    username: touched.username ? validateUsername(username) : undefined,
    password: touched.password ? validatePassword(password) : undefined,
  }
  const isValid = !validateUsername(username) && !validatePassword(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    setIsPending(true)
    try {
      await loginService({ username, password })
      const user = await getMeService()

      if (!hasAdminAccess(user)) {
        // Cookie quedó seteada por el back; la invalidamos para que el
        // usuario no pueda llamar endpoints autenticados desde otra app.
        await logoutService().catch(() => undefined)
        setServerError('Esta cuenta no tiene acceso al panel de administración.')
        return
      }

      loginStore(user)
      navigate(getHomeRouteFor(user))
    } catch {
      setServerError('Usuario o contraseña incorrectos')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-rb-charcoal rounded-md shadow-ink p-8">
      <h2 className="text-headline-md text-rb-bone mb-6">INICIAR SESIÓN</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
        <InputField
          label="Usuario"
          value={username}
          onChange={setUsername}
          onBlur={() => setTouched((t) => ({ ...t, username: true }))}
          placeholder="admin"
          error={errors.username}
          required
        />

        <InputField
          label="Contraseña"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder="••••••••"
          error={errors.password}
          type="password"
          required
        />

        {serverError && (
          <p className="text-data-mono text-danger text-sm">{serverError}</p>
        )}

        <ButtonGeneric
          info={isPending ? 'Ingresando…' : 'Ingresar'}
          type="Primary"
          submit
          disabled={!isValid || isPending}
          extraClass="w-full mt-2"
        />
      </form>
    </div>
  )
}
