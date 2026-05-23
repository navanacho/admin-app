import type { ReactNode, RefObject } from 'react'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  /** Ref del elemento <dialog> — el padre lo controla con showModal() / close() */
  dialogRef: RefObject<HTMLDialogElement | null>
  title: string
  children: ReactNode
  /** Tamaño del modal: sm=480, md=640, lg=800, xl=960. Default: sm */
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'w-120',          // ≈ 480px (el tamaño actual)
  md: 'w-[640px]',
  lg: 'w-[800px]',
  xl: 'w-[960px]',
}

/**
 * Modal genérico basado en el elemento nativo <dialog>.
 * El padre abre con dialogRef.current?.showModal()
 * y cierra con dialogRef.current?.close().
 *
 * Backdrop y centrado son manejados por el navegador automáticamente.
 */
export function Modal({ dialogRef, title, children, size = 'sm' }: ModalProps) {
  return (
    <dialog
      ref={dialogRef}
      className={`${sizeClasses[size]} max-w-[90vw] max-h-[90vh] rounded-lg bg-rb-ink shadow-ink p-0 border-0 m-auto`}
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

      {/* Contenido — scroll si es muy alto */}
      <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-65px)]">
        {children}
      </div>
    </dialog>
  )
}
