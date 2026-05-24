import { apiClient } from '@/shared/lib/axios'
import type { DashboardStats } from '../types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/stats/dashboard')
  return data
}
