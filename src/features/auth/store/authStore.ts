import { create } from 'zustand'
import type { User } from '../types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: AuthStatus
  login: (user: User) => void
  logout: () => void
  setUnauthenticated: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: 'loading',
  login: (user) => set({ user, status: 'authenticated' }),
  logout: () => set({ user: null, status: 'unauthenticated' }),
  setUnauthenticated: () => set({ user: null, status: 'unauthenticated' }),
}))
