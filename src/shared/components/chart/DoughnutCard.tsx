import { Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

interface DoughnutCardProps {
  title: string
  labels: string[]
  values: number[]
  colors?: string[]
}

/** Paleta por defecto alineada con los tokens del sistema de diseño. */
const DEFAULT_COLORS = [
  '#b4000f', // --color-rb-red
  '#e89b1c', // --color-warning
  '#4a7a2e', // --color-success
  '#1e1e1e', // --color-rb-charcoal
  '#f0e1d2', // --color-rb-bone
  '#880008', // --color-primary
]

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: 'Inter', size: 11, weight: 'bold' },
        color: '#5c403c',
        padding: 12,
        usePointStyle: true,
      },
    },
  },
  cutout: '68%',
}

/**
 * Tarjeta con gráfico de dona (Doughnut).
 * Usa los tokens de diseño del sistema (colores, tipografía, spacing).
 */
export function DoughnutCard({ title, labels, values, colors = DEFAULT_COLORS }: DoughnutCardProps) {
  const data: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderWidth: 2,
        borderColor: '#fff8f7', // --color-surface
      },
    ],
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-md p-6 flex flex-col gap-4">
      <h3 className="text-label-caps text-on-surface-variant">{title}</h3>
      <div className="h-64">
        {values.every((v) => v === 0) ? (
          <div className="flex items-center justify-center h-full text-on-surface-variant text-body-sm">
            Sin datos disponibles
          </div>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  )
}
