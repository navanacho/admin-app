import { apiClient } from '@/shared/lib/axios'
import type {
  Product,
  ProductList,
  CreateProductDto,
  UpdateProductDto,
} from '../types'

export async function getProducts(offset: number, limit: number): Promise<ProductList> {
  const { data } = await apiClient.get<ProductList>('/products', {
    params: { offset, limit },
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

export async function activateProduct(id: number): Promise<void> {
  await apiClient.post(`/products/${id}/activate`)
}
