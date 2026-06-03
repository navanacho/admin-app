import { useQuery } from '@tanstack/react-query'
import { getOrdersByDay } from '../services/statsService'

export function useOrdersByDay(days = 7) {
  return useQuery({
    queryKey: ['orders-by-day', days],
    queryFn:  () => getOrdersByDay(days),
    staleTime: 60 * 1000,
  })
}
