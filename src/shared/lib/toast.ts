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

// Forma del error uniforme que devuelve la API.
// { error: { code, message, request_id, timestamp, fields? } }
type ApiErrorField = {
  field: string
  message: string
  type: string
}

type ApiError = {
  code: string
  message: string
  request_id?: string
  timestamp?: string
  fields?: ApiErrorField[]
}

// "body.base_price" -> "base_price" (nos quedamos con la última parte)
function cleanFieldName(field: string): string {
  const parts = field.split('.')
  return parts[parts.length - 1]
}

// Extrae el mensaje más útil de un error de mutation.
// Usa el envelope nuevo de la API (error.code / error.message) y deja un
// fallback al formato viejo de FastAPI (detail) por si algún endpoint no migró.
export function extractErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data
    const apiError = data?.error as ApiError | undefined

    if (apiError) {
      // 422: armamos el mensaje listando los campos que fallaron
      if (apiError.code === 'validation_error' && apiError.fields && apiError.fields.length > 0) {
        return apiError.fields
          .map((f) => `${cleanFieldName(f.field)}: ${f.message}`)
          .join(' · ')
      }

      // 500: sumamos el request_id para poder reportar el bug a soporte
      if (apiError.code === 'internal_error' || apiError.code === 'database_error') {
        if (apiError.request_id) {
          return `${apiError.message} (ref: ${apiError.request_id})`
        }
      }

      if (typeof apiError.message === 'string') return apiError.message
    }

    // Compatibilidad con el formato viejo de FastAPI
    const detail = data?.detail
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
