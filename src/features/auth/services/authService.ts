import { apiClient } from '@/shared/lib/axios'
import type { LoginCredentials, User } from '../types'

/**
 * Login via OAuth2 Password Flow.
 * El backend responde seteando una cookie HttpOnly — no hay token en el body.
 */
export async function loginService(credentials: LoginCredentials): Promise<void> {
  const params = new URLSearchParams()
  params.append('username', credentials.username)
  params.append('password', credentials.password)

  await apiClient.post('/auth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

/**
 * Recupera el usuario autenticado a partir de la cookie de sesión.
 */
export async function getMeService(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}

/**
 * Cierra sesión: el backend elimina la cookie HttpOnly.
 */
export async function logoutService(): Promise<void> {
  await apiClient.post('/auth/logout')
}
