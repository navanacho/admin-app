import type { ReactNode, RefObject } from 'react'
import { Modal } from './Modal'
import { ButtonGeneric } from './ButtonGeneric'

interface ConfirmModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>
  title: string
  /** Mensaje o nodo descriptivo de la acción a confirmar */
  message: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

/**
 * Modal de confirmación genérico.
 * El padre controla apertura/cierre vía dialogRef.
 *
 * Uso:
 *   <ConfirmModal
 *     dialogRef={ref}
 *     title="Desactivar ingrediente"
 *     message={<>¿Desactivar <strong>Pan brioche</strong>?</>}
 *     confirmLabel="Desactivar"
 *     onConfirm={handleDeactivate}
 *     onCancel={() => ref.current?.close()}
 *   />
 */
export function ConfirmModal({
  dialogRef,
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
  isPending = false,
}: ConfirmModalProps) {
  return (
    <Modal dialogRef={dialogRef} title={title}>
      <div className="flex flex-col gap-stack-lg">
        <p className="text-body-sm text-rb-bone/70">{message}</p>

        <div className="flex justify-end gap-stack-md">
          <ButtonGeneric
            info="Cancelar"
            type="Secondary"
            onClick={onCancel}
            disabled={isPending}
          />
          <ButtonGeneric
            info={isPending ? 'Procesando…' : confirmLabel}
            type="Primary"
            onClick={onConfirm}
            disabled={isPending}
          />
        </div>
      </div>
    </Modal>
  )
}
