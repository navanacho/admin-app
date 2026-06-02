import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from 'chart.js'

/**
 * Registro global de componentes de Chart.js.
 * Agrupamos todo lo necesario para los gráficos del dashboard:
 * - Doughnut / Pie → ArcElement
 * - Line (ticket evolution) → CategoryScale, LinearScale, PointElement, LineElement, Filler
 * - Bar (pedidos por día) → CategoryScale, LinearScale, BarElement
 */
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export default ChartJS
