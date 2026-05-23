import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  activateIngredient,
} from '../services/ingredientService'
import type { CreateIngredientDto, UpdateIngredientDto } from '../types'

const QUERY_KEY = 'ingredients'

export function useIngredients(offset: number, limit: number) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit], // cambia la query cuando cambia la página
    queryFn:  () => getIngredients(offset, limit),
  })
}

export function useIngredientById(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => getIngredientById(id),
    enabled:  id > 0,
  })
}

export function useCreateIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateIngredientDto) => createIngredient(dto),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateIngredientDto }) => updateIngredient(id, dto),
    onSuccess:  (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
    },
  })
}

export function useDeleteIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useActivateIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activateIngredient(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
