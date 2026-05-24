import { apiClient } from '@/shared/lib/axios'
import type { User, UsuarioRol, AsignarRolDto } from '../types'

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/auth/admin/users')
  return data
}

export async function deactivateUser(id: number): Promise<User> {
  const { data } = await apiClient.post<User>(`/auth/admin/users/desactivar/${id}`)
  return data
}

export async function activateUser(id: number): Promise<User> {
  const { data } = await apiClient.post<User>(`/auth/admin/users/activar/${id}`)
  return data
}

export async function getUserRoles(id: number): Promise<UsuarioRol[]> {
  const { data } = await apiClient.get<UsuarioRol[]>(`/auth/admin/users/roles/${id}`)
  return data
}

export async function asignarRol(id: number, dto: AsignarRolDto): Promise<UsuarioRol> {
  const { data } = await apiClient.post<UsuarioRol>(
    `/auth/admin/users/asignar/${id}`,
    dto,
  )
  return data
}

export async function quitarRol(id: number, rolCode: string): Promise<void> {
  await apiClient.delete(`/auth/admin/users/${id}/roles/${rolCode}`)
}
