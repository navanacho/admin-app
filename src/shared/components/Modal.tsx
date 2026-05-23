import type { ReactNode, RefObject } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  /** Ref del elemento <dialog> — el padre lo controla con showModal() / close() */
  dialogRef: RefObject<HTMLDialogElement | null>
  title: string
  children: ReactNode
}

/**
 * Modal genérico basado en el elemento nativo <dialog>.
 * El padre abre con dialogRef.current?.showModal()
 * y cierra con dialogRef.current?.close().
 *
 * Backdrop y centrado son manejados por el navegador automáticamente.
 */
export function Modal({ dialogRef, title, children }: ModalProps) {
  return (
    <dialog
      ref={dialogRef}
      className="w-[480px] max-w-[90vw] rounded-lg bg-rb-ink shadow-ink p-0 border-0 m-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-headline-md text-rb-bone">{title}</h2>
        <button
          type="button"
          onClick={() => dialogRef?.current?.close()}
          className="p-1.5 text-rb-bone/50 hover:text-rb-bone rounded-sm transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Contenido */}
      <div className="px-6 py-5">
        {children}
      </div>
    </dialog>
  )
}
