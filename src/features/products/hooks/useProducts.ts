import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductAvailability,
  type ProductFilters,
} from '../services/productService'
import type { CreateProductDto, UpdateProductDto } from '../types'
import { toast, extractErrorMessage } from '@/shared/lib/toast'

const QUERY_KEY = 'products'

export function useProducts(
  offset: number,
  limit: number,
  includeDeleted = false,
  filters: ProductFilters = {},
) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit, includeDeleted, filters],
    queryFn:  () => getProducts(offset, limit, includeDeleted, filters),
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
    onSuccess:  (product) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Producto creado', product.name)
    },
    onError: (err) => toast.error('No se pudo crear el producto', extractErrorMessage(err)),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) => updateProduct(id, dto),
    onSuccess:  (product, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
      toast.success('Producto actualizado', product.name)
    },
    onError: (err) => toast.error('No se pudo actualizar el producto', extractErrorMessage(err)),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Producto eliminado')
    },
    onError: (err) => toast.error('No se pudo eliminar el producto', extractErrorMessage(err)),
  })
}

export function useSetProductAvailability() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, available }: { id: number; available: boolean }) =>
      setProductAvailability(id, available),
    onSuccess:  (_data, { available }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(available ? 'Venta reanudada' : 'Venta pausada')
    },
    onError: (err) => toast.error('No se pudo cambiar la disponibilidad', extractErrorMessage(err)),
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
