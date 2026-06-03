import { useQuery } from '@tanstack/react-query'
import { getTicketEvolution } from '../services/statsService'

export function useTicketEvolution(days = 30) {
  return useQuery({
    queryKey: ['ticket-evolution', days],
    queryFn:  () => getTicketEvolution(days),
    staleTime: 60 * 1000,
  })
}
