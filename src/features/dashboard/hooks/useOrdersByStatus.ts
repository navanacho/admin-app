import { useQuery } from '@tanstack/react-query'
import { getOrdersByStatus } from '../services/statsService'

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ['orders-by-status'],
    queryFn:  getOrdersByStatus,
    staleTime: 60 * 1000,
  })
}
