// Tipos espejo de los schemas de pedidos del backend FastAPI.
// Decimal viaja como string (FastAPI/Pydantic serializa Decimal a string).

export type EstadoPedidoCodigo =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'LISTO'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface EstadoPedido {
  id: number
  codigo: EstadoPedidoCodigo
  descripcion: string
  orden: number
  created_at: string
}

export interface DetallePedido {
  id: number
  pedido_id: number
  producto_id: number
  producto_nombre: string
  producto_precio_unitario: string
  cantidad: number
  subtotal: string
  created_at: string
}

export interface Pedido {
  id: number
  usuario_id: number
  estado_id: number
  estado_codigo: EstadoPedidoCodigo
  direccion_entrega_id: number | null
  forma_pago_id: number | null
  notas_cliente: string | null
  subtotal: string
  costo_envio: string
  total: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  detalles: DetallePedido[]
}

export interface PedidoList {
  data: Pedido[]
  total: number
}

export interface HistorialEstadoPedido {
  id: number
  pedido_id: number
  estado_id: number
  observaciones: string | null
  usuario_cambio_id: number | null
  fecha_cambio: string
  estado_codigo: string | null
}

export interface CambioEstadoDto {
  nuevo_estado: EstadoPedidoCodigo
  observaciones?: string | null
}
