import { useRef, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { KanbanColumn } from '@/shared/components/board/KanbanColumn'
import {
  OrderCard,
  OrderDetailModal,
  useOrdersBoard,
  useChangeOrderState,
} from '@/features/orders'
import type { Pedido } from '@/features/orders'
import { nextState } from '@/features/orders/lib/transitions'

// Cocina solo ve CONFIRMADO y EN_PREP (ROLE_VISIBILITY del backend). Al marcar
// EN_PREP→LISTO el pedido sale de su tablero (llega un REMOVE).
const COLUMNS = [
  { codigo: 'CONFIRMADO', title: 'Confirmado', accent: 'text-primary' },
  { codigo: 'EN_PREP', title: 'En preparación', accent: 'text-rb-bone' },
] as const

export function CocinaBoardPage() {
  const { byState, isLoading } = useOrdersBoard()
  const { mutate: changeState, isPending } = useChangeOrderState()

  const detailRef = useRef<HTMLDialogElement>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function openDetail(id: number) {
    setSelectedId(id)
    detailRef.current?.showModal()
  }

  function advance(pedido: Pedido) {
    const next = nextState(pedido.estado_codigo)
    if (!next) return
    changeState({ id: pedido.id, dto: { nuevo_estado: next } })
  }

  return (
    <div className="flex flex-col gap-stack-lg h-full">
      <PageHeader title="Cocina" subtitle="Cola de preparación en tiempo real" />

      <div className="grid grid-cols-2 gap-stack-md flex-1 min-h-0">
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
                  isAdvancing={isPending}
                />
              ))}
            </KanbanColumn>
          )
        })}
      </div>

      {isLoading && (
        <p className="text-body-sm text-on-surface-variant">Cargando tablero...</p>
      )}

      <OrderDetailModal dialogRef={detailRef} orderId={selectedId} variant="cocina" />
    </div>
  )
}
