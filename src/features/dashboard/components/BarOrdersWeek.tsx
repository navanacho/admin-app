import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import type { OrdersByDayItem } from '../types'

interface BarOrdersWeekProps {
  data: OrdersByDayItem[]
  isLoading: boolean
}

const ALL_DAYS: { key: string; label: string }[] = [
  { key: 'lunes',     label: 'Lunes' },
  { key: 'martes',    label: 'Martes' },
  { key: 'miércoles', label: 'Miércoles' },
  { key: 'jueves',    label: 'Jueves' },
  { key: 'viernes',   label: 'Viernes' },
  { key: 'sábado',    label: 'Sábado' },
  { key: 'domingo',   label: 'Domingo' },
]

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e1e1e',
      titleFont: { family: 'Inter', size: 12, weight: 'bold' },
      bodyFont: { family: 'JetBrains Mono', size: 12 },
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => `${ctx.parsed.y} pedidos`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11, weight: 'bold' },
        color: '#5c403c',
      },
    },
    y: {
      grid: { color: 'rgba(92, 64, 60, 0.1)' },
      ticks: {
        font: { family: 'JetBrains Mono', size: 10 },
        color: '#5c403c',
        precision: 0,
      },
      beginAtZero: true,
    },
  },
}

export function BarOrdersWeek({ data, isLoading }: BarOrdersWeekProps) {
  // Armar semana completa (lun-dom), rellenando con 0 los días que faltan
  const sorted = useMemo(() => {
    const byDay = new Map(
      data.map((d) => [d.day_name.toLowerCase(), d]),
    )

    return ALL_DAYS.map(({ key, label }) => {
      const found = byDay.get(key)
      return {
        date: found?.date ?? '',
        day_name: label,
        count: found?.count ?? 0,
      }
    })
  }, [data])

  if (isLoading) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Pedidos por día</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Cargando…
        </div>
      </div>
    )
  }

  if (!sorted.length) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Pedidos por día</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Sin datos disponibles
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...sorted.map((d) => d.count))

  const chartData: ChartData<'bar'> = {
    labels: sorted.map((d) => d.day_name),
    datasets: [
      {
        label: 'Pedidos',
        data: sorted.map((d) => d.count),
        backgroundColor: sorted.map((d) =>
          d.count === maxCount ? '#880008' : '#b4000f',
        ),
        borderWidth: 0,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
      <h3 className="text-label-caps text-on-surface-variant">Pedidos por día</h3>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-data-mono text-on-surface">{total}</span>
        <span className="text-label-caps text-on-surface-variant">
          pedidos esta semana
        </span>
      </div>

      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
