// Tipos espejo de los schemas de usuarios del backend FastAPI.

export type RoleCode = 'ADMIN' | 'STOCK' | 'PEDIDOS'

/** Constante con todos los códigos conocidos. Si el back agrega uno, sumarlo. */
export const ALL_ROLE_CODES: RoleCode[] = ['ADMIN', 'STOCK', 'PEDIDOS']

export interface UsuarioRol {
  rol_code: string
  expires_at: string | null
  created_at: string
}

export interface User {
  id: number
  username: string
  full_name: string
  email: string
  disabled: boolean
  roles: UsuarioRol[]
}

export interface AsignarRolDto {
  rol_code: string
  expires_at?: string | null
}
