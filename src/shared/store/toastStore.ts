import { create } from 'zustand'

export type ToastVariant = 'success' | 'error'

export interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message?: string
  durationMs: number
}

export interface ToastInput {
  variant: ToastVariant
  title: string
  message?: string
  durationMs?: number
}

interface ToastState {
  toasts: Toast[]
  push: (input: ToastInput) => string
  dismiss: (id: string) => void
}

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
}

function nextId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (input) => {
    const id = nextId()
    const durationMs = input.durationMs ?? DEFAULT_DURATION[input.variant]
    const toast: Toast = {
      id,
      variant: input.variant,
      title: input.title,
      message: input.message,
      durationMs,
    }

    set((state) => ({ toasts: [...state.toasts, toast] }))

    if (durationMs > 0) {
      setTimeout(() => get().dismiss(id), durationMs)
    }

    return id
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
