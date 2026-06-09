import { apiClient } from '@/shared/lib/axios'
import type {
  Pedido,
  PedidoList,
  EstadoPedido,
  HistorialEstadoPedido,
  CambioEstadoDto,
} from '../types'

export async function getOrdersAdmin(
  offset: number,
  limit: number,
  estadoId?: number,
  usuarioId?: number,
): Promise<PedidoList> {
  const { data } = await apiClient.get<PedidoList>('/pedidos/admin/', {
    params: {
      offset,
      limit,
      ...(estadoId ? { estado_id: estadoId } : {}),
      ...(usuarioId ? { usuario_id: usuarioId } : {}),
    },
  })
  return data
}

/**
 * Lista inicial del tablero según la visibilidad del rol del usuario
 * (ROLE_VISIBILITY en el backend). Misma fuente de verdad que el ruteo del WS.
 * Los estados terminales (ENTREGADO/CANCELADO) vienen acotados a las últimas 24h.
 */
export async function getColaPedidos(offset = 0, limit = 100): Promise<PedidoList> {
  const { data } = await apiClient.get<PedidoList>('/pedidos/cola', {
    params: { offset, limit },
  })
  return data
}

export async function getEstadosPedido(): Promise<EstadoPedido[]> {
  const { data } = await apiClient.get<EstadoPedido[]>('/pedidos/estados')
  return data
}

export async function getOrderById(id: number): Promise<Pedido> {
  const { data } = await apiClient.get<Pedido>(`/pedidos/${id}`)
  return data
}

export async function getOrderHistorial(id: number): Promise<HistorialEstadoPedido[]> {
  const { data } = await apiClient.get<HistorialEstadoPedido[]>(`/pedidos/${id}/historial`)
  return data
}

export async function changeOrderState(
  id: number,
  dto: CambioEstadoDto,
): Promise<Pedido> {
  const { data } = await apiClient.patch<Pedido>(`/pedidos/${id}/estado`, dto)
  return data
}
