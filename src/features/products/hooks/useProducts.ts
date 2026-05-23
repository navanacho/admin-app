import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  activateProduct,
} from '../services/productService'
import type { CreateProductDto, UpdateProductDto } from '../types'

const QUERY_KEY = 'products'

export function useProducts(offset: number, limit: number) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit],
    queryFn:  () => getProducts(offset, limit),
  })
}

export function useProductById(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => getProductById(id),
    enabled:  id > 0,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) => updateProduct(id, dto),
    onSuccess:  (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useActivateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activateProduct(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

/**
 * Devuelve los productos con stock por debajo del threshold.
 *
 * ⚠ TODO: Reemplazar por un endpoint dedicado `/products/low-stock?threshold=N`
 *         cuando el backend lo implemente. Por ahora trae los primeros 100 y
 *         filtra en cliente — válido para datasets chicos.
 */
export function useLowStockProducts(threshold = 10) {
  return useQuery({
    queryKey: [QUERY_KEY, 'low-stock', threshold],
    queryFn:  () => getProducts(0, 100),
    select:   (result) => ({
      items: result.data
        .filter((p) => p.deleted_at == null && p.stock_quantity < threshold)
        .sort((a, b) => a.stock_quantity - b.stock_quantity),
      threshold,
    }),
  })
}
