export interface DashboardStats {
  pedidos_hoy:           number
  ganancia_hoy:          string   // Decimal serializado por FastAPI
  ticket_promedio_hoy:   string
  pedidos_pendientes:    number
  pedidos_semana:        number
  productos_activos:       number
  productos_bajo_stock:    number
  ingredientes_activos:    number
  ingredientes_bajo_stock: number
}

export interface TicketEvolutionItem {
  date: string       // YYYY-MM-DD
  avg_ticket: number
}

export interface OrdersByStatus {
  pendiente:       number
  confirmado:      number
  en_preparacion:  number
  en_camino:       number
  entregado:       number
  cancelado:       number
}

export interface OrdersByDayItem {
  date:     string  // YYYY-MM-DD
  day_name: string
  count:    number
}
