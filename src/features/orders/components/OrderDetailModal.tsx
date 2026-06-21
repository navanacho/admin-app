import type { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'

import { Modal } from '@/shared/components/Modal'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { useOrders } from '../hooks/useOrders'
import { OrderItemsTable } from './OrderItemsTable'
import { OrderStateBadge } from './OrderStateBadge'

function formatId(id: number): string {
  return `#PED-${String(id).padStart(4, '0')}`
}

function formatPrice(value: string): string {
  const n = parseFloat(value)
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface OrderDetailModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>
  /** Pedido a mostrar. null mientras no hay nada seleccionado. */
  orderId: number | null
  /**
   * cocina: solo productos a preparar.
   * full: productos + dirección + pago + total + botón "Ir al cliente" (cajero).
   */
  variant: 'cocina' | 'full'
}

/**
 * Detalle de pedido dentro de un modal, reutilizado por los tableros de cocina
 * y cajero. La variante "cocina" oculta toda la información comercial; la "full"
 * replica la info del detalle full-page (OrderDetailPage).
 */
export function OrderDetailModal({ dialogRef, orderId, variant }: OrderDetailModalProps) {
  const { useOrderById } = useOrders()
  const navigate = useNavigate()
  const { data: order, isLoading } = useOrderById(orderId)
  const isFull = variant === 'full'

  return (
    <Modal
      dialogRef={dialogRef}
      title={order ? formatId(order.id) : 'Pedido'}
      size={isFull ? 'lg' : 'md'}
    >
      {isLoading || !order ? (
        <p className="text-body-sm text-on-surface-variant">Cargando pedido...</p>
      ) : (
        <div className="flex flex-col gap-stack-md">
          {isFull ? (
            <>
              {/* Estado actual */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
                <header className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="text-headline-md text-on-surface">Estado actual</h2>
                </header>
                <div className="px-6 py-4">
                  <OrderStateBadge codigo={order.estado_codigo} />
                </div>
              </section>

              {/* Información */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
                <header className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="text-headline-md text-on-surface">Información</h2>
                </header>
                <div className="p-6 grid grid-cols-2 gap-stack-md">
                  <div>
                    <p className="text-label-caps text-on-surface-variant">Total</p>
                    <p className="text-data-mono text-on-surface mt-1 font-semibold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-label-caps text-on-surface-variant">Subtotal · Envío</p>
                    <p className="text-data-mono text-on-surface mt-1">
                      {formatPrice(order.subtotal)} · {formatPrice(order.costo_envio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-label-caps text-on-surface-variant">Dirección de entrega</p>
                    <p className="text-body-sm text-on-surface mt-1">
                      {order.direccion_entrega_id != null
                        ? `#DIR-${order.direccion_entrega_id}`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-label-caps text-on-surface-variant">Forma de pago</p>
                    <p className="text-body-sm text-on-surface mt-1">
                      {order.forma_pago_id != null ? `#PAG-${order.forma_pago_id}` : '—'}
                    </p>
                  </div>
                  {order.notas_cliente && (
                    <div className="col-span-2">
                      <p className="text-label-caps text-on-surface-variant">Notas del cliente</p>
                      <p className="text-body-sm text-on-surface mt-1 italic">
                        "{order.notas_cliente}"
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Productos */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
                <header className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="text-headline-md text-on-surface">Productos</h2>
                </header>
                <OrderItemsTable detalles={order.detalles} showPrices />
              </section>

              <div className="flex justify-end">
                <ButtonGeneric
                  info={
                    <>
                      <User size={16} aria-hidden="true" /> Ir al cliente
                    </>
                  }
                  type="Secondary"
                  onClick={() => navigate(`/users/${order.usuario_id}`)}
                />
              </div>
            </>
          ) : (
            <>
              <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
                <header className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="text-headline-md text-on-surface">Estado actual</h2>
                </header>
                <div className="px-6 py-4">
                  <OrderStateBadge codigo={order.estado_codigo} />
                </div>
              </section>
              <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
                <header className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="text-headline-md text-on-surface">Productos</h2>
                </header>
                <OrderItemsTable detalles={order.detalles} showPrices={false} showIngredients />
              </section>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
