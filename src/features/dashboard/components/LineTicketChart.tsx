import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, ChartDataset } from 'chart.js'
import type { TicketEvolutionItem } from '../types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LineTicketChartProps {
  data: TicketEvolutionItem[]
  isLoading: boolean
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function LineTicketChart({ data, isLoading }: LineTicketChartProps) {
  const { min, max, avg, minIndex, maxIndex } = useMemo(() => {
    if (!data.length) return { min: 0, max: 0, avg: 0, minIndex: -1, maxIndex: -1 }

    const values = data.map((d) => Number(d.avg_ticket))
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)

    return {
      min: minVal,
      max: maxVal,
      avg,
      minIndex: values.indexOf(minVal),
      maxIndex: values.indexOf(maxVal),
    }
  }, [data])

  const labels = data.map((d) => {
    const [y, m, day] = d.date.split('-')
    return `${day}/${m}`
  })

  const datasets: ChartDataset<'line'>[] = [
    // ── Línea del promedio (destacada, sólida, ancha) ──
    {
      label: 'Promedio',
      data: Array(data.length).fill(avg),
      borderColor: '#e89b1c',
      backgroundColor: 'rgba(232, 155, 28, 0.06)',
      borderWidth: 3,
      borderDash: [],
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      order: 0,
    },
    // ── Línea del ticket diario (sutil) ──
    {
      label: 'Ticket diario',
      data: data.map((d) => Number(d.avg_ticket)),
      borderColor: 'rgba(180, 0, 15, 0.4)',
      backgroundColor: 'rgba(180, 0, 15, 0.04)',
      pointBackgroundColor: data.map((_, i) => {
        if (i === maxIndex) return '#4a7a2e'
        if (i === minIndex) return '#b4000f'
        return 'rgba(180, 0, 15, 0.3)'
      }),
      pointBorderColor: 'transparent',
      pointRadius: data.map((_, i) =>
        i === maxIndex || i === minIndex ? 6 : 2,
      ),
      pointHoverRadius: 6,
      fill: true,
      tension: 0.3,
      borderWidth: 1.5,
      order: 1,
    },
  ]

  const chartData: ChartData<'line'> = { labels, datasets }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label === 'Promedio') return `Promedio: ${formatPrice(ctx.parsed.y)}`
            if (ctx.parsed.y === max) return `Máximo: ${formatPrice(ctx.parsed.y)}`
            if (ctx.parsed.y === min) return `Mínimo: ${formatPrice(ctx.parsed.y)}`
            return `Ticket: ${formatPrice(ctx.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 10 },
          color: '#5c403c',
          maxRotation: 45,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: { color: 'rgba(92, 64, 60, 0.08)' },
        ticks: {
          font: { family: 'JetBrains Mono', size: 10 },
          color: '#5c403c',
          callback: (val) => `$${val}`,
        },
        beginAtZero: false,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Ticket promedio</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Cargando…
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-label-caps text-on-surface-variant">Ticket promedio</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-variant text-body-sm">
          Sin datos disponibles
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
      <h3 className="text-label-caps text-on-surface-variant">Ticket promedio</h3>

      {/* Resumen — promedio DESTACADO al centro */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2 bg-surface-container-high rounded-sm px-4 py-3">
          <TrendingDown size={16} className="text-danger shrink-0" />
          <div className="flex flex-col">
            <span className="text-label-caps text-on-surface-variant">Mínimo</span>
            <span className="text-data-mono text-on-surface">{formatPrice(min)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-sm px-4 py-3 ring-1 ring-warning/20">
          <Minus size={20} className="text-warning shrink-0" />
          <div className="flex flex-col">
            <span className="text-label-caps text-warning">Promedio</span>
            <span className="text-data-mono text-on-surface text-lg font-bold">{formatPrice(avg)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high rounded-sm px-4 py-3">
          <TrendingUp size={16} className="text-success shrink-0" />
          <div className="flex flex-col">
            <span className="text-label-caps text-on-surface-variant">Máximo</span>
            <span className="text-data-mono text-on-surface">{formatPrice(max)}</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-72">
        <Line data={chartData} options={options} />
      </div>

      {/* Leyenda inline */}
      <div className="flex items-center gap-6 text-label-caps text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#e89b1c] inline-block" /> Promedio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[rgba(180,0,15,0.4)] inline-block" /> Ticket diario
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#4a7a2e] inline-block" /> Máximo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#b4000f] inline-block" /> Mínimo
        </span>
      </div>
    </div>
  )
}
