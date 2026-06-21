import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductAvailability,
  type ProductFilters,
} from "../services/productService";
import type { CreateProductDto, UpdateProductDto } from "../types";
import { toast, extractErrorMessage } from "@/shared/lib/toast";

const QUERY_KEY = "products";
export const useProducts = () => {
  function useProductsQuery(
    offset: number,
    limit: number,
    includeDeleted = false,
    filters: ProductFilters = {},
  ) {
    return useQuery({
      queryKey: [QUERY_KEY, offset, limit, includeDeleted, filters],
      queryFn: () => getProducts(offset, limit, includeDeleted, filters),
    });
  }
  function useProductById(id: number) {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => getProductById(id),
      enabled: id > 0,
    });
  }
  function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (dto: CreateProductDto) => createProduct(dto),
      onSuccess: (product) => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success("Producto creado", product.name);
      },
      onError: (err) =>
        toast.error("No se pudo crear el producto", extractErrorMessage(err)),
    });
  }
  function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) =>
        updateProduct(id, dto),
      onSuccess: (product, { id }) => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        qc.invalidateQueries({ queryKey: [QUERY_KEY, id] });
        toast.success("Producto actualizado", product.name);
      },
      onError: (err) =>
        toast.error(
          "No se pudo actualizar el producto",
          extractErrorMessage(err),
        ),
    });
  }
  function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => deleteProduct(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success("Producto eliminado");
      },
      onError: (err) =>
        toast.error(
          "No se pudo eliminar el producto",
          extractErrorMessage(err),
        ),
    });
  }
  function useSetProductAvailability() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, available }: { id: number; available: boolean }) =>
        setProductAvailability(id, available),
      onSuccess: (_data, { available }) => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success(available ? "Venta reanudada" : "Venta pausada");
      },
      onError: (err) =>
        toast.error(
          "No se pudo cambiar la disponibilidad",
          extractErrorMessage(err),
        ),
    });
  }
  function /**
   * Devuelve los productos con stock por debajo del threshold.
   *
   * ⚠ TODO: Reemplazar por un endpoint dedicado `/products/low-stock?threshold=N`
   *         cuando el backend lo implemente. Por ahora trae los primeros 100 y
   *         filtra en cliente — válido para datasets chicos.
   */
  useLowStockProducts() {
    return useQuery({
      queryKey: [QUERY_KEY, "low-stock"],
      queryFn: () => getProducts(0, 100),
      select: (result) => ({
        items: result.data
          .filter((p) => p.deleted_at == null)
          .filter((p) => {
            const stock =
              p.ingredients.length > 0 ? p.available_stock : p.stock_quantity;
            return stock <= 0;
          })
          .sort((a, b) => {
            const stockA =
              a.ingredients.length > 0 ? a.available_stock : a.stock_quantity;
            const stockB =
              b.ingredients.length > 0 ? b.available_stock : b.stock_quantity;
            return stockA - stockB;
          }),
      }),
    });
  }
  return {
    ...useProducts,
    useProductsQuery,
    useProductById,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    useSetProductAvailability,
    useLowStockProducts,
  };
};
