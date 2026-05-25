import { Minus, Plus } from 'lucide-react'

interface StepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  ariaLabel?: string
}

/**
 * Control numérico compacto `− / N / +`. Pensado para cantidades pequeñas
 * (recetas, items de un pedido). El input central acepta tipeo directo y
 * se normaliza al rango en cada cambio.
 */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  ariaLabel,
}: StepperProps) {
  function clamp(n: number): number {
    if (Number.isNaN(n)) return min
    return Math.min(max, Math.max(min, Math.floor(n)))
  }

  function set(next: number) {
    onChange(clamp(next))
  }

  return (
    <div
      className={`inline-flex items-center bg-rb-charcoal border border-white/10 rounded-sm ${
        disabled ? 'opacity-50' : ''
      }`}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => set(value - step)}
        disabled={disabled || value <= min}
        aria-label="Bajar cantidad"
        className="px-2 py-1 text-rb-bone hover:bg-rb-bone/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-sm"
      >
        <Minus size={13} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => set(Number(e.target.value))}
        className="w-10 bg-transparent text-center text-data-mono text-[13px] text-rb-bone focus:outline-none border-x border-white/10 py-1 disabled:cursor-not-allowed
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + step)}
        disabled={disabled || value >= max}
        aria-label="Subir cantidad"
        className="px-2 py-1 text-rb-bone hover:bg-rb-bone/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-sm"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
