import { Pie } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import type { OrdersByStatus } from '../types'

interface PieOrdersStatusProps {
  data: OrdersByStatus | undefined
  isLoading: boolean
}

const STATUS_COLORS: Record<string, string> = {
  pendiente:      '#e89b1c',  // amber — atención pendiente
  confirmado:     '#4a7a2e',  // verde — listo para cocinar
  en_preparacion: '#b4000f',  // rb-red — en acción
  en_camino:      '#1565c0',  // azul — en ruta
  entregado:      '#2d2d2d',  // gris oscuro — finalizado
  cancelado:      '#8d9db0',  // gris azulado — anulado
}

const STATUS_LABELS: Record<string, string> = {
  pendiente:      'Pendiente',
  confirmado:     'Confirmado',
  en_preparacion: 'En preparación',
  en_camino:      'En camino',
  entregado:      'Entregado',
  cancelado:      'Cancelado',
}

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: { family: 'Inter', size: 11, weight: 'bold' },
        color: '#5c403c',
        padding: 12,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: '#1e1e1e',
      titleFont: { family: 'Inter', size: 12, weight: 'bold' },
      bodyFont: { family: 'JetBrains Mono', size: 12 },
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => {
          const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0)
          const value = ctx.parsed
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
          return ` ${ctx.label}: ${value} (${pct}%)`
        },
      },
    },
  },
}

export function PieOrdersStatus({ data, isLoading }: PieOrdersStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Pedidos por estado</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Cargando…
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Pedidos por estado</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Sin datos disponibles
        </div>
      </div>
    )
  }

  const entries = Object.entries(STATUS_LABELS)
    .filter(([key]) => data[key as keyof OrdersByStatus] > 0)
    .map(([key, label]) => ({
      label,
      value: data[key as keyof OrdersByStatus],
      color: STATUS_COLORS[key],
    }))

  const total = entries.reduce((sum, e) => sum + e.value, 0)

  const chartData: ChartData<'pie'> = {
    labels: entries.map((e) => e.label),
    datasets: [
      {
        data: entries.map((e) => e.value),
        backgroundColor: entries.map((e) => e.color),
        borderWidth: 2,
        borderColor: '#fff8f7',
      },
    ],
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
      <h3 className="text-label-caps text-on-surface-variant">Pedidos por estado</h3>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-data-mono text-on-surface">{total}</span>
        <span className="text-label-caps text-on-surface-variant">pedidos</span>
      </div>

      <div className="h-72">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}
