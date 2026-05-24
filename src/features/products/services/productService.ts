import { apiClient } from '@/shared/lib/axios'
import type {
  Product,
  ProductList,
  CreateProductDto,
  UpdateProductDto,
} from '../types'

export interface ProductFilters {
  name?: string
  categoryId?: number
  cascade?: boolean
  priceMin?: number
  priceMax?: number
  ingredientIds?: number[]
  available?: boolean
}

export async function getProducts(
  offset: number,
  limit: number,
  includeDeleted = false,
  filters: ProductFilters = {},
): Promise<ProductList> {
  const params: Record<string, unknown> = {
    offset,
    limit,
    include_deleted: includeDeleted,
  }
  if (filters.name)              params.name         = filters.name
  if (filters.categoryId != null) params.category_id = filters.categoryId
  if (filters.cascade != null)    params.cascade     = filters.cascade
  if (filters.priceMin != null)   params.price_min   = filters.priceMin
  if (filters.priceMax != null)   params.price_max   = filters.priceMax
  if (filters.available != null)  params.available   = filters.available
  if (filters.ingredientIds && filters.ingredientIds.length > 0) {
    params.ingredient_ids = filters.ingredientIds
  }

  const { data } = await apiClient.get<ProductList>('/products', {
    params,
    // Repite la clave para listas: ingredient_ids=1&ingredient_ids=2
    paramsSerializer: { indexes: null },
  })
  return data
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', dto)
  return data
}

export async function updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, dto)
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}

export async function setProductAvailability(id: number, available: boolean): Promise<void> {
  await apiClient.patch(`/products/${id}/availability`, { available })
}
