import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  activateCategory,
} from '../services/categoryService'
import type { CreateCategoryDto, UpdateCategoryDto } from '../types'

const QUERY_KEY = 'categories'

export function useCategories(offset = 0, limit = 100) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit],
    queryFn:  () => getCategories(offset, limit),
  })
}

export function useCategoryById(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => getCategoryById(id),
    enabled:  id > 0,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoryDto }) => updateCategory(id, dto),
    onSuccess:  (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useActivateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activateCategory(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
