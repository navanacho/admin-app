import { apiClient } from '@/shared/lib/axios'
import type { Ingredient, IngredientList, CreateIngredientDto, UpdateIngredientDto } from '../types'

export async function getIngredients(
  offset: number,
  limit: number,
  name?: string,
): Promise<IngredientList> {
  const params: Record<string, unknown> = { offset, limit }
  if (name) params.name = name
  const { data } = await apiClient.get<IngredientList>('/ingredients', { params })
  return data
}

export async function getIngredientById(id: number): Promise<Ingredient> {
  const { data } = await apiClient.get<Ingredient>(`/ingredients/${id}`)
  return data
}

export async function createIngredient(dto: CreateIngredientDto): Promise<Ingredient> {
  const { data } = await apiClient.post<Ingredient>('/ingredients', dto)
  return data
}

export async function updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
  const { data } = await apiClient.patch<Ingredient>(`/ingredients/${id}`, dto)
  return data
}

export async function deleteIngredient(id: number): Promise<void> {
  await apiClient.delete(`/ingredients/${id}`)
}

export async function activateIngredient(id: number): Promise<void> {
  await apiClient.post(`/ingredients/${id}/activate`)
}
