import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Receipt } from 'lucide-react'

import {
  useOrderById,
  useOrderHistorial,
  useChangeOrderState,
} from '../hooks/useOrders'
import { OrderStateBadge } from '../components/OrderStateBadge'
import { ChangeStateForm } from '../components/ChangeStateForm'
import { OrderItemsTable } from '../components/OrderItemsTable'

import { PageHeader } from '@/shared/components/PageHeader'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { KpiCard } from '@/shared/components/KpiCard'
import { usePermissions } from '@/shared/hooks/usePermissions'
import type { CambioEstadoDto } from '../types'

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

function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function OrderDetailPage() {
  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const id = Number(idParam)
  const isValidId = !Number.isNaN(id) && id > 0

  const { data: order, isLoading, error } = useOrderById(isValidId ? id : null)
  const { data: historial, isLoading: loadingHist } = useOrderHistorial(
    isValidId ? id : null,
  )
  const { mutate: changeState, isPending: isChanging } = useChangeOrderState()
  const perms = usePermissions()

  function handleChangeState(dto: CambioEstadoDto) {
    if (!order) return
    changeState({ id: order.id, dto })
  }

  if (!isValidId) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Pedido inválido" subtitle="El ID de pedido no es válido." />
        <ButtonGeneric
          info={
            <>
              <ArrowLeft size={16} aria-hidden="true" /> Volver a pedidos
            </>
          }
          type="Secondary"
          onClick={() => navigate('/orders')}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Cargando pedido..." />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader
          title="No se pudo cargar el pedido"
          subtitle="Verificá el ID o tus permisos."
          action={
            <ButtonGeneric
              info={
                <>
                  <ArrowLeft size={16} aria-hidden="true" /> Volver
                </>
              }
              type="Secondary"
              onClick={() => navigate('/orders')}
            />
          }
        />
      </div>
    )
  }

  const itemsCount = order.detalles.reduce((acc, d) => acc + d.cantidad, 0)

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={formatId(order.id)}
        subtitle={`Creado el ${formatDate(order.created_at)} · Cliente #USR-${order.usuario_id}`}
        action={
          <ButtonGeneric
            info={
              <>
                <ArrowLeft size={16} aria-hidden="true" /> Volver
              </>
            }
            type="Secondary"
            onClick={() => navigate('/orders')}
          />
        }
      />

      {/* KPIs del pedido */}
      <div className="grid grid-cols-4 gap-stack-md">
        <KpiCard
          icon={<Receipt size={13} aria-hidden="true" />}
          label="Total"
          value={formatPrice(order.total)}
        />
        <KpiCard label="Subtotal" value={formatPrice(order.subtotal)} />
        <KpiCard label="Envío" value={formatPrice(order.costo_envio)} />
        <KpiCard label="Ítems" value={itemsCount} subLabel={`${order.detalles.length} producto(s)`} />
      </div>

      {/* Grid principal: detalles a la izquierda, panel de estado a la derecha */}
      <div className="grid grid-cols-3 gap-stack-lg">
        {/* ── Columna izquierda: información + productos + historial ──────── */}
        <div className="col-span-2 flex flex-col gap-stack-lg">
          {/* Información del pedido */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Información</h2>
            </header>
            <div className="p-6 grid grid-cols-2 gap-stack-md">
              <div>
                <p className="text-label-caps text-on-surface-variant">Cliente</p>
                <button
                  type="button"
                  onClick={() => navigate(`/users/${order.usuario_id}`)}
                  className="text-data-mono text-primary mt-1 hover:text-rb-red-hover hover:underline transition-colors text-left"
                >
                  #USR-{String(order.usuario_id).padStart(4, '0')}
                </button>
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">Última actualización</p>
                <p className="text-body-sm text-on-surface mt-1">{formatDate(order.updated_at)}</p>
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
                  <p className="text-body-sm text-on-surface mt-1 italic">"{order.notas_cliente}"</p>
                </div>
              )}
            </div>
          </section>

          {/* Productos */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Productos</h2>
            </header>
            <OrderItemsTable detalles={order.detalles} />
          </section>

          {/* Historial */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Historial de estados</h2>
            </header>
            <div className="p-6">
              {loadingHist ? (
                <p className="text-body-sm text-on-surface-variant">Cargando...</p>
              ) : !historial || historial.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">
                  Sin movimientos registrados.
                </p>
              ) : (
                <ol className="flex flex-col gap-stack-sm">
                  {historial.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-start gap-3 border-l-2 border-primary pl-3 py-1"
                    >
                      <div className="flex-1">
                        <p className="text-label-caps text-on-surface">
                          {h.estado_codigo ?? `Estado #${h.estado_id}`}
                        </p>
                        {h.observaciones && (
                          <p className="text-body-sm text-on-surface-variant mt-0.5">
                            {h.observaciones}
                          </p>
                        )}
                      </div>
                      <span className="text-data-mono text-on-surface-variant text-[11px] whitespace-nowrap">
                        {formatDate(h.fecha_cambio)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>

        {/* ── Columna derecha: estado actual + cambio de estado ───────────── */}
        <aside className="flex flex-col gap-stack-lg">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Estado actual</h2>
            </header>
            <div className="p-6 flex flex-col items-start gap-stack-sm">
              <OrderStateBadge codigo={order.estado_codigo} />
            </div>
          </section>

          {perms.canChangeOrderState && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
              <header className="px-6 py-4 border-b border-outline-variant">
                <h2 className="text-headline-md text-on-surface">Cambiar estado</h2>
              </header>
              <div className="p-6">
                <ChangeStateForm
                  key={`${order.id}-${order.estado_codigo}`}
                  currentState={order.estado_codigo}
                  onSubmit={handleChangeState}
                  onCancel={() => navigate('/orders')}
                  isPending={isChanging}
                />
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
