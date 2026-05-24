import { AxiosError } from 'axios'
import { useToastStore } from '@/shared/store/toastStore'

export const toast = {
  success(title: string, message?: string, durationMs?: number) {
    return useToastStore.getState().push({ variant: 'success', title, message, durationMs })
  },
  error(title: string, message?: string, durationMs?: number) {
    return useToastStore.getState().push({ variant: 'error', title, message, durationMs })
  },
  dismiss(id: string) {
    useToastStore.getState().dismiss(id)
  },
}

// Extrae el mensaje más útil de un error de mutation.
// Prioriza el `detail` que devuelve FastAPI (puede ser string o lista de validación).
export function extractErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (err instanceof AxiosError) {
    const detail = err.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0]
      if (typeof first?.msg === 'string') return first.msg
    }
    if (err.message) return err.message
  }
  if (err instanceof Error) return err.message
  return fallback
}
