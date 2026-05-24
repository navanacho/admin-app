import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { loginService, getMeService } from '../services/authService'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { getHomeRouteFor } from '@/shared/lib/permissions'

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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loginStore      = useAuthStore((s) => s.login)
  const navigate        = useNavigate()

  const [username,     setUsername]     = useState('')
  const [password,     setPassword]     = useState('')
  const [touched,      setTouched]      = useState({ username: false, password: false })
  const [serverError,  setServerError]  = useState<string | null>(null)
  const [isPending,    setIsPending]    = useState(false)

  // Si ya hay sesión activa, redirigir a la home según rol
  const currentUser = useAuthStore((s) => s.user)
  if (isAuthenticated) return <Navigate to={getHomeRouteFor(currentUser)} replace />

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
