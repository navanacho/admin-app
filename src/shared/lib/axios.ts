import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { getApiBase } from './config'

export const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true, // Incluye la cookie HttpOnly en cada request
  timeout: 10_000,
  headers: {
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request ───────────────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    console.error('Error en request:', error)
    return Promise.reject(error)
  },
)

// ── Response ──────────────────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Importamos el store en tiempo de ejecución para evitar circular imports
      import('@/features/auth/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout()
      })
      // Redirigimos al login solo si no estamos ya en /login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
