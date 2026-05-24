import { apiClient } from '@/shared/lib/axios'
import type {
  Category,
  CategoryList,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types'

export async function getCategories(
  offset: number,
  limit: number,
  name?: string,
): Promise<CategoryList> {
  const params: Record<string, unknown> = { offset, limit }
  if (name) params.name = name
  const { data } = await apiClient.get<CategoryList>('/categories', { params })
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
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, dto)
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}

export async function activateCategory(id: number): Promise<void> {
  await apiClient.post(`/categories/${id}/activate`)
}
