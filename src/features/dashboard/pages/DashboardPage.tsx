import {
  Receipt,
  DollarSign,
  Clock,
  Package,
  AlertTriangle,
  Refrigerator,
} from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useTicketEvolution } from '../hooks/useTicketEvolution'
import { useOrdersByStatus } from '../hooks/useOrdersByStatus'
import { useOrdersByDay } from '../hooks/useOrdersByDay'

import { PageHeader } from '@/shared/components/PageHeader'
import { KpiCard }    from '@/shared/components/KpiCard'
import { LineTicketChart } from '../components/LineTicketChart'
import { PieOrdersStatus } from '../components/PieOrdersStatus'
import { BarOrdersWeek }   from '../components/BarOrdersWeek'

function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: ticketEvo, isLoading: ticketLoading } = useTicketEvolution(30)
  const { data: ordersStatus, isLoading: statusLoading } = useOrdersByStatus()
  const { data: ordersDay, isLoading: dayLoading } = useOrdersByDay(7)

  const subtitle = user
    ? `Bienvenido, ${user.full_name.split(' ')[0]}. Métricas en tiempo real.`
    : 'Métricas en tiempo real.'

  if (statsLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Dashboard" subtitle="Cargando métricas…" />
      </div>
    )
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader
          title="Dashboard"
          subtitle="No se pudieron cargar las métricas."
        />
        <div className="bg-surface-container rounded-md p-gutter text-body-sm text-danger">
          Error al obtener las estadísticas. Volvé a intentar en unos minutos.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader title="Dashboard" subtitle={subtitle} />

      {/* ── Sección: Pedidos / Ventas de HOY ─────────────────────────────── */}
      <section className="flex flex-col gap-stack-md">
        <h2 className="text-label-caps text-on-surface-variant">Hoy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
          <KpiCard
            icon={<Receipt size={13} aria-hidden="true" />}
            label="Pedidos hoy"
            value={stats.pedidos_hoy}
            subLabel="Recibidos en el día"
          />
          <KpiCard
            icon={<DollarSign size={13} aria-hidden="true" />}
            label="Ganancia hoy"
            value={formatPrice(stats.ganancia_hoy)}
            subLabel="No cancelados"
          />
          <KpiCard
            variant="warning"
            icon={<Clock size={13} aria-hidden="true" />}
            label="Pedidos pendientes"
            value={stats.pedidos_pendientes}
            subLabel="En curso (todos)"
          />
        </div>
      </section>

      {/* ── Sección: Volumen + Catálogo ──────────────────────────────────── */}
      <section className="flex flex-col gap-stack-md">
        <h2 className="text-label-caps text-on-surface-variant">Resumen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
          <KpiCard
            icon={<Package size={13} aria-hidden="true" />}
            label="Productos activos"
            value={stats.productos_activos}
            subLabel="No eliminados"
          />
          <KpiCard
            icon={<Refrigerator size={13} aria-hidden="true" />}
            label="Ingredientes activos"
            value={stats.ingredientes_activos}
            subLabel="Disponibles en cocina"
          />
          <KpiCard
            variant="warning"
            icon={<AlertTriangle size={13} aria-hidden="true" />}
            label="Ingredientes bajo stock"
            value={stats.ingredientes_bajo_stock}
            subLabel="Stock propio < 10"
          />
        </div>
      </section>

      {/* ── Sección: Gráficos ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-stack-md">
        <h2 className="text-label-caps text-on-surface-variant">Analytics</h2>

        {/* Fila 1: Ticket promedio (línea) — ocupa todo el ancho */}
        <LineTicketChart data={ticketEvo ?? []} isLoading={ticketLoading} />

        {/* Fila 2: Pedidos por estado + Pedidos por día */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
          <PieOrdersStatus data={ordersStatus} isLoading={statusLoading} />
          <BarOrdersWeek data={ordersDay ?? []} isLoading={dayLoading} />
        </div>
      </section>
    </div>
  )
}
