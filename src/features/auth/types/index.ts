export interface UserRole {
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
  roles: UserRole[]
}

export interface LoginCredentials {
  username: string
  password: string
}
