import { apiClient } from '@/shared/lib/axios'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function getCategoryById(id: number): Promise<Category> {
  const { data } = await apiClient.get<Category>(`/categories/${id}`)
  return data
}

export async function createCategory(dto: CreateCategoryDto): Promise<Category> {
  const { data } = await apiClient.post<Category>('/categories', dto)
  return data
}

export async function updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
  const { data } = await apiClient.put<Category>(`/categories/${id}`, dto)
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}
