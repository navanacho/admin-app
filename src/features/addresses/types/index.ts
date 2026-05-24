// Tipos espejo de los schemas de direcciones del backend FastAPI.

export interface Direccion {
  id: number
  usuario_id: number
  alias: string
  calle: string
  numero: string
  piso_dpto: string | null
  ciudad: string
  provincia: string
  codigo_postal: string | null
  latitud: number | null
  longitud: number | null
  referencias: string | null
  es_principal: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DireccionList {
  data: Direccion[]
  total: number
}
