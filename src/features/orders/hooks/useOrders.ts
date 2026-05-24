import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrdersAdmin,
  getEstadosPedido,
  getOrderById,
  getOrderHistorial,
  changeOrderState,
} from '../services/orderService'
import type { CambioEstadoDto } from '../types'

const QUERY_KEY = 'orders'
const ESTADOS_KEY = 'order-estados'
const HISTORIAL_KEY = 'order-historial'

export function useOrders(
  offset: number,
  limit: number,
  estadoId?: number,
  usuarioId?: number,
) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit, estadoId ?? null, usuarioId ?? null],
    queryFn:  () => getOrdersAdmin(offset, limit, estadoId, usuarioId),
  })
}

export function useEstadosPedido() {
  return useQuery({
    queryKey: [ESTADOS_KEY],
    queryFn:  () => getEstadosPedido(),
    staleTime: 5 * 60 * 1000, // los estados casi no cambian
  })
}

export function useOrderById(id: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => getOrderById(id as number),
    enabled:  id != null && id > 0,
  })
}

export function useOrderHistorial(id: number | null) {
  return useQuery({
    queryKey: [HISTORIAL_KEY, id],
    queryFn:  () => getOrderHistorial(id as number),
    enabled:  id != null && id > 0,
  })
}

export function useChangeOrderState() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CambioEstadoDto }) =>
      changeOrderState(id, dto),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
      qc.invalidateQueries({ queryKey: [HISTORIAL_KEY, id] })
    },
  })
}
