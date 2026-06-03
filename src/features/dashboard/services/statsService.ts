import { apiClient } from '@/shared/lib/axios'
import type {
  DashboardStats,
  TicketEvolutionItem,
  OrdersByStatus,
  OrdersByDayItem,
} from '../types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/stats/dashboard')
  return data
}

export async function getTicketEvolution(days = 30): Promise<TicketEvolutionItem[]> {
  const { data } = await apiClient.get<TicketEvolutionItem[]>('/stats/ticket-evolution', {
    params: { days },
  })
  return data
}

export async function getOrdersByStatus(): Promise<OrdersByStatus> {
  const { data } = await apiClient.get<OrdersByStatus>('/stats/orders-by-status')
  return data
}

export async function getOrdersByDay(days = 7): Promise<OrdersByDayItem[]> {
  const { data } = await apiClient.get<OrdersByDayItem[]>('/stats/orders-by-day', {
    params: { days },
  })
  return data
}
