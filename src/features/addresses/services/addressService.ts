import { apiClient } from '@/shared/lib/axios'
import type { DireccionList } from '../types'

export async function getDireccionesByUsuario(
  usuarioId: number,
  offset = 0,
  limit = 20,
): Promise<DireccionList> {
  const { data } = await apiClient.get<DireccionList>(
    `/direcciones/admin/usuario/${usuarioId}`,
    { params: { offset, limit } },
  )
  return data
}
