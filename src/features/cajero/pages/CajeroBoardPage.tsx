import { useRef, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { KanbanColumn } from '@/shared/components/board/KanbanColumn'
import {
  OrderCard,
  OrderDetailModal,
  DeliveredOrdersTable,
  useOrders,
} from '@/features/orders'
import type { Pedido } from '@/features/orders'
import { nextState } from '@/features/orders/lib/transitions'

// Columnas modificables del tablero de cajero, en orden de flujo.
const COLUMNS = [
  { codigo: 'PENDIENTE', title: 'Pendiente', accent: 'text-warning' },
  { codigo: 'LISTO', title: 'Listo', accent: 'text-success' },
] as const

export function CajeroBoardPage() {
  const { useOrdersBoard, useChangeOrderState } = useOrders()
  const { byState, isLoading } = useOrdersBoard()
  const { mutate: changeState, isPending } = useChangeOrderState()

  const detailRef = useRef<HTMLDialogElement>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Panel "En cocina" (read-only): pedidos confirmados o en preparación.
  const enCocina = [...(byState.CONFIRMADO ?? []), ...(byState.EN_PREP ?? [])]
  // Tabla inferior: estados terminales (el backend los acota a las últimas 24h).
  const terminales = [...(byState.ENTREGADO ?? []), ...(byState.CANCELADO ?? [])]

  function openDetail(id: number) {
    setSelectedId(id)
    detailRef.current?.showModal()
  }

  function advance(pedido: Pedido) {
    const next = nextState(pedido.estado_codigo)
    if (!next) return
    changeState({ id: pedido.id, dto: { nuevo_estado: next } })
  }

  function cancel(pedido: Pedido) {
    changeState({ id: pedido.id, dto: { nuevo_estado: 'CANCELADO' } })
  }

  return (
    <div className="flex flex-col gap-stack-lg h-full">
      <PageHeader title="Caja" subtitle="Toma y confirmación de pedidos en tiempo real" />

      <div className="flex gap-stack-md flex-1 min-h-0">
        {/* Panel read-only: pedidos ya confirmados / en cocina */}
        <div className="w-72 shrink-0 flex">
          <KanbanColumn
            title="En cocina"
            accentClass="text-primary"
            count={enCocina.length}
            emptyHint="Nada en cocina"
          >
            {enCocina.map((pedido) => (
              <OrderCard key={pedido.id} pedido={pedido} onOpenDetail={openDetail} showState />
            ))}
          </KanbanColumn>
        </div>

        {/* Columnas modificables: confirmar pendientes y entregar listos */}
        <div className="grid grid-cols-2 gap-stack-md flex-1 min-w-0">
          {COLUMNS.map((col) => {
            const pedidos = byState[col.codigo] ?? []
            return (
              <KanbanColumn
                key={col.codigo}
                title={col.title}
                accentClass={col.accent}
                count={pedidos.length}
              >
                {pedidos.map((pedido) => (
                  <OrderCard
                    key={pedido.id}
                    pedido={pedido}
                    onOpenDetail={openDetail}
                    onAdvance={advance}
                    onCancel={col.codigo === 'PENDIENTE' ? cancel : undefined}
                    isAdvancing={isPending}
                    showTotal
                  />
                ))}
              </KanbanColumn>
            )
          })}
        </div>
      </div>

      <DeliveredOrdersTable
        title="Entregados y cancelados"
        pedidos={terminales}
        onOpenDetail={openDetail}
        isLoading={isLoading}
      />

      <OrderDetailModal dialogRef={detailRef} orderId={selectedId} variant="full" />
    </div>
  )
}
