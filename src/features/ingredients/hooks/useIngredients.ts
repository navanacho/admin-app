import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  activateIngredient,
} from "../services/ingredientService";
import type { CreateIngredientDto, UpdateIngredientDto } from "../types";
import { extractErrorMessage, toast } from "@/shared/lib/toast";

const QUERY_KEY = "ingredients";

export const useIngredients = () => {
  function useIngredientsQuery(offset: number, limit: number, name?: string) {
    return useQuery({
      queryKey: [QUERY_KEY, offset, limit, name ?? ""],
      queryFn: () => getIngredients(offset, limit, name),
    });
  }

  function useIngredientById(id: number) {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => getIngredientById(id),
      enabled: id > 0,
    });
  }

  function useCreateIngredient() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (dto: CreateIngredientDto) => createIngredient(dto),
      onSuccess: (ingredient) => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        qc.invalidateQueries({ queryKey: ['products'] });
        toast.success("Ingrediente creado", ingredient.name);
      },
      onError: (err) =>
        toast.error("No se pudo crear el ingrediente", extractErrorMessage(err)),
    });
  }

  function useUpdateIngredient() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, dto }: { id: number; dto: UpdateIngredientDto }) =>
        updateIngredient(id, dto),
      onSuccess: (ingredient, { id }) => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        qc.invalidateQueries({ queryKey: [QUERY_KEY, id] });
        qc.invalidateQueries({ queryKey: ['products'] });
        toast.success("Ingrediente actualizado", ingredient.name);
      },
      onError: (err) =>
        toast.error(
          "No se pudo actualizar el ingrediente",
          extractErrorMessage(err),
        ),
    });
  }

  function useDeleteIngredient() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => deleteIngredient(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        qc.invalidateQueries({ queryKey: ['products'] });
        toast.success("Ingrediente eliminado");
      },
      onError: (err) =>
        toast.error(
          "No se pudo eliminar el ingrediente",
          extractErrorMessage(err),
        ),
    });
  }

  /**
   * Devuelve los ingredientes con stock por debajo del threshold.
   *
   * ⚠ TODO: reemplazar por endpoint dedicado `/ingredientes/low-stock?threshold=N`
   *         cuando exista. Por ahora trae los primeros 100 y filtra en cliente.
   */
  function useLowStockIngredients(threshold = 10) {
    return useQuery({
      queryKey: [QUERY_KEY, "low-stock", threshold],
      queryFn: () => getIngredients(0, 100),
      select: (result) => ({
        items: result.data
          .filter((i) => i.is_active && i.stock_quantity < threshold)
          .sort((a, b) => a.stock_quantity - b.stock_quantity),
        threshold,
      }),
    });
  }

  function useActivateIngredient() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => activateIngredient(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QUERY_KEY] });
        qc.invalidateQueries({ queryKey: ['products'] });
        toast.success("Ingrediente activado");
      },
      onError: (err) =>
        toast.error(
          "No se pudo activar el ingrediente",
          extractErrorMessage(err),
        ),
    });
  }

  return {
    useIngredientsQuery,
    useIngredientById,
    useCreateIngredient,
    useUpdateIngredient,
    useDeleteIngredient,
    useLowStockIngredients,
    useActivateIngredient,
  };
};
