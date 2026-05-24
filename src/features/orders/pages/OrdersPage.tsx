import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Receipt, Clock, Truck } from 'lucide-react'

import { useOrders, useEstadosPedido } from '../hooks/useOrders'
import { OrderStateBadge } from '../components/OrderStateBadge'
import { OrderStatusFilter } from '../components/OrderStatusFilter'

import { PageHeader } from '@/shared/components/PageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { EntityTable } from '@/shared/components/EntityTable'

const LIMIT = 10

function formatId(id: number): string {
  return `#PED-${String(id).padStart(4, '0')}`
}

function currentPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1
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

export function OrdersPage() {
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)
  const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null)

  const { data: estados = [] } = useEstadosPedido()
  const { data, isLoading, error } = useOrders(
    offset,
    LIMIT,
    selectedEstadoId ?? undefined,
  )

  const orders = data?.data ?? []
  const total = data?.total ?? 0

  const pendingCount = orders.filter((o) => o.estado_codigo === 'PENDIENTE').length
  const enRutaCount = orders.filter((o) => o.estado_codigo === 'EN_CAMINO').length

  function handleSelectEstado(estadoId: number | null) {
    setSelectedEstadoId(estadoId)
    setOffset(0)
  }

  const hasPrev = offset > 0
  const hasNext = offset + LIMIT < total
  function goNext() {
    setOffset((o) => o + LIMIT)
  }
  function goPrev() {
    setOffset((o) => Math.max(0, o - LIMIT))
  }

  function goToDetail(orderId: number) {
    navigate(`/orders/${orderId}`)
  }

  const tableTitle = useMemo(() => {
    if (selectedEstadoId == null) return `Pedidos — Página ${currentPage(offset, LIMIT)}`
    const estado = estados.find((e) => e.id === selectedEstadoId)
    return `${estado?.descripcion ?? 'Pedidos'} — Página ${currentPage(offset, LIMIT)}`
  }, [selectedEstadoId, estados, offset])

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Pedidos"
        subtitle="Gestión de órdenes: seguí el flujo y cambiá el estado de cada pedido."
      />

      <div className="grid grid-cols-3 gap-stack-md">
        <KpiCard
          icon={<Receipt size={13} aria-hidden="true" />}
          label="Total"
          value={total}
          subLabel={selectedEstadoId == null ? 'Todos los estados' : 'Filtrado'}
        />
        <KpiCard
          variant="warning"
          icon={<Clock size={13} aria-hidden="true" />}
          label="Pendientes en página"
          value={pendingCount}
          subLabel="Requieren confirmación"
        />
        <KpiCard
          icon={<Truck size={13} aria-hidden="true" />}
          label="En camino en página"
          value={enRutaCount}
          subLabel="En reparto"
        />
      </div>

      <OrderStatusFilter
        estados={estados}
        selectedEstadoId={selectedEstadoId}
        onSelect={handleSelectEstado}
        total={total}
      />

      <EntityTable
        title={tableTitle}
        isLoading={isLoading}
        isEmpty={!error && orders.length === 0}
        entityLabel="pedidos"
        pagination={{
          startIndex: total === 0 ? 0 : offset + 1,
          endIndex: Math.min(offset + LIMIT, total),
          total,
          hasPrev,
          hasNext,
          goNext,
          goPrev,
        }}
        thead={
          <tr>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant w-32">ID</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">CLIENTE</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">FECHA</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ÍTEMS</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">TOTAL</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ESTADO</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ACCIONES</th>
          </tr>
        }
      >
        {orders.map((order) => {
          const itemsCount = order.detalles.reduce((acc, d) => acc + d.cantidad, 0)

          return (
            <tr
              key={order.id}
              onClick={() => goToDetail(order.id)}
              className="border-b border-outline-variant last:border-0 transition-colors hover:bg-surface-container cursor-pointer"
            >
              <td className="px-6 py-4">
                <span className="text-data-mono text-primary">{formatId(order.id)}</span>
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/users/${order.usuario_id}`)
                  }}
                  className="text-data-mono text-primary hover:text-rb-red-hover hover:underline transition-colors"
                >
                  #USR-{String(order.usuario_id).padStart(4, '0')}
                </button>
              </td>
              <td className="px-6 py-4">
                <span className="text-body-sm text-on-surface-variant">
                  {formatDate(order.created_at)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-data-mono text-on-surface">{itemsCount}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-data-mono text-rb-bone font-semibold">
                  {formatPrice(order.total)}
                </span>
              </td>
              <td className="px-6 py-4">
                <OrderStateBadge codigo={order.estado_codigo} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToDetail(order.id)
                    }}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-sm hover:bg-surface-container-high transition-colors"
                    aria-label={`Ver detalle de ${formatId(order.id)}`}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </EntityTable>
    </div>
  )
}
