import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useToastStore, type Toast } from '@/shared/store/toastStore'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const ref = useRef<HTMLDivElement>(null)

  // Los modales usan <dialog>.showModal(), que coloca el dialog y su ::backdrop
  // (con el blur) en el "top layer" del navegador — por encima de cualquier
  // z-index del flujo normal. Para que los toasts queden por encima del blur,
  // los promovemos también al top layer vía la Popover API, re-mostrándolos
  // cada vez que cambia la lista para que entren por encima del modal abierto.
  const count = toasts.length
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (count > 0) {
      try {
        el.hidePopover()
      } catch {
        /* aún no estaba mostrado */
      }
      el.showPopover()
    } else {
      try {
        el.hidePopover()
      } catch {
        /* ya estaba oculto */
      }
    }
  }, [count])

  return (
    <div
      ref={ref}
      popover="manual"
      className="fixed inset-auto bottom-margin-desktop right-margin-desktop top-auto left-auto m-0 border-0 bg-transparent p-0 z-50 flex flex-col gap-stack-sm pointer-events-none"
      role="region"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  const isError = toast.variant === 'error'

  const shadow = isError ? 'shadow-red' : 'shadow-ink'
  const dot = isError ? 'bg-danger' : 'bg-success'
  const label = isError ? 'ERROR' : 'ÉXITO'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`pointer-events-auto animate-toast-in flex items-start gap-3 bg-rb-charcoal text-rb-bone p-4 rounded-md ${shadow} min-w-[280px] max-w-[400px]`}
    >
      <span
        className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${dot} animate-toast-pulse`}
        aria-hidden="true"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-label-caps text-[10px] leading-tight text-rb-bone/70">
          {label}
        </span>
        <span className="font-bold text-body-sm leading-snug">{toast.title}</span>
        {toast.message && (
          <span className="text-body-sm text-rb-bone/80 mt-0.5 break-words">
            {toast.message}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 -m-1 text-rb-bone/60 hover:text-rb-bone rounded-sm transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  )
}
