import {
  Receipt,
  DollarSign,
  CircleDollarSign,
  Clock,
  CalendarRange,
  Package,
  AlertTriangle,
  Refrigerator,
} from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { useDashboardStats } from '../hooks/useDashboardStats'

import { PageHeader } from '@/shared/components/PageHeader'
import { KpiCard }    from '@/shared/components/KpiCard'

function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, error } = useDashboardStats()

  const subtitle = user
    ? `Bienvenido, ${user.full_name.split(' ')[0]}. Métricas en tiempo real.`
    : 'Métricas en tiempo real.'

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Dashboard" subtitle="Cargando métricas…" />
      </div>
    )
  }

  if (error || !data) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-stack-md">
          <KpiCard
            icon={<Receipt size={13} aria-hidden="true" />}
            label="Pedidos hoy"
            value={data.pedidos_hoy}
            subLabel="Recibidos en el día"
          />
          <KpiCard
            icon={<DollarSign size={13} aria-hidden="true" />}
            label="Ganancia hoy"
            value={formatPrice(data.ganancia_hoy)}
            subLabel="No cancelados"
          />
          <KpiCard
            icon={<CircleDollarSign size={13} aria-hidden="true" />}
            label="Ticket promedio"
            value={formatPrice(data.ticket_promedio_hoy)}
            subLabel="Hoy"
          />
          <KpiCard
            variant="warning"
            icon={<Clock size={13} aria-hidden="true" />}
            label="Pedidos pendientes"
            value={data.pedidos_pendientes}
            subLabel="En curso (todos)"
          />
        </div>
      </section>

      {/* ── Sección: Volumen + Catálogo ──────────────────────────────────── */}
      <section className="flex flex-col gap-stack-md">
        <h2 className="text-label-caps text-on-surface-variant">Resumen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-stack-md">
          <KpiCard
            icon={<CalendarRange size={13} aria-hidden="true" />}
            label="Pedidos esta semana"
            value={data.pedidos_semana}
            subLabel="Últimos 7 días"
          />
          <KpiCard
            icon={<Package size={13} aria-hidden="true" />}
            label="Productos activos"
            value={data.productos_activos}
            subLabel="No eliminados"
          />
          <KpiCard
            variant="warning"
            icon={<AlertTriangle size={13} aria-hidden="true" />}
            label="Bajo stock"
            value={data.productos_bajo_stock}
            subLabel="Stock < 10"
          />
          <KpiCard
            icon={<Refrigerator size={13} aria-hidden="true" />}
            label="Ingredientes activos"
            value={data.ingredientes_activos}
            subLabel="Disponibles en cocina"
          />
        </div>
      </section>
    </div>
  )
}
