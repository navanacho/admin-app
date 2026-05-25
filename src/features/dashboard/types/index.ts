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
