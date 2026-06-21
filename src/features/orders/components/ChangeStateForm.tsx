import { useState } from 'react'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { SelectField } from '@/shared/components/SelectField'
import type { EstadoPedidoCodigo, CambioEstadoDto } from '../types'
import { TRANSITIONS } from '../lib/transitions'
import { getStateLabel } from './OrderStateBadge'

interface ChangeStateFormProps {
  currentState: EstadoPedidoCodigo
  onSubmit: (dto: CambioEstadoDto) => void
  onCancel: () => void
  isPending?: boolean
}

export function ChangeStateForm({
  currentState,
  onSubmit,
  onCancel,
  isPending = false,
}: ChangeStateFormProps) {
  const allowedStates = TRANSITIONS[currentState]
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedidoCodigo | ''>(
    allowedStates[0] ?? '',
  )
  const [observaciones, setObservaciones] = useState('')

  if (allowedStates.length === 0) {
    return (
      <div className="flex flex-col gap-stack-md">
        <p className="text-body-sm text-on-surface-variant">
          El pedido está en estado{' '}
          <strong className="text-on-surface">{getStateLabel(currentState)}</strong>.
          No tiene transiciones disponibles — es un estado final.
        </p>
        <div className="flex justify-end">
          <ButtonGeneric info="Cerrar" type="Secondary" onClick={onCancel} />
        </div>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (nuevoEstado === '') return
    onSubmit({
      nuevo_estado: nuevoEstado,
      observaciones: observaciones.trim() === '' ? null : observaciones.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
      <p className="text-body-sm text-on-surface-variant">
        Estado actual:{' '}
        <strong className="text-primary">{getStateLabel(currentState)}</strong>
      </p>

      <SelectField
        label="Nuevo estado"
        value={nuevoEstado}
        onChange={(v) => setNuevoEstado(v as EstadoPedidoCodigo)}
        options={allowedStates.map((s) => ({ value: s, label: getStateLabel(s) }))}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-label-caps text-primary">
          Observaciones <span className="text-rb-bone/40">(opcional)</span>
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full bg-rb-charcoal border border-white/10 rounded-sm px-3 py-2 text-body-sm text-rb-bone focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Notas internas sobre el cambio de estado"
        />
        <p className="text-data-mono text-rb-bone/40 text-[11px] self-end">
          {observaciones.length}/500
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <ButtonGeneric
          info="Cancelar"
          type="Secondary"
          onClick={onCancel}
          disabled={isPending}
        />
        <ButtonGeneric
          info={isPending ? 'Guardando...' : 'Cambiar estado'}
          submit
          disabled={isPending || nuevoEstado === ''}
        />
      </div>
    </form>
  )
}
